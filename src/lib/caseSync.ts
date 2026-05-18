import { supabase } from './supabase'
import type { ColumnMapping, FileMetadata, InputUnit, SimulationParams } from '../types'
import type { CostParams } from '../types/cost'

export interface CaseSummary {
  milestone: number
  dayCount: number
  dateRange: { from: string; to: string } | null
  diagnose: { modell?: string; defektArt?: string; ampel?: string } | null
}

export interface CloudState {
  fileMetadataList: Array<Omit<FileMetadata, 'importTimestamp'> & { importTimestamp: string }>
  columnMapping: ColumnMapping
  inputIsUTC: boolean
  inputUnit: InputUnit
  simulationParams: SimulationParams
  costParams: CostParams
  costCapOverrides: Record<number, boolean>
  diagnose: Record<string, unknown> | null
  summary: CaseSummary | null
}

export interface SharedCaseRow {
  id: string
  user_email: string | null
  updated_at: string
  state: CloudState
}

export async function saveCase(state: CloudState, userEmail?: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('sp_cases')
    .upsert(
      {
        user_id:    user.id,
        user_email: userEmail ?? user.email ?? null,
        state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select('id')
    .single()

  if (error) { console.warn('caseSync.save failed:', error.message); return null }
  return data?.id ?? null
}

export async function loadCase(): Promise<CloudState | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('sp_cases')
    .select('state')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) { console.warn('caseSync.load failed:', error.message); return null }
  return (data?.state as CloudState) ?? null
}

export async function loadSharedCases(): Promise<SharedCaseRow[]> {
  const { data, error } = await supabase
    .from('sp_cases')
    .select('id, user_email, updated_at, state')
    .not('shared_with', 'is', null)
    .order('updated_at', { ascending: false })

  if (error) { console.warn('caseSync.loadShared failed:', error.message); return [] }
  return (data ?? []) as SharedCaseRow[]
}

export async function shareCase(lawyerEmail: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('share_case_with_lawyer', {
    lawyer_email: lawyerEmail,
  })
  if (error) { console.warn('caseSync.share failed:', error.message); return false }
  return data === true
}

export async function unshareCase(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase
    .from('sp_cases')
    .update({ shared_with: null })
    .eq('user_id', user.id)
}

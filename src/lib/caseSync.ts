import { supabase } from './supabase'
import type { ColumnMapping, FileMetadata, InputUnit, SimulationParams } from '../types'
import type { CostParams } from '../types/cost'

export interface CloudState {
  fileMetadataList: Array<Omit<FileMetadata, 'importTimestamp'> & { importTimestamp: string }>
  columnMapping: ColumnMapping
  inputIsUTC: boolean
  inputUnit: InputUnit
  simulationParams: SimulationParams
  costParams: CostParams
  costCapOverrides: Record<number, boolean>
  diagnose: Record<string, unknown> | null
}

export async function saveCase(state: CloudState): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('sp_cases')
    .upsert(
      { user_id: user.id, state, updated_at: new Date().toISOString() },
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

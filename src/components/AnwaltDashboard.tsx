import { useEffect, useState } from 'react'
import { loadSharedCases, type SharedCaseRow } from '../lib/caseSync'

interface AnwaltDashboardProps {
  onOpenCase: (row: SharedCaseRow) => void
}

const AMPEL_LABEL: Record<string, string> = {
  gruen: '🟢 annehmen',
  gelb:  '🟡 prüfen',
  rot:   '🔴 ablehnen',
}

const DEFEKT_LABEL: Record<string, string> = {
  totalausfall: 'Totalausfall',
  drosselung:   'Drosselung 70%',
  teilausfall:  'Teilausfall',
  sonstiges:    'Sonstiges',
}

const MILESTONE_LABEL: Record<number, string> = {
  1: 'M1 Diagnose',
  2: 'M2 Export',
  3: 'M3 Analyse',
  4: 'M4 Anwalt',
  5: 'M5 Briefing',
}

export function AnwaltDashboard({ onOpenCase }: AnwaltDashboardProps) {
  const [cases, setCases]   = useState<SharedCaseRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSharedCases().then(rows => {
      setCases(rows)
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Meine Fälle</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fälle, die Mandanten mit dir geteilt haben.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && cases.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">Noch keine geteilten Fälle.</p>
          <p className="text-xs mt-1">Deine Mandanten können ihren Fall über „Mit Anwalt teilen" freigeben.</p>
        </div>
      )}

      {!loading && cases.length > 0 && (
        <div className="space-y-3">
          {cases.map(row => {
            const s = row.state.summary
            const ampel   = s?.diagnose?.ampel
            const defekt  = s?.diagnose?.defektArt
            const modell  = s?.diagnose?.modell
            const updated = new Date(row.updated_at).toLocaleDateString('de-DE', {
              day: '2-digit', month: '2-digit', year: 'numeric',
            })

            return (
              <button
                key={row.id}
                onClick={() => onOpenCase(row)}
                className="w-full text-left bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {row.user_email ?? 'Unbekannter Mandant'}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-sm text-gray-500">
                      {modell  && <span>{modell}</span>}
                      {defekt  && <span>{DEFEKT_LABEL[defekt] ?? defekt}</span>}
                      {s?.dayCount != null && s.dayCount > 0 && (
                        <span>{s.dayCount} Tage Daten</span>
                      )}
                      {s?.dateRange && (
                        <span className="text-xs text-gray-400">
                          {s.dateRange.from} – {s.dateRange.to}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {ampel && (
                      <span className="text-xs font-medium">
                        {AMPEL_LABEL[ampel] ?? ampel}
                      </span>
                    )}
                    {s?.milestone != null && (
                      <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                        {MILESTONE_LABEL[s.milestone] ?? `M${s.milestone}`}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{updated}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

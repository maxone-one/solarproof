import { useState } from 'react'
import { shareCase, unshareCase } from '../lib/caseSync'

interface ShareCaseButtonProps {
  sharedWith?: string | null // existing shared lawyer email (for display)
}

export function ShareCaseButton({ sharedWith }: ShareCaseButtonProps) {
  const [open,    setOpen]    = useState(false)
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error' | 'not_found'>('idle')

  async function handleShare() {
    if (!email.trim()) return
    setStatus('loading')
    const ok = await shareCase(email.trim().toLowerCase())
    setStatus(ok ? 'success' : 'not_found')
    if (ok) setTimeout(() => setOpen(false), 1500)
  }

  async function handleUnshare() {
    await unshareCase()
    setStatus('idle')
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-3 py-1.5 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Mit Anwalt teilen
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Fall mit Anwalt teilen</h3>
            <p className="text-sm text-gray-500 mb-4">
              Dein Anwalt bekommt Lesezugriff auf deine Diagnose, Import-Daten und Simulations-Parameter.
              Die CSV-Datei bleibt nur bei dir.
            </p>

            {sharedWith && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center justify-between gap-2">
                <span>Geteilt mit <strong>{sharedWith}</strong></span>
                <button onClick={handleUnshare} className="text-xs text-red-500 hover:text-red-700 underline">
                  Freigabe entfernen
                </button>
              </div>
            )}

            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setStatus('idle') }}
                onKeyDown={e => e.key === 'Enter' && handleShare()}
                placeholder="anwalt@kanzlei.de"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />

              {status === 'not_found' && (
                <p className="text-xs text-red-600">
                  Kein Anwalt-Account mit dieser E-Mail gefunden. Bitte prüfe die Adresse.
                </p>
              )}
              {status === 'error' && (
                <p className="text-xs text-red-600">Fehler beim Teilen — bitte erneut versuchen.</p>
              )}
              {status === 'success' && (
                <p className="text-xs text-green-600">✓ Fall erfolgreich geteilt.</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleShare}
                  disabled={status === 'loading' || !email.trim()}
                  className="flex-1 bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {status === 'loading' ? 'Teilen …' : 'Teilen'}
                </button>
                <button
                  onClick={() => { setOpen(false); setStatus('idle') }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

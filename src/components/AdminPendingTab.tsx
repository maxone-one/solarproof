import { useState, useEffect } from 'react'
import { fetchPendingLawyers, approveLawyer, rejectLawyer, type Lawyer } from '../data/lawyers'

export function PendingTab() {
  const [pending, setPending] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [acting, setActing]   = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      setPending(await fetchPendingLawyers())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  async function approve(id: string) {
    setActing(id)
    try {
      await approveLawyer(id)
      setPending(prev => prev.filter(l => l.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setActing(null)
    }
  }

  async function reject(id: string) {
    setActing(id)
    try {
      await rejectLawyer(id)
      setPending(prev => prev.filter(l => l.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="px-6 py-5 space-y-4">
      <div className="flex justify-end">
        <button onClick={load} disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {loading ? '…' : 'Neu laden'}
        </button>
      </div>

      {error && <p className="text-xs text-red-500 break-all">{error}</p>}

      {!loading && pending.length === 0 && !error && (
        <p className="text-sm text-gray-400 text-center py-6">Keine ausstehenden Einreichungen.</p>
      )}

      <div className="space-y-3">
        {pending.map(l => (
          <div key={l.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-gray-900">{l.name}</p>
                <p className="text-xs text-gray-500">{l.kanzlei}</p>
                <p className="text-xs text-gray-400">{l.plz} {l.ort} · {l.bundesland}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => approve(l.id)}
                  disabled={acting === l.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {acting === l.id ? '…' : '✓ Freigeben'}
                </button>
                <button
                  onClick={() => reject(l.id)}
                  disabled={acting === l.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            {l.website && <p className="text-xs text-blue-600">{l.website}</p>}
            {l.beschreibung && (
              <p className="text-xs text-gray-600 bg-white border border-gray-100 rounded-lg px-3 py-2 leading-relaxed">
                „{l.beschreibung}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

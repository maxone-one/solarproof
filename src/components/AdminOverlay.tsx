import { useState } from 'react'
import { addLawyer, fetchPendingLawyers, approveLawyer, rejectLawyer, plzToBundesland, type Lawyer } from '../data/lawyers'

interface Props {
  onClose: () => void
}

const EMPTY_FORM = {
  adminKey: '',
  name: '',
  kanzlei: '',
  email: '',
  website: '',
  phone: '',
  plz: '',
  ort: '',
  schwerpunkteRaw: 'SENEC, Produkthaftung',
  senec_faelle: '0',
  erstberatung_kostenlos: true,
  erstberatung_eur: '',
  beschreibung: '',
  listing_typ: 'kostenlos' as Lawyer['listing_typ'],
}

// ── Tab: Anwalt hinzufügen ────────────────────────────────────────────────────

function AddTab({ savedKey, onKeySaved }: { savedKey: string; onKeySaved: (k: string) => void }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, adminKey: savedKey })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  function set(k: keyof typeof EMPTY_FORM, v: string | boolean) {
    setForm(prev => ({ ...prev, [k]: v }))
    if (k === 'adminKey') onKeySaved(v as string)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await addLawyer({
        name: form.name,
        kanzlei: form.kanzlei,
        email: form.email || undefined,
        website: form.website || undefined,
        phone: form.phone || undefined,
        plz: form.plz,
        ort: form.ort,
        bundesland: plzToBundesland(form.plz),
        schwerpunkte: form.schwerpunkteRaw.split(',').map(s => s.trim()).filter(Boolean),
        senec_faelle: parseInt(form.senec_faelle) || 0,
        erstberatung_kostenlos: form.erstberatung_kostenlos,
        erstberatung_eur: form.erstberatung_kostenlos ? null : (parseInt(form.erstberatung_eur) || null),
        beschreibung: form.beschreibung || undefined,
        listing_typ: form.listing_typ,
      }, form.adminKey)
      setStatus('ok')
      setForm(prev => ({ ...EMPTY_FORM, adminKey: prev.adminKey }))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setStatus('error')
    }
  }

  const field = (label: string, k: keyof typeof EMPTY_FORM, placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={form[k] as string}
        onChange={e => set(k, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
      />
    </div>
  )

  return (
    <form onSubmit={submit} className="px-6 py-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Admin-Key (Supabase Service Role Key)</label>
        <input
          type="password" required value={form.adminKey}
          onChange={e => set('adminKey', e.target.value)}
          placeholder="eyJ..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
        {field('Name', 'name', 'Dr. Max Mustermann')}
        {field('Kanzlei', 'kanzlei', 'Muster & Partner')}
        {field('E-Mail', 'email', 'kanzlei@example.de')}
        {field('Website', 'website', 'https://kanzlei.de')}
        {field('Telefon', 'phone', '+49 221 123456')}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">PLZ</label>
          <input
            type="text" required maxLength={5} pattern="\d{5}" value={form.plz}
            onChange={e => set('plz', e.target.value)} placeholder="44135"
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
          />
        </div>
        {field('Ort', 'ort', 'Dortmund')}
      </div>

      {field('Schwerpunkte (kommagetrennt)', 'schwerpunkteRaw', 'SENEC, Produkthaftung')}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">SENEC-Fälle</label>
          <input type="number" min={0} value={form.senec_faelle} onChange={e => set('senec_faelle', e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Listing-Typ</label>
          <select value={form.listing_typ} onChange={e => set('listing_typ', e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
            <option value="kostenlos">Kostenlos</option>
            <option value="basis">Basis</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="erstberatung_kostenlos" checked={form.erstberatung_kostenlos}
          onChange={e => set('erstberatung_kostenlos', e.target.checked)} className="rounded" />
        <label htmlFor="erstberatung_kostenlos" className="text-sm text-gray-700">Erstberatung kostenlos</label>
      </div>

      {!form.erstberatung_kostenlos && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Erstberatung EUR</label>
          <input type="number" min={0} value={form.erstberatung_eur}
            onChange={e => set('erstberatung_eur', e.target.value)} placeholder="190"
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" />
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Beschreibung (optional)</label>
        <textarea value={form.beschreibung} onChange={e => set('beschreibung', e.target.value)}
          rows={2} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none resize-none" />
      </div>

      {status === 'ok' && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">Anwalt erfolgreich hinzugefügt.</div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800 break-all">Fehler: {error}</div>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {status === 'loading' ? 'Speichert …' : 'Anwalt speichern'}
      </button>
    </form>
  )
}

// ── Tab: Ausstehende Einreichungen ────────────────────────────────────────────

function PendingTab({ savedKey, onKeySaved }: { savedKey: string; onKeySaved: (k: string) => void }) {
  const [adminKey, setAdminKey] = useState(savedKey)
  const [pending, setPending]   = useState<Lawyer[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [acting, setActing]     = useState<string | null>(null)

  async function load() {
    if (!adminKey) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchPendingLawyers(adminKey)
      setPending(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  async function approve(id: string) {
    setActing(id)
    try {
      await approveLawyer(id, adminKey)
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
      await rejectLawyer(id, adminKey)
      setPending(prev => prev.filter(l => l.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="px-6 py-5 space-y-4">
      <div className="flex gap-2">
        <input
          type="password" value={adminKey}
          onChange={e => { setAdminKey(e.target.value); onKeySaved(e.target.value) }}
          placeholder="Admin-Key (Service Role Key)"
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 focus:border-blue-400 focus:outline-none"
        />
        <button onClick={load} disabled={!adminKey || loading}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {loading ? '…' : 'Laden'}
        </button>
      </div>

      {error && <p className="text-xs text-red-500 break-all">{error}</p>}

      {!loading && pending.length === 0 && !error && (
        <p className="text-sm text-gray-400 text-center py-6">
          {adminKey ? 'Keine ausstehenden Einreichungen.' : 'Admin-Key eingeben und laden.'}
        </p>
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

// ── AdminOverlay ──────────────────────────────────────────────────────────────

export function AdminOverlay({ onClose }: Props) {
  const [tab, setTab]       = useState<'add' | 'pending'>('pending')
  const [savedKey, setSavedKey] = useState('')

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Admin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          {([['pending', 'Einreichungen prüfen'], ['add', 'Anwalt hinzufügen']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'pending'
          ? <PendingTab savedKey={savedKey} onKeySaved={setSavedKey} />
          : <AddTab     savedKey={savedKey} onKeySaved={setSavedKey} />
        }

      </div>
    </div>
  )
}

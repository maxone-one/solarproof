import { useState } from 'react'
import { addLawyer, plzToBundesland, type Lawyer } from '../data/lawyers'

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

export function AdminOverlay({ onClose }: Props) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  function set(k: keyof typeof EMPTY_FORM, v: string | boolean) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const bundesland = plzToBundesland(form.plz)
      await addLawyer({
        name: form.name,
        kanzlei: form.kanzlei,
        email: form.email || undefined,
        website: form.website || undefined,
        phone: form.phone || undefined,
        plz: form.plz,
        ort: form.ort,
        bundesland,
        schwerpunkte: form.schwerpunkteRaw.split(',').map(s => s.trim()).filter(Boolean),
        senec_faelle: parseInt(form.senec_faelle) || 0,
        erstberatung_kostenlos: form.erstberatung_kostenlos,
        erstberatung_eur: form.erstberatung_kostenlos ? null : (parseInt(form.erstberatung_eur) || null),
        beschreibung: form.beschreibung || undefined,
        listing_typ: form.listing_typ,
      }, form.adminKey)
      setStatus('ok')
      setForm(EMPTY_FORM)
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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Anwalt hinzufügen — Admin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Admin-Key (Supabase Service Role Key)</label>
            <input
              type="password"
              required
              value={form.adminKey}
              onChange={e => set('adminKey', e.target.value)}
              placeholder="eyJ..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 focus:border-blue-400 focus:outline-none"
            />
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
            {field('Name', 'name', 'Dr. Max Mustermann')}
            {field('Kanzlei', 'kanzlei', 'Muster & Partner Rechtsanwälte')}
            {field('E-Mail', 'email', 'kanzlei@example.de')}
            {field('Website', 'website', 'https://kanzlei-example.de')}
            {field('Telefon', 'phone', '+49 221 123456')}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">PLZ</label>
              <input
                type="text"
                required
                maxLength={5}
                pattern="\d{5}"
                value={form.plz}
                onChange={e => set('plz', e.target.value)}
                placeholder="44135"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
              />
            </div>
            {field('Ort', 'ort', 'Dortmund')}
          </div>

          {field('Schwerpunkte (kommagetrennt)', 'schwerpunkteRaw', 'SENEC, Produkthaftung, Kaufrecht')}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">SENEC-Fälle</label>
              <input
                type="number"
                min={0}
                value={form.senec_faelle}
                onChange={e => set('senec_faelle', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Listing-Typ</label>
              <select
                value={form.listing_typ}
                onChange={e => set('listing_typ', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              >
                <option value="kostenlos">Kostenlos</option>
                <option value="basis">Basis</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="erstberatung_kostenlos"
              checked={form.erstberatung_kostenlos}
              onChange={e => set('erstberatung_kostenlos', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="erstberatung_kostenlos" className="text-sm text-gray-700">Erstberatung kostenlos</label>
          </div>

          {!form.erstberatung_kostenlos && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Erstberatung EUR</label>
              <input
                type="number"
                min={0}
                value={form.erstberatung_eur}
                onChange={e => set('erstberatung_eur', e.target.value)}
                placeholder="190"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Beschreibung (optional)</label>
            <textarea
              value={form.beschreibung}
              onChange={e => set('beschreibung', e.target.value)}
              rows={2}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none resize-none"
            />
          </div>

          {status === 'ok' && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
              Anwalt erfolgreich hinzugefügt.
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800 break-all">
              Fehler: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? 'Speichert …' : 'Anwalt speichern'}
          </button>
        </form>
      </div>
    </div>
  )
}

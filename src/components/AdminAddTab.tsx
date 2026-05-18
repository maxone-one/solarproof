import { useState } from 'react'
import { addLawyer, plzToBundesland } from '../data/lawyers'

const EMPTY_FORM = {
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
  listing_typ: 'kostenlos' as 'kostenlos' | 'basis' | 'premium',
}

export function AddTab() {
  const [form, setForm] = useState({ ...EMPTY_FORM })
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
      })
      setStatus('ok')
      setForm({ ...EMPTY_FORM })
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
      <div className="grid grid-cols-2 gap-3">
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

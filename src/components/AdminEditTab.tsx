import { useState, useEffect } from 'react'
import { fetchAllLawyers, updateLawyer, deleteLawyer, plzToBundesland, type Lawyer } from '../data/lawyers'

function lawyerToForm(l: Lawyer) {
  return {
    name: l.name,
    kanzlei: l.kanzlei,
    email: l.email ?? '',
    website: l.website ?? '',
    phone: l.phone ?? '',
    plz: l.plz,
    ort: l.ort,
    schwerpunkteRaw: l.schwerpunkte.join(', '),
    senec_faelle: String(l.senec_faelle),
    erstberatung_kostenlos: l.erstberatung_kostenlos,
    erstberatung_eur: l.erstberatung_eur != null ? String(l.erstberatung_eur) : '',
    beschreibung: l.beschreibung ?? '',
    listing_typ: l.listing_typ,
    status: l.status ?? 'active',
  }
}

type LawyerForm = ReturnType<typeof lawyerToForm>

function EditLawyerCard({ lawyer, onSaved, onDeleted }: {
  lawyer: Lawyer
  onSaved: (updated: Lawyer) => void
  onDeleted: (id: string) => void
}) {
  const [open, setOpen]         = useState(false)
  const [form, setForm]         = useState<LawyerForm>(lawyerToForm(lawyer))
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError]       = useState('')
  const [ok, setOk]             = useState(false)

  function setF(k: keyof LawyerForm, v: string | boolean) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function save() {
    setSaving(true)
    setError('')
    setOk(false)
    try {
      const updates: Partial<Omit<Lawyer, 'id'>> = {
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
        status: form.status as 'active' | 'pending',
      }
      await updateLawyer(lawyer.id, updates)
      setOk(true)
      onSaved({ ...lawyer, ...updates })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  async function del() {
    if (!window.confirm(`${lawyer.name} wirklich löschen?`)) return
    setDeleting(true)
    try {
      await deleteLawyer(lawyer.id)
      onDeleted(lawyer.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setDeleting(false)
    }
  }

  const inp = (label: string, k: keyof LawyerForm, ph = '') => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type="text" value={form[k] as string} onChange={e => setF(k, e.target.value)}
        placeholder={ph}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none" />
    </div>
  )

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${lawyer.status === 'active' ? 'bg-green-500' : 'bg-amber-400'}`} />
          <div>
            <p className="text-sm font-semibold text-gray-900">{lawyer.name}</p>
            <p className="text-xs text-gray-400">{lawyer.kanzlei} · {lawyer.ort}</p>
          </div>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-2">
            {inp('Name', 'name')}
            {inp('Kanzlei', 'kanzlei')}
            {inp('E-Mail', 'email')}
            {inp('Website', 'website')}
            {inp('Telefon', 'phone')}
            {inp('PLZ', 'plz')}
            {inp('Ort', 'ort')}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SENEC-Fälle</label>
              <input type="number" min={0} value={form.senec_faelle}
                onChange={e => setF('senec_faelle', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
          </div>

          {inp('Schwerpunkte (kommagetrennt)', 'schwerpunkteRaw')}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Listing-Typ</label>
              <select value={form.listing_typ} onChange={e => setF('listing_typ', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none">
                <option value="kostenlos">Kostenlos</option>
                <option value="basis">Basis</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select value={form.status} onChange={e => setF('status', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none">
                <option value="active">Aktiv</option>
                <option value="pending">Ausstehend</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id={`eb-${lawyer.id}`} checked={form.erstberatung_kostenlos}
              onChange={e => setF('erstberatung_kostenlos', e.target.checked)} className="rounded" />
            <label htmlFor={`eb-${lawyer.id}`} className="text-xs text-gray-700">Erstberatung kostenlos</label>
          </div>

          {!form.erstberatung_kostenlos && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Erstberatung EUR</label>
              <input type="number" min={0} value={form.erstberatung_eur}
                onChange={e => setF('erstberatung_eur', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Beschreibung</label>
            <textarea value={form.beschreibung} onChange={e => setF('beschreibung', e.target.value)}
              rows={2} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none resize-none" />
          </div>

          {error && <p className="text-xs text-red-500 break-all">{error}</p>}
          {ok && <p className="text-xs text-green-600">Gespeichert.</p>}

          <div className="flex gap-2 pt-1">
            <button onClick={save} disabled={saving}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? 'Speichert …' : 'Speichern'}
            </button>
            <button onClick={del} disabled={deleting}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors">
              {deleting ? '…' : 'Löschen'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function EditTab() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      setLawyers(await fetchAllLawyers())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
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

      {!loading && lawyers.length === 0 && !error && (
        <p className="text-sm text-gray-400 text-center py-6">Keine Anwälte gefunden.</p>
      )}

      <div className="space-y-2">
        {lawyers.map(l => (
          <EditLawyerCard
            key={l.id}
            lawyer={l}
            onSaved={updated => setLawyers(prev => prev.map(x => x.id === updated.id ? updated : x))}
            onDeleted={id => setLawyers(prev => prev.filter(x => x.id !== id))}
          />
        ))}
      </div>
    </div>
  )
}

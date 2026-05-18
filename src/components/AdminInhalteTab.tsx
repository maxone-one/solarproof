import { useState, useEffect } from 'react'
import { fetchContent, saveContent } from '../data/content'
import {
  TRUST_STRIP_DEFAULT, UEBERUNS_DEFAULT, ANWALT_TIPPS_DEFAULT,
  type TrustStripItems, type UeberUnsContent, type AnwaltTippsContent, type AnwaltTipp, type AnwaltLink,
} from '../data/contentDefaults'

function SaveButton({ onClick, saving, ok }: { onClick: () => void; saving: boolean; ok: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onClick} disabled={saving}
        className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {saving ? 'Speichert …' : 'Speichern'}
      </button>
      {ok && <span className="text-xs text-green-600">✓ Gespeichert</span>}
    </div>
  )
}

export function InhalteTab() {
  const [adminKey, setAdminKey] = useState('')
  const [error, setError]       = useState('')

  const [trustItems, setTrustItems]         = useState<TrustStripItems>(TRUST_STRIP_DEFAULT)
  const [trustSaving, setTrustSaving]       = useState(false)
  const [trustOk, setTrustOk]               = useState(false)

  const [ueberUns, setUeberUns]             = useState<UeberUnsContent>(UEBERUNS_DEFAULT)
  const [ueberSaving, setUeberSaving]       = useState(false)
  const [ueberOk, setUeberOk]               = useState(false)

  const [tipps, setTipps]                   = useState<AnwaltTippsContent>(ANWALT_TIPPS_DEFAULT)
  const [tippsSaving, setTippsSaving]       = useState(false)
  const [tippsOk, setTippsOk]               = useState(false)

  useEffect(() => {
    fetchContent<TrustStripItems>('trust_strip').then(v => { if (v) setTrustItems(v) }).catch(() => {})
    fetchContent<UeberUnsContent>('ueberuns').then(v => { if (v) setUeberUns(v) }).catch(() => {})
    fetchContent<AnwaltTippsContent>('anwalt_tipps').then(v => { if (v) setTipps(v) }).catch(() => {})
  }, [])

  async function saveTrust() {
    setTrustSaving(true); setError(''); setTrustOk(false)
    try { await saveContent('trust_strip', trustItems.filter(Boolean), adminKey); setTrustOk(true) }
    catch (e) { setError(e instanceof Error ? e.message : String(e)) }
    finally { setTrustSaving(false) }
  }

  async function saveUeberUns() {
    setUeberSaving(true); setError(''); setUeberOk(false)
    try { await saveContent('ueberuns', ueberUns, adminKey); setUeberOk(true) }
    catch (e) { setError(e instanceof Error ? e.message : String(e)) }
    finally { setUeberSaving(false) }
  }

  async function saveTipps() {
    setTippsSaving(true); setError(''); setTippsOk(false)
    try { await saveContent('anwalt_tipps', tipps, adminKey); setTippsOk(true) }
    catch (e) { setError(e instanceof Error ? e.message : String(e)) }
    finally { setTippsSaving(false) }
  }

  const ta = (label: string, val: string, onChange: (v: string) => void, rows = 3) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <textarea value={val} onChange={e => onChange(e.target.value)} rows={rows}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:outline-none resize-none leading-relaxed" />
    </div>
  )

  const inp = (label: string, val: string, onChange: (v: string) => void) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type="text" value={val} onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none" />
    </div>
  )

  return (
    <div className="px-6 py-5 space-y-6">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">CMS-Key (panel.maxone.one Service Role)</label>
        <input type="password" value={adminKey}
          onChange={e => setAdminKey(e.target.value)}
          placeholder="eyJ… — nur zum Speichern nötig"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 focus:border-blue-400 focus:outline-none" />
      </div>

      {error && <p className="text-xs text-red-500 break-all">{error}</p>}

      <div className="border-t border-gray-100 pt-5 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">Trust-Strip</h3>
        <p className="text-xs text-gray-400">Chips in der gelben Leiste unter dem Header.</p>
        {trustItems.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item}
              onChange={e => setTrustItems(prev => prev.map((v, j) => j === i ? e.target.value : v))}
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none" />
            <button type="button"
              onClick={() => setTrustItems(prev => prev.filter((_, j) => j !== i))}
              className="px-2 py-1.5 text-gray-400 hover:text-red-500 transition-colors">✕</button>
          </div>
        ))}
        <button type="button"
          onClick={() => setTrustItems(prev => [...prev, ''])}
          className="text-xs text-blue-600 hover:underline">+ Chip hinzufügen</button>
        <SaveButton onClick={saveTrust} saving={trustSaving} ok={trustOk} />
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">Über uns</h3>
        {ta('Einleitung', ueberUns.intro_lead, v => setUeberUns(p => ({ ...p, intro_lead: v })), 4)}
        {inp('Disclaimer (kursiv, klein)', ueberUns.intro_disclaimer, v => setUeberUns(p => ({ ...p, intro_disclaimer: v })))}
        <p className="text-xs font-semibold text-gray-600 pt-1">Robert</p>
        {inp('Untertitel', ueberUns.robert_subtitle, v => setUeberUns(p => ({ ...p, robert_subtitle: v })))}
        {ta('Bio', ueberUns.robert_bio, v => setUeberUns(p => ({ ...p, robert_bio: v })), 4)}
        <p className="text-xs font-semibold text-gray-600 pt-1">Max</p>
        {inp('Untertitel', ueberUns.max_subtitle, v => setUeberUns(p => ({ ...p, max_subtitle: v })))}
        {ta('Bio', ueberUns.max_bio, v => setUeberUns(p => ({ ...p, max_bio: v })), 4)}
        <p className="text-xs font-semibold text-gray-600 pt-1">Warum kostenlos?</p>
        {ta('Absatz 1', ueberUns.warum_text1, v => setUeberUns(p => ({ ...p, warum_text1: v })))}
        {ta('Absatz 2', ueberUns.warum_text2, v => setUeberUns(p => ({ ...p, warum_text2: v })))}
        <SaveButton onClick={saveUeberUns} saving={ueberSaving} ok={ueberOk} />
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">Tipps & Links (Schritt 4)</h3>
        <p className="text-xs text-gray-400">Tipps unter der Anwaltsliste.</p>

        {tipps.tipps.map((t, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">Tipp {i + 1}</span>
              <button type="button"
                onClick={() => setTipps(p => ({ ...p, tipps: p.tipps.filter((_, j) => j !== i) }))}
                className="text-xs text-gray-400 hover:text-red-500">✕</button>
            </div>
            {inp('Titel', t.title, v => setTipps(p => ({ ...p, tipps: p.tipps.map((x, j) => j === i ? { ...x, title: v } : x) })))}
            {ta('Beschreibung', t.desc, v => setTipps(p => ({ ...p, tipps: p.tipps.map((x: AnwaltTipp, j: number) => j === i ? { ...x, desc: v } : x) })), 2)}
          </div>
        ))}
        <button type="button"
          onClick={() => setTipps(p => ({ ...p, tipps: [...p.tipps, { title: '', desc: '' }] }))}
          className="text-xs text-blue-600 hover:underline">+ Tipp hinzufügen</button>

        <p className="text-xs font-semibold text-gray-600 pt-2">Externe Links</p>
        {tipps.externe_links.map((l, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 grid grid-cols-2 gap-2">
              {inp('Label', l.label, v => setTipps(p => ({ ...p, externe_links: p.externe_links.map((x, j) => j === i ? { ...x, label: v } : x) })))}
              {inp('URL', l.href, v => setTipps(p => ({ ...p, externe_links: p.externe_links.map((x: AnwaltLink, j: number) => j === i ? { ...x, href: v } : x) })))}
            </div>
            <button type="button"
              onClick={() => setTipps(p => ({ ...p, externe_links: p.externe_links.filter((_, j) => j !== i) }))}
              className="mt-5 text-gray-400 hover:text-red-500">✕</button>
          </div>
        ))}
        <button type="button"
          onClick={() => setTipps(p => ({ ...p, externe_links: [...p.externe_links, { label: '', href: '' }] }))}
          className="text-xs text-blue-600 hover:underline">+ Link hinzufügen</button>

        <SaveButton onClick={saveTipps} saving={tippsSaving} ok={tippsOk} />
      </div>
    </div>
  )
}

import { useEffect, useCallback, useState } from 'react'

const IMPRESSUM_API = 'https://panel.maxone.one/functions/v1/impressum'
const TIMEOUT_MS = 5000

interface ImpressumData {
  legal_name?: string
  company_name?: string
  owner_name?: string
  street?: string
  zip?: string
  city?: string
  country?: string
  email?: string
  phone?: string
  vat_id?: string
  tax_id?: string
  register_court?: string
  register_number?: string
  responsible_content?: string
}

interface Props {
  open: boolean
  onClose: () => void
}

export function ImpressumOverlay({ open, onClose }: Props) {
  const handleClose = useCallback(() => onClose(), [onClose])
  const [data, setData] = useState<ImpressumData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
    fetch(IMPRESSUM_API, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json: ImpressumData) => { setData(json); setError(false) })
      .catch(() => setError(true))
      .finally(() => clearTimeout(timeout))
    return () => { clearTimeout(timeout); controller.abort() }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, handleClose])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const legalName = data?.legal_name || data?.company_name || ''
  const isKapitalgesellschaft = !!(data?.register_court && data?.register_number)

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fade-in">
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 z-10 p-2 rounded-full bg-white/80 backdrop-blur border border-gray-200 hover:bg-gray-100 transition-colors"
        aria-label="Schließen"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-500 mb-3">Rechtliches</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Impressum</h1>

        {error && !data ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 mb-8">
            <p className="text-sm text-red-800">
              Das Impressum konnte nicht geladen werden. Bitte besuche{' '}
              <a href="https://maxone.one/impressum" target="_blank" rel="noopener noreferrer" className="underline">
                maxone.one/impressum
              </a>{' '}
              als Fallback.
            </p>
          </div>
        ) : !data ? (
          <div className="space-y-3">
            <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* §5 Abs. 1 Nr. 1 TMG — Name + Anschrift */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Angaben gemäß § 5 TMG</h2>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed">
                <p className="font-medium text-gray-900">{legalName}</p>
                {data.owner_name && data.owner_name !== legalName && <p>{data.owner_name}</p>}
                {data.street && <p>{data.street}</p>}
                {(data.zip || data.city) && <p>{[data.zip, data.city].filter(Boolean).join(' ')}</p>}
                <p>{data.country || 'Deutschland'}</p>
              </div>
            </section>

            {/* §5 Abs. 1 Nr. 2 TMG — Kontakt */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Kontakt</h2>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-1">
                {data.phone && (
                  <p>
                    <span className="text-gray-500 mr-2">Telefon:</span>
                    <a href={`tel:${data.phone}`} className="text-amber-600 hover:underline">{data.phone}</a>
                  </p>
                )}
                {data.email && (
                  <p>
                    <span className="text-gray-500 mr-2">E-Mail:</span>
                    <a href={`mailto:${data.email}`} className="text-amber-600 hover:underline">{data.email}</a>
                  </p>
                )}
              </div>
            </section>

            {/* §5 Abs. 1 Nr. 6 TMG — Steuer */}
            {(data.vat_id || data.tax_id) && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Steuerliche Angaben</h2>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-1">
                  {data.vat_id && (
                    <p>
                      <span className="text-gray-500 mr-2">Umsatzsteuer-ID gemäß § 27a UStG:</span>
                      <span className="font-medium text-gray-900">{data.vat_id}</span>
                    </p>
                  )}
                  {data.tax_id && !data.vat_id && (
                    <p>
                      <span className="text-gray-500 mr-2">Steuernummer:</span>
                      <span className="font-medium text-gray-900">{data.tax_id}</span>
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* §5 Abs. 1 Nr. 4 TMG — Handelsregister (Kapitalgesellschaft) */}
            {isKapitalgesellschaft && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Handelsregister</h2>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-1">
                  <p>
                    <span className="text-gray-500 mr-2">Registergericht:</span>
                    <span className="font-medium text-gray-900">{data.register_court}</span>
                  </p>
                  <p>
                    <span className="text-gray-500 mr-2">Handelsregisternummer:</span>
                    <span className="font-medium text-gray-900">{data.register_number}</span>
                  </p>
                </div>
              </section>
            )}

            {/* §18 Abs. 2 MStV — Verantwortlich */}
            {(data.responsible_content || legalName) && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
                </h2>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed">
                  <p className="font-medium text-gray-900">{data.responsible_content || legalName}</p>
                  {data.street && <p>{data.street}</p>}
                  {(data.zip || data.city) && <p>{[data.zip, data.city].filter(Boolean).join(' ')}</p>}
                </div>
              </section>
            )}

            {/* §36 VSBG */}
            <section className="pt-6 border-t border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Verbraucherschlichtung</h2>
              <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
                <p>
                  Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </section>
          </div>
        )}

        <button
          onClick={handleClose}
          className="mt-12 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Zurück zum Tool
        </button>
      </div>
    </div>
  )
}

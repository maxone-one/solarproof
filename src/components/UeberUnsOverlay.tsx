import { useEffect, useCallback } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ${color}`}>
      {initials}
    </div>
  )
}

export function UeberUnsOverlay({ open, onClose }: Props) {
  const handleClose = useCallback(() => onClose(), [onClose])

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

      <div className="max-w-2xl mx-auto px-6 py-20 space-y-12">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-500 mb-3">Von Betroffenen, für Betroffene</p>
          <h1 className="text-3xl font-bold text-gray-900">Wer steckt hinter SolarProof?</h1>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            SolarProof ist kein Unternehmen. Es ist ein Werkzeug — gebaut von zwei Menschen,
            die selbst wissen wie es sich anfühlt, gegen SENEC zu kämpfen.
          </p>
        </div>

        {/* Personen */}
        <div className="space-y-6">

          <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-5">
            <Avatar initials="R" color="bg-amber-500" />
            <div>
              <p className="font-bold text-gray-900 text-lg">Robert</p>
              <p className="text-sm text-gray-500 mt-0.5">Mitgründer · persönlich betroffen</p>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Roberts eigene SENEC-Anlage funktioniert nicht wie versprochen.
                Er hat selbst erlebt, wie zäh die Kommunikation mit SENEC ist,
                wie unverbindlich Kulanz-Angebote formuliert sind — und wie schwer
                es ist, ohne juristische Hilfe die eigenen Rechte zu kennen.
                SolarProof entstand aus genau dieser Frustration.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-5">
            <Avatar initials="MK" color="bg-blue-600" />
            <div>
              <p className="font-bold text-gray-900 text-lg">Max Karastelev</p>
              <p className="text-sm text-gray-500 mt-0.5">Mitgründer · Entwickler</p>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Max' Eltern sind SENEC-Kunden — und stecken mitten im Verfahren.
                Als Entwickler hat er gesehen: es gibt kein vernünftiges Tool,
                das Betroffene durch den Prozess führt. Kein strukturiertes Dokument,
                keine Orientierung, keine Anwaltsvermittlung mit echter SENEC-Erfahrung.
                Also hat er eins gebaut.
              </p>
            </div>
          </div>
        </div>

        {/* Warum kostenlos */}
        <div className="border-t border-gray-100 pt-10 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Warum ist SolarProof kostenlos?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Wir verdienen kein Geld daran, dass Sie die Plattform nutzen.
            Wir verdienen Geld, wenn ein Anwalt aus unserem Netzwerk Ihren Fall
            erfolgreich abschließt — erst dann zahlt die Kanzlei eine Provision an uns.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Das bedeutet: Unser Interesse ist dasselbe wie Ihres. Wir helfen Ihnen
            nur dann, wenn wir Ihnen wirklich helfen können.
          </p>
        </div>

        {/* Keine Rechtsberatung */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Hinweis:</strong> SolarProof ist kein Anwalt und gibt keine Rechtsberatung.
            Wir helfen Ihnen, Ihren Fall zu dokumentieren und einen geeigneten Anwalt zu finden.
            Die rechtliche Einschätzung obliegt ausschließlich dem von Ihnen gewählten Anwalt.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
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

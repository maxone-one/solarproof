import { useState } from 'react'
import { createPayment, isPremium, PREMIUM_PRICE_EUR } from '../data/premium'

interface Props {
  onPremiumActive?: () => void
}

export function PremiumCtaCard({ onPremiumActive }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isPremium()) {
    return (
      <div className="bg-gradient-to-br from-blue-900 to-gray-900 rounded-2xl p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-white">SolarProof Premium aktiv</p>
          <p className="text-xs text-gray-400 mt-0.5">Vollständige Fallanalyse verfügbar</p>
        </div>
        {onPremiumActive && (
          <button
            onClick={onPremiumActive}
            className="ml-auto text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Analyse starten →
          </button>
        )}
      </div>
    )
  }

  async function handleBuy() {
    setLoading(true)
    setError('')
    try {
      const { checkoutUrl, paymentId } = await createPayment(email || undefined)
      try { localStorage.setItem('sp-pending-payment', paymentId) } catch {}
      window.location.href = checkoutUrl
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-900 to-gray-900 rounded-2xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-white">SolarProof Premium</p>
          <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
            Vollständige Fallanalyse durch Vector — Rechtsstrategie, konkrete Schritte, Dokumenten-Checkliste für den Anwalt.
          </p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {[
          'Vollständige Fallanalyse in 4 Abschnitten',
          'Konkrete Rechtsstrategie (OLG Hamm + weitere)',
          'Persönliche Schritt-für-Schritt-Anleitung',
          'Dokumenten-Checkliste für den Anwalt',
        ].map(f => (
          <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
            <svg className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="E-Mail (optional — für Nachweis)"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
        />
        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold text-gray-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Weiterleitung …
            </>
          ) : `Premium kaufen — ${PREMIUM_PRICE_EUR} €`}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <p className="text-xs text-gray-500 text-center">Einmalig · PayPal, Kreditkarte, Überweisung</p>
      </div>
    </div>
  )
}

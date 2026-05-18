interface SharedCaseBannerProps {
  mandantEmail: string
  onExit: () => void
}

export function SharedCaseBanner({ mandantEmail, onExit }: SharedCaseBannerProps) {
  return (
    <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>
          Lesezugriff — Fall von <strong>{mandantEmail}</strong>
        </span>
      </div>
      <button
        onClick={onExit}
        className="text-xs text-blue-200 hover:text-white underline underline-offset-2 shrink-0 transition-colors"
      >
        ← Zurück zu meinen Fällen
      </button>
    </div>
  )
}

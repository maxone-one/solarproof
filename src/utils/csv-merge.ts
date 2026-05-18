/** Merges multiple CSV texts: uses header from first file, strips headers from the rest. */
export function mergeCSVTexts(texts: string[]): string {
  if (texts.length === 1) return texts[0]
  const lines0 = texts[0].split('\n')
  const header = lines0[0]
  const dataLines = [
    ...lines0.slice(1),
    ...texts.slice(1).flatMap((t) => t.split('\n').slice(1)),
  ].filter((l) => l.trim().length > 0)
  return [header, ...dataLines].join('\n')
}

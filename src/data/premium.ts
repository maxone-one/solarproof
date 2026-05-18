const PANEL_URL = 'https://panel.maxone.one'
const ANON_KEY  = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlIiwgImlhdCI6IDE3Mjk3MjgwMDAsICJleHAiOiAxODg3NDk0NDAwfQ.bkbevdi1DwbqCos2hMTd3UnYAj5PogIBTqjZdOyTGiQ'
const TOKEN_KEY = 'sp-premium-token'

export const PREMIUM_PRICE_EUR = 29

export function isPremium(): boolean {
  try { return !!localStorage.getItem(TOKEN_KEY) } catch { return false }
}

export function getPremiumToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function storePremiumToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token) } catch {}
}

export async function createPayment(email?: string): Promise<{ checkoutUrl: string; paymentId: string }> {
  const res = await fetch(`${PANEL_URL}/functions/v1/create-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
    body: JSON.stringify({ email }),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`)
  return data
}

export async function verifyPayment(paymentId: string): Promise<{ status: string; token?: string }> {
  const res = await fetch(`${PANEL_URL}/functions/v1/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
    body: JSON.stringify({ paymentId }),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`)
  return data
}

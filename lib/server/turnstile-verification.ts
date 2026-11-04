const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
const TURNSTILE_VERIFY_TIMEOUT_MS = 5_000

export type TurnstileVerificationResult = {
  ok: boolean
  skipped: boolean
}

export function isTurnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim())
}

export function isTurnstileSiteKeyConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim())
}

export async function verifyTurnstileToken(token: unknown, ip: string): Promise<TurnstileVerificationResult> {
  if (!isTurnstileConfigured()) {
    return { ok: true, skipped: true }
  }

  if (typeof token !== "string" || !token.trim()) {
    return { ok: false, skipped: false }
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY!.trim()

  try {
    const body = new URLSearchParams({ secret: secretKey, response: token })
    if (ip) {
      body.set("remoteip", ip)
    }

    const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(TURNSTILE_VERIFY_TIMEOUT_MS),
    })

    if (!response.ok) {
      return { ok: false, skipped: false }
    }

    const result = await response.json() as { success?: unknown }
    return { ok: result.success === true, skipped: false }
  } catch {
    return { ok: false, skipped: false }
  }
}

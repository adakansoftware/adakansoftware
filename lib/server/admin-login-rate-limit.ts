const WINDOW_MS = 10 * 60_000
const MAX_FAILURES = 5

const failuresByIp = new Map<string, number[]>()

type AdminRateLimitEnvironment = {
  NODE_ENV?: string
  CONTACT_STATE_BACKEND?: string
  REDIS_URL?: string
}

export function shouldUseSharedAdminRateLimit(environment: AdminRateLimitEnvironment = process.env) {
  return environment.NODE_ENV === "production"
    && environment.CONTACT_STATE_BACKEND?.trim().toLowerCase() === "redis"
    && Boolean(environment.REDIS_URL?.trim())
}

async function getSharedStateStore() {
  const { getContactStateStore } = await import("./contact-state-store")
  return getContactStateStore()
}

function recentFailures(ip: string, now: number) {
  const recent = (failuresByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  )

  if (recent.length === 0) {
    failuresByIp.delete(ip)
  } else {
    failuresByIp.set(ip, recent)
  }

  return recent
}

export async function isAdminLoginRateLimited(ip: string, now: number) {
  if (shouldUseSharedAdminRateLimit()) {
    return (await getSharedStateStore()).isRateLimited(`admin-login:${ip}`, WINDOW_MS, MAX_FAILURES)
  }
  return recentFailures(ip, now).length >= MAX_FAILURES
}

export async function shouldRejectAdminLogin(ip: string, now: number) {
  return isAdminLoginRateLimited(ip, now)
}

export async function recordAdminLoginFailure(ip: string, now: number) {
  if (shouldUseSharedAdminRateLimit()) {
    return (await getSharedStateStore()).consumeRateLimit(
      `admin-login:${ip}`,
      WINDOW_MS,
      MAX_FAILURES,
    )
  }

  const failures = recentFailures(ip, now)
  failures.push(now)
  failuresByIp.set(ip, failures)
  return failures.length >= MAX_FAILURES
}

export async function clearAdminLoginFailures(ip: string) {
  if (shouldUseSharedAdminRateLimit()) {
    await (await getSharedStateStore()).clearRateLimit(`admin-login:${ip}`)
    return
  }

  failuresByIp.delete(ip)
}

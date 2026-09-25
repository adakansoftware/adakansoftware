import {
  getSharedRateLimitStore,
  hasSharedRateLimitConfiguration,
} from "./shared-rate-limit.ts"

const WINDOW_MS = 10 * 60_000
const MAX_FAILURES = 5

const failuresByIp = new Map<string, number[]>()

type AdminRateLimitEnvironment = {
  NODE_ENV?: string
  DATABASE_URL?: string
  ADMIN_SESSION_SECRET?: string
}

export function shouldUseSharedAdminRateLimit(environment: AdminRateLimitEnvironment = process.env) {
  return hasSharedRateLimitConfiguration(environment)
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
    return getSharedRateLimitStore().isLimited("admin-login", ip, WINDOW_MS, MAX_FAILURES, now)
  }
  return recentFailures(ip, now).length >= MAX_FAILURES
}

export async function shouldRejectAdminLogin(ip: string, now: number) {
  return isAdminLoginRateLimited(ip, now)
}

export async function recordAdminLoginFailure(ip: string, now: number) {
  if (shouldUseSharedAdminRateLimit()) {
    return (await getSharedRateLimitStore().consume(
      "admin-login",
      ip,
      WINDOW_MS,
      MAX_FAILURES,
      now,
    )).limited
  }

  const failures = recentFailures(ip, now)
  failures.push(now)
  failuresByIp.set(ip, failures)
  return failures.length >= MAX_FAILURES
}

export async function clearAdminLoginFailures(ip: string) {
  if (shouldUseSharedAdminRateLimit()) {
    await getSharedRateLimitStore().clear("admin-login", ip)
    return
  }

  failuresByIp.delete(ip)
}

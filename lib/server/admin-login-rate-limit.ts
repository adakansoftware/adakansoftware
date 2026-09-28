import {
  getSharedRateLimitStore,
  hasSharedRateLimitConfiguration,
} from "./shared-rate-limit.ts"

const WINDOW_MS = 10 * 60_000
const MAX_FAILURES = 5
const ACCOUNT_WINDOW_MS = 60 * 60_000
const ACCOUNT_MAX_FAILURES = 20

const failures = new Map<string, number[]>()

type AdminRateLimitEnvironment = {
  NODE_ENV?: string
  DATABASE_URL?: string
  RATE_LIMIT_HASH_SECRET?: string
}

export function shouldUseSharedAdminRateLimit(environment: AdminRateLimitEnvironment = process.env) {
  return hasSharedRateLimitConfiguration(environment)
}

export function hasAdminLoginRateLimitProtection(environment: AdminRateLimitEnvironment = process.env) {
  return environment.NODE_ENV !== "production" || shouldUseSharedAdminRateLimit(environment)
}

function recentFailures(scope: string, identifier: string, windowMs: number, now: number) {
  const key = `${scope}:${identifier}`
  const recent = (failures.get(key) ?? []).filter(
    (timestamp) => now - timestamp < windowMs,
  )

  if (recent.length === 0) {
    failures.delete(key)
  } else {
    failures.set(key, recent)
  }

  return recent
}

export async function isAdminLoginRateLimited(ip: string, now: number) {
  if (shouldUseSharedAdminRateLimit()) {
    return getSharedRateLimitStore().isLimited("admin-login", ip, WINDOW_MS, MAX_FAILURES, now)
  }
  return recentFailures("admin-login-ip", ip, WINDOW_MS, now).length >= MAX_FAILURES
}

async function isAdminAccountRateLimited(email: string, now: number) {
  const identifier = email.trim().toLowerCase()
  if (!identifier) return false
  if (shouldUseSharedAdminRateLimit()) {
    return getSharedRateLimitStore().isLimited("admin-login-account", identifier, ACCOUNT_WINDOW_MS, ACCOUNT_MAX_FAILURES, now)
  }
  return recentFailures("admin-login-account", identifier, ACCOUNT_WINDOW_MS, now).length >= ACCOUNT_MAX_FAILURES
}

export async function shouldRejectAdminLogin(ip: string, now: number, email = "") {
  return await isAdminLoginRateLimited(ip, now) || await isAdminAccountRateLimited(email, now)
}

export async function recordAdminLoginFailure(ip: string, now: number, email = "") {
  if (shouldUseSharedAdminRateLimit()) {
    const store = getSharedRateLimitStore()
    const ipResult = await store.consume(
      "admin-login",
      ip,
      WINDOW_MS,
      MAX_FAILURES,
      now,
    )
    const accountResult = email.trim()
      ? await store.consume("admin-login-account", email.trim().toLowerCase(), ACCOUNT_WINDOW_MS, ACCOUNT_MAX_FAILURES, now)
      : { limited: false }
    return ipResult.limited || accountResult.limited
  }

  const ipFailures = recentFailures("admin-login-ip", ip, WINDOW_MS, now)
  ipFailures.push(now)
  failures.set(`admin-login-ip:${ip}`, ipFailures)
  let accountLimited = false
  const account = email.trim().toLowerCase()
  if (account) {
    const accountFailures = recentFailures("admin-login-account", account, ACCOUNT_WINDOW_MS, now)
    accountFailures.push(now)
    failures.set(`admin-login-account:${account}`, accountFailures)
    accountLimited = accountFailures.length >= ACCOUNT_MAX_FAILURES
  }
  return ipFailures.length >= MAX_FAILURES || accountLimited
}

export async function clearAdminLoginFailures(ip: string) {
  if (shouldUseSharedAdminRateLimit()) {
    await getSharedRateLimitStore().clear("admin-login", ip)
    return
  }

  failures.delete(`admin-login-ip:${ip}`)
}

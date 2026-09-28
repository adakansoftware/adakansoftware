import assert from "node:assert/strict"
import test from "node:test"

import {
  clearAdminLoginFailures,
  consumeAdminLoginAttempt,
  shouldRejectAdminLogin,
  isAdminLoginRateLimited,
  recordAdminLoginFailure,
  shouldUseSharedAdminRateLimit,
} from "./admin-login-rate-limit.ts"

test("requires shared login rate limiting in production", async () => {
  const rateLimitModule = await import("./admin-login-rate-limit.ts")
  assert.equal(typeof rateLimitModule.hasAdminLoginRateLimitProtection, "function")
  assert.equal(rateLimitModule.hasAdminLoginRateLimitProtection({ NODE_ENV: "production" }), false)
  assert.equal(
    rateLimitModule.hasAdminLoginRateLimitProtection({
      NODE_ENV: "production",
      DATABASE_URL: "postgres://example",
      RATE_LIMIT_HASH_SECRET: "r".repeat(32),
    }),
    true,
  )
  assert.equal(rateLimitModule.hasAdminLoginRateLimitProtection({ NODE_ENV: "development" }), true)
})

test("uses shared rate limiting when production database and signing secret are configured", () => {
  assert.equal(shouldUseSharedAdminRateLimit({ NODE_ENV: "production", DATABASE_URL: "postgres://example", RATE_LIMIT_HASH_SECRET: "r".repeat(32) }), true)
  assert.equal(shouldUseSharedAdminRateLimit({ NODE_ENV: "production", DATABASE_URL: "postgres://example" }), false)
  assert.equal(shouldUseSharedAdminRateLimit({ NODE_ENV: "development", DATABASE_URL: "postgres://example", RATE_LIMIT_HASH_SECRET: "r".repeat(32) }), false)
})

test("limits repeated failures for one account across changing addresses", async () => {
  const now = 4_000_000
  const email = "Admin@Example.com"

  for (let count = 0; count < 20; count += 1) {
    await recordAdminLoginFailure(`198.51.100.${count}`, now + count, email)
  }

  assert.equal(await shouldRejectAdminLogin("198.51.100.250", now + 21, "admin@example.com"), true)
})

test("limits the sixth failed login within ten minutes", async () => {
  const now = 1_000_000
  const ip = "203.0.113.10"

  for (let count = 0; count < 5; count += 1) {
    await recordAdminLoginFailure(ip, now + count)
  }

  assert.equal(await isAdminLoginRateLimited(ip, now + 5), true)
})

test("rejects a login attempt once the address has reached the limit", async () => {
  const now = 1_500_000
  const ip = "203.0.113.15"

  for (let count = 0; count < 5; count += 1) {
    await recordAdminLoginFailure(ip, now + count)
  }

  assert.equal(await shouldRejectAdminLogin(ip, now + 5), true)
})

test("clears failed login attempts after a successful login", async () => {
  const now = 2_000_000
  const ip = "203.0.113.11"

  for (let count = 0; count < 5; count += 1) {
    await recordAdminLoginFailure(ip, now + count)
  }

  await clearAdminLoginFailures(ip)

  assert.equal(await isAdminLoginRateLimited(ip, now + 5), false)
})

test("expires failed login attempts after ten minutes", async () => {
  const now = 3_000_000
  const ip = "203.0.113.12"

  await recordAdminLoginFailure(ip, now)

  assert.equal(await isAdminLoginRateLimited(ip, now + 600_001), false)
})

test("atomically rejects concurrent attempts beyond the configured allowance", async () => {
  const now = 5_000_000
  const results = await Promise.all(
    Array.from({ length: 6 }, (_, index) => consumeAdminLoginAttempt("203.0.113.99", now + index, "owner@example.com")),
  )

  assert.deepEqual(results, [false, false, false, false, false, true])
})

test("a successful login clears both address and account attempt buckets", async () => {
  const now = 6_000_000
  const email = "owner@example.com"
  for (let count = 0; count < 5; count += 1) {
    await consumeAdminLoginAttempt("203.0.113.100", now + count, email)
  }

  await clearAdminLoginFailures("203.0.113.100", email)

  assert.equal(await shouldRejectAdminLogin("203.0.113.100", now + 6, email), false)
})

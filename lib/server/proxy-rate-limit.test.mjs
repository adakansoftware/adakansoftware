import assert from "node:assert/strict"
import test from "node:test"

import { getProxyRateLimitDiagnostics, getProxyRateLimitPolicy, isProxyRateLimited } from "./proxy-rate-limit.ts"

test("reports the proxy limiter as best-effort per-instance protection", () => {
  const diagnostics = getProxyRateLimitDiagnostics()

  assert.equal(diagnostics.scope, "best-effort-per-instance")
  assert.equal(diagnostics.authoritative, false)
})

test("isolates proxy burst limits by API path", () => {
  const now = Date.now()
  const contactKey = `203.0.113.1:/api/contact:${now}`
  const healthKey = `203.0.113.1:/api/health:${now}`

  for (let index = 0; index < 30; index += 1) {
    assert.equal(isProxyRateLimited(contactKey, now), false)
  }

  assert.equal(isProxyRateLimited(contactKey, now), true)
  assert.equal(isProxyRateLimited(healthKey, now), false)
})

test("rejected traffic does not extend the burst window", () => {
  const now = Date.now() + 20_000
  const key = "burst-recovery"
  for (let index = 0; index < 30; index++) assert.equal(isProxyRateLimited(key, now), false)
  for (let index = 0; index < 100; index++) assert.equal(isProxyRateLimited(key, now + 9_000), true)
  assert.equal(isProxyRateLimited(key, now + 10_000), false)
})

test("many distinct paths cannot grow the limiter beyond its capacity", () => {
  const now = Date.now() + 60_000
  const { maxTrackedKeys } = getProxyRateLimitPolicy()
  assert.ok(Number.isInteger(maxTrackedKeys) && maxTrackedKeys > 0)
  for (let index = 0; index < maxTrackedKeys; index++) assert.equal(isProxyRateLimited(`capacity:${index}`, now), false)
  assert.equal(isProxyRateLimited("capacity:overflow", now), true)
  assert.equal(getProxyRateLimitDiagnostics().trackedKeys, maxTrackedKeys)
  assert.equal(isProxyRateLimited("capacity:overflow", now + 10_000), false)
  assert.equal(isProxyRateLimited("x".repeat(2048), now + 10_000), true)
})

import assert from "node:assert/strict"
import test from "node:test"

test("shared limiter hashes client identifiers before querying storage", async () => {
  const rateLimitModule = await import("./shared-rate-limit.ts").catch(() => ({}))
  assert.equal(typeof rateLimitModule.createSharedRateLimitStore, "function")

  const calls = []
  const store = rateLimitModule.createSharedRateLimitStore({
    secret: "s".repeat(32),
    query: async (sql, parameters) => {
      calls.push({ sql, parameters })
      return [{ request_count: 1, window_started_at: new Date(1_000_000).toISOString() }]
    },
  })

  const result = await store.consume("admin-login", "203.0.113.25", 600_000, 5, 1_000_000)

  assert.equal(result.limited, false)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].parameters.includes("203.0.113.25"), false)
  assert.match(calls[0].parameters[1], /^[a-f0-9]{64}$/)
})

test("shared limiter rejects the request after the configured count", async () => {
  const { createSharedRateLimitStore } = await import("./shared-rate-limit.ts")
  const store = createSharedRateLimitStore({
    secret: "s".repeat(32),
    query: async () => [{ request_count: 6, window_started_at: new Date(1_000_000).toISOString() }],
  })

  const result = await store.consume("contact", "203.0.113.26", 60_000, 4, 1_000_000)

  assert.equal(result.limited, true)
  assert.equal(result.retryAfterSeconds, 60)
})

test("shared limiter rejects missing signing material", async () => {
  const { createSharedRateLimitStore } = await import("./shared-rate-limit.ts")

  assert.throws(
    () => createSharedRateLimitStore({ secret: "short", query: async () => [] }),
    /secret/i,
  )
})

import assert from "node:assert/strict"
import test from "node:test"

test("production HTTP requests receive a canonical HTTPS destination", async () => {
  const transportModule = await import("./transport-security.ts").catch(() => ({}))
  assert.equal(typeof transportModule.getCanonicalRedirectUrl, "function")

  assert.equal(
    transportModule.getCanonicalRedirectUrl("http://adakansoftware.com/projects?from=test", "https://adakansoftware.com", "production", "http")?.href,
    "https://adakansoftware.com/projects?from=test",
  )
  assert.equal(transportModule.getCanonicalRedirectUrl("https://adakansoftware.com/", "https://adakansoftware.com", "production", "https"), null)
  assert.equal(transportModule.getCanonicalRedirectUrl("http://127.0.0.1:3000/", "https://adakansoftware.com", "production"), null)
  assert.equal(transportModule.getCanonicalRedirectUrl("http://127.0.0.1:3000/", "https://adakansoftware.com", "development", "http"), null)
})

test("production alternate hosts redirect to the canonical domain", async () => {
  const transportModule = await import("./transport-security.ts")

  assert.equal(
    transportModule.getCanonicalRedirectUrl("https://adakansoftware.adakansoftware.workers.dev/blog?ref=worker", "https://adakansoftware.com", "production", "https")?.href,
    "https://adakansoftware.com/blog?ref=worker",
  )
  assert.equal(
    transportModule.getCanonicalRedirectUrl("https://www.adakansoftware.com/contact", "https://adakansoftware.com", "production", "https")?.href,
    "https://adakansoftware.com/contact",
  )
})

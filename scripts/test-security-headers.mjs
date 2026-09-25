/* global console, fetch, process */

import assert from "node:assert/strict"

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3101"
const response = await fetch(`${baseUrl}/`)

assert.equal(response.status, 200)
for (const [header, expected] of [
  ["strict-transport-security", "max-age=63072000; includeSubDomains; preload"],
  ["x-content-type-options", "nosniff"],
  ["x-frame-options", "DENY"],
  ["referrer-policy", "strict-origin-when-cross-origin"],
]) {
  assert.equal(response.headers.get(header), expected, header)
}

const csp = response.headers.get("content-security-policy") ?? ""
for (const directive of ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "script-src-attr 'none'", "upgrade-insecure-requests"]) {
  assert.ok(csp.split("; ").includes(directive), directive)
}

const sensitivePath = await fetch(`${baseUrl}/.env`)
assert.equal(sensitivePath.status, 404, "/.env")

const healthResponse = await fetch(`${baseUrl}/api/health`)
assert.equal(healthResponse.status, 200, "/api/health")
const health = await healthResponse.json()
assert.deepEqual(Object.keys(health).sort(), ["ok", "status"])
assert.ok(!csp.includes("'unsafe-eval'"))

for (const path of ["/api/admin/session", "/api/admin/content", "/api/admin/contact-requests"]) {
  const denied = await fetch(`${baseUrl}${path}`)
  assert.equal(denied.status, 401, path)
  assert.equal(denied.headers.get("cache-control"), "no-store")
}

for (const path of ["/api/admin/login", "/api/admin/logout"]) {
  const denied = await fetch(`${baseUrl}${path}`, {
    method: "POST", headers: { origin: "https://untrusted.invalid", "content-type": "application/json" }, body: "{}",
  })
  assert.equal(denied.status, 403, path)
}

console.log(`Security header checks passed for ${baseUrl}`)

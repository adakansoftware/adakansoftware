/* global console, fetch, process, URL */

import assert from "node:assert/strict"

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3101"
const secureFetch = (path, options = {}) => fetch(`${baseUrl}${path}`, {
  ...options,
  headers: {
    "x-forwarded-proto": "https",
    ...options.headers,
  },
})
const response = await secureFetch("/")

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

const sensitivePath = await secureFetch("/.env")
assert.equal(sensitivePath.status, 404, "/.env")

const healthResponse = await secureFetch("/api/health")
assert.equal(healthResponse.status, 200, "/api/health")
const health = await healthResponse.json()
assert.deepEqual(Object.keys(health).sort(), ["ok", "status"])
assert.ok(!csp.includes("'unsafe-eval'"))

const insecureTransport = await secureFetch("/projects?from=security-smoke", {
  headers: { "x-forwarded-proto": "http" },
  redirect: "manual",
})
assert.equal(insecureTransport.status, 308)
const expectedHttpsLocation = new URL("/projects?from=security-smoke", baseUrl)
expectedHttpsLocation.protocol = "https:"
const actualHttpsLocation = new URL(insecureTransport.headers.get("location"))
assert.equal(actualHttpsLocation.protocol, expectedHttpsLocation.protocol)
assert.equal(actualHttpsLocation.pathname, expectedHttpsLocation.pathname)
assert.equal(actualHttpsLocation.search, expectedHttpsLocation.search)

for (const path of ["/api/admin/session", "/api/admin/content", "/api/admin/contact-requests"]) {
  const denied = await secureFetch(path)
  assert.equal(denied.status, 401, path)
  assert.equal(denied.headers.get("cache-control"), "no-store")
}

for (const path of ["/api/admin/login", "/api/admin/logout"]) {
  const denied = await secureFetch(path, {
    method: "POST", headers: { origin: "https://untrusted.invalid", "content-type": "application/json" }, body: "{}",
  })
  assert.equal(denied.status, 403, path)
}

console.log(`Security header checks passed for ${baseUrl}`)

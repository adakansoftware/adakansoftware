import assert from "node:assert/strict"
import test from "node:test"

import { buildContentSecurityPolicy, createCspNonce } from "./content-security-policy.ts"

test("production CSP permits only nonce-authorized scripts", () => {
  const nonce = "fixed-test-nonce"
  const policy = buildContentSecurityPolicy(nonce, true)
  const scriptDirective = policy.split("; ").find((directive) => directive.startsWith("script-src "))

  assert.match(scriptDirective ?? "", /'nonce-fixed-test-nonce'/)
  assert.match(scriptDirective ?? "", /'strict-dynamic'/)
  assert.doesNotMatch(scriptDirective ?? "", /'unsafe-inline'/)
  assert.doesNotMatch(scriptDirective ?? "", /'unsafe-eval'/)
  assert.match(policy, /script-src-attr 'none'/)
  assert.match(policy, /upgrade-insecure-requests/)
})

test("development CSP keeps eval support for the Next.js runtime", () => {
  const policy = buildContentSecurityPolicy("dev-nonce", false)
  const scriptDirective = policy.split("; ").find((directive) => directive.startsWith("script-src "))

  assert.match(scriptDirective ?? "", /'unsafe-eval'/)
  assert.doesNotMatch(policy, /upgrade-insecure-requests/)
})

test("CSP nonces are unpredictable base64url values", () => {
  const first = createCspNonce()
  const second = createCspNonce()

  assert.match(first, /^[A-Za-z0-9_-]{20,}$/)
  assert.notEqual(first, second)
})

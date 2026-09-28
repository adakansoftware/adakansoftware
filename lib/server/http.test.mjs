import assert from "node:assert/strict"
import test from "node:test"

/* global Request */

import { isOriginAllowed } from "./origin-policy.ts"
import { createRequestId } from "./request-id.ts"

test("accepts only log-safe incoming request identifiers", () => {
  const accepted = new Request("https://adakansoftware.com/api/health", {
    headers: { "x-request-id": "edge:req_123-ABC.9" },
  })
  assert.equal(createRequestId(accepted), "edge:req_123-ABC.9")

  const rejected = new Request("https://adakansoftware.com/api/health", {
    headers: { "x-request-id": "forged log entry" },
  })
  assert.match(createRequestId(rejected), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u)
})

test("rejects mutation requests without an Origin header in production", () => {
  const request = new Request("https://adakansoftware.com/api/contact", { method: "POST" })
  assert.equal(isOriginAllowed(request, ["https://adakansoftware.com"], "production"), false)
})

test("accepts the configured same-origin request in production", () => {
  const request = new Request("https://adakansoftware.com/api/contact", {
    method: "POST",
    headers: { origin: "https://adakansoftware.com" },
  })
  assert.equal(isOriginAllowed(request, ["https://adakansoftware.com"], "production"), true)
})

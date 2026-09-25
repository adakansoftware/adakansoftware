import assert from "node:assert/strict"
import test from "node:test"

test("next config does not emit a second static CSP", async () => {
  const config = (await import("../../next.config.mjs")).default
  const rules = await config.headers()
  const cspHeaders = rules
    .flatMap((rule) => rule.headers)
    .filter((header) => header.key === "Content-Security-Policy")

  assert.deepEqual(cspHeaders, [])
})

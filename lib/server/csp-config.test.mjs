import assert from "node:assert/strict"
import test from "node:test"

test("production CSP blocks inline event-handler attributes", async () => {
  const config = (await import("../../next.config.mjs")).default
  const rules = await config.headers()
  const csp = rules
    .flatMap((rule) => rule.headers)
    .find((header) => header.key === "Content-Security-Policy")?.value

  assert.match(csp ?? "", /script-src-attr 'none'/)
})


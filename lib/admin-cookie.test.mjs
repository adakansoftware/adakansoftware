import assert from "node:assert/strict"
import test from "node:test"

import { getAdminCookieName } from "./admin-cookie.ts"

test("admin cookie uses the host-only prefix in production", () => {
  assert.equal(getAdminCookieName("production"), "__Host-adakan_admin")
  assert.equal(getAdminCookieName("development"), "adakan_admin")
  assert.equal(getAdminCookieName("test"), "adakan_admin")
})

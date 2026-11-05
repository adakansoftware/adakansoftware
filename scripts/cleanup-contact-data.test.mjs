import assert from "node:assert/strict"
import test from "node:test"

import { parseCleanupMode } from "./cleanup-contact-data.mjs"

test("contact cleanup is dry-run by default", () => {
  assert.equal(parseCleanupMode([]), "dry-run")
  assert.equal(parseCleanupMode(["--dry-run"]), "dry-run")
})

test("contact cleanup applies only with the exact apply flag", () => {
  assert.equal(parseCleanupMode(["--apply"]), "apply")
  assert.throws(() => parseCleanupMode(["--apply", "extra"]), /Usage/)
  assert.throws(() => parseCleanupMode(["--force"]), /Usage/)
})

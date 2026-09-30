import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const source = await readFile(new URL("../components/contact-form.tsx", import.meta.url), "utf8")

test("contact form links to the localized privacy notice without a consent field", () => {
  assert.match(source, /withLocale\("\/privacy", locale\)/)
  assert.match(source, /KVKK Aydınlatma Metni/)
  assert.match(source, /Privacy Notice/)
  assert.match(source, /hassas bilgi paylaşmayın/i)
  assert.doesNotMatch(source, /type=["']checkbox["']/)
  assert.doesNotMatch(source, /explicitConsent/)
})

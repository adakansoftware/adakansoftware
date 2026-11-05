import assert from "node:assert/strict"
import test from "node:test"

import { loadTypescript } from "./test-support/load-typescript.mjs"

const load = loadTypescript()
const { kvkkContactEmail, privacyPageContent } = load("lib/privacy-content.ts")
const { footerContent } = load("lib/shell-content.ts")
const { publicRoutes } = load("lib/public-routes.ts")

test("publishes the controller and application channel in both locales", () => {
  assert.equal(kvkkContactEmail, "kvkk@adakansoftware.com")
  for (const locale of ["tr", "en"]) {
    const text = JSON.stringify(privacyPageContent[locale])
    assert.match(text, /Özgür Erdem Adakan/)
    assert.match(text, /kvkk@adakansoftware\.com/)
    assert.match(text, /Cloudflare/)
    assert.match(text, /Neon/)
    assert.match(text, /Resend/)
  }
})

test("states retention, rights, storage, and avoids treating contact processing as consent", () => {
  const tr = JSON.stringify(privacyPageContent.tr)
  assert.match(tr, /iki yıl/i)
  assert.match(tr, /5\/2-c/)
  assert.match(tr, /5\/2-f/)
  assert.match(tr, /madde 11/i)
  assert.match(tr, /yerel depolama/i)
  assert.match(tr, /30 Eylül 2026/)
  assert.doesNotMatch(tr, /açık rıza vererek|rıza göstermektesiniz/i)
})

test("publishes the localized footer label and honest privacy revision", () => {
  assert.equal(footerContent.tr.privacy, "KVKK ve Gizlilik")
  assert.equal(footerContent.en.privacy, "Privacy")
  assert.equal(publicRoutes.find((route) => route.path === "/privacy")?.lastModified, "2026-09-30")
})

import assert from "node:assert/strict"
import test from "node:test"

import { getLocalSoftwarePage } from "./local-service-page.ts"

test("Istanbul software page carries useful local intent without unverifiable claims", () => {
  for (const locale of ["tr", "en"]) {
    const page = getLocalSoftwarePage(locale)
    assert.match(page.seo.title, /İstanbul|Istanbul/)
    assert.ok(page.sections.length >= 4)
    assert.ok(page.services.length >= 4)
    assert.ok(page.faqs.length >= 4)
    assert.ok(page.relatedLinks.some(item => item.href.includes("/projects")))
    assert.ok(page.relatedLinks.some(item => item.href.includes("/contact")))
    assert.doesNotMatch(JSON.stringify(page), /en iyi|lider|bir numara|#1|garantili sıralama/i)
  }
})

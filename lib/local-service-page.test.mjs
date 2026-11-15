import assert from "node:assert/strict"
import test from "node:test"
import { getLocalSoftwarePage } from "./local-service-page.ts"
import { switchLocalePath } from "./i18n.ts"
import { publicRoutes, getLocalizedPublicPath } from "./public-routes.ts"

test("city language links agree with canonical routes in both directions", () => {
  for (const city of ["istanbul", "van"]) {
    const tr = getLocalSoftwarePage("tr", city)
    const en = getLocalSoftwarePage("en", city)
    const route = publicRoutes.find(route => route.path === tr.path)
    assert.ok(route)
    assert.equal(switchLocalePath(tr.path, "en"), getLocalizedPublicPath(route, "en"))
    assert.equal(switchLocalePath(`/en${en.path}`, "tr"), tr.path)
    assert.equal(switchLocalePath(`/en${en.path}`, "en"), `/en${en.path}`)
  }
  assert.equal(switchLocalePath("/pricing/web", "en"), "/en/pricing/web")
})

test("Van has distinct bilingual service content and registered related destinations", () => {
  for (const locale of ["tr", "en"]) {
    const van = getLocalSoftwarePage(locale, "van")
    const istanbul = getLocalSoftwarePage(locale)
    assert.notDeepEqual(van.sections, istanbul.sections)
    assert.notDeepEqual(van.faqs, istanbul.faqs)
    assert.ok(van.sections.length >= 3)
    assert.ok(van.faqs.length >= 3)
    for (const link of [...van.relatedLinks, ...van.services]) {
      assert.ok(publicRoutes.some(route => (route.localizedPaths?.[locale] ?? route.path) === link.href), link.href)
    }
  }
})

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

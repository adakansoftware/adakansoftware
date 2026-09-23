import assert from "node:assert/strict"
import test from "node:test"

import { getServicePage, servicePageSlugs } from "./service-pages.ts"

test("software SEO landing pages have unique localized search intent", () => {
  assert.deepEqual(servicePageSlugs, ["software-development", "web-development", "nextjs-development"])

  for (const locale of ["tr", "en"]) {
    const pages = servicePageSlugs.map(slug => getServicePage(slug, locale))
    assert.equal(new Set(pages.map(page => page.seo.title)).size, pages.length)
    for (const page of pages) {
      assert.ok(page.seo.description.length >= 100)
      assert.ok(page.keywords.length >= 5)
      assert.ok(page.capabilities.length >= 4)
      assert.ok(page.deliverables.length >= 4)
    }
  }
})

test("unknown software landing page slugs are rejected", () => {
  assert.equal(getServicePage("unknown", "tr"), undefined)
})

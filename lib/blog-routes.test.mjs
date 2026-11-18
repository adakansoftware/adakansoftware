/* global URL */
import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

import { publicRoutes, getLocalizedPublicPath } from "./public-routes.ts"
import { getLocalizedRouteAlternate } from "./localized-route-map.ts"

const indexSource = fs.readFileSync(new URL("../components/static-page-routes.tsx", import.meta.url), "utf8")
const articleComponentPath = new URL("../components/blog-article-page.tsx", import.meta.url)
const trRoutePath = new URL("../app/blog/[slug]/page.tsx", import.meta.url)
const enRoutePath = new URL("../app/[locale]/blog/[slug]/page.tsx", import.meta.url)

test("blog index renders crawlable guide links instead of placeholder copy", () => {
  assert.match(indexSource, /getBlogPosts/)
  assert.match(indexSource, /post\.slug/)
  assert.doesNotMatch(indexSource, /paylaşacağız|will appear here/)
})

test("article component exposes semantic content, FAQs, and a related service link", () => {
  const source = fs.readFileSync(articleComponentPath, "utf8")
  assert.match(source, /BlogArticleJsonLd/)
  assert.match(source, /<article/)
  assert.match(source, /<h1/)
  assert.match(source, /<h2/)
  assert.match(source, /<details/)
  assert.match(source, /relatedService\.href/)
})

test("localized dynamic routes prebuild known slugs and reject unknown posts", () => {
  for (const routePath of [trRoutePath, enRoutePath]) {
    const source = fs.readFileSync(routePath, "utf8")
    assert.match(source, /dynamicParams = false/)
    assert.match(source, /generateStaticParams/)
    assert.match(source, /getBlogPostBySlug/)
    assert.match(source, /notFound\(\)/)
    assert.match(source, /localizedPaths/)
    assert.match(source, /createPageMetadata/)
  }
})

test("language switching resolves the corresponding localized article slug", () => {
  assert.equal(
    getLocalizedRouteAlternate("/blog/ozel-yazilim-gelistirme-rehberi", "en"),
    "/en/blog/custom-software-development-guide",
  )
  assert.equal(
    getLocalizedRouteAlternate("/en/blog/custom-software-development-guide", "tr"),
    "/blog/ozel-yazilim-gelistirme-rehberi",
  )
  assert.equal(getLocalizedRouteAlternate("/en/services", "tr"), "/services")
})


test("language switching matches every registered public route in both directions", () => {
  for (const route of publicRoutes) {
    const tr = getLocalizedPublicPath(route, "tr")
    const en = getLocalizedPublicPath(route, "en")
    assert.equal(getLocalizedRouteAlternate(tr, "en"), en, tr)
    assert.equal(getLocalizedRouteAlternate(en, "tr"), tr, en)
  }
})

/* global URL */
import assert from "node:assert/strict"
import test from "node:test"
import { loadTypescript } from "./test-support/load-typescript.mjs"

const load = loadTypescript()
const { createRouteMetadata } = load("lib/metadata.ts")
const { publicRoutes } = load("lib/public-routes.ts")

test("every localized route has one branded title and consistent canonical and social URLs", () => {
  for (const locale of ["tr", "en"]) {
    const titles = new Set()
    for (const route of publicRoutes) {
      const metadata = createRouteMetadata(route.metadataKey, locale, route.path)
      assert.equal(typeof metadata.title.absolute, "string")
      assert.equal(metadata.title.absolute.split("Adakan Software").length, 2)
      assert.ok(metadata.title.absolute.length <= 70, `${route.path} title is too long`)
      if (route.indexable !== false) assert.ok(metadata.description.length >= 70, `${route.path} description is too short`)
      assert.ok(metadata.description.length <= 170, `${route.path} description is too long`)
      titles.add(metadata.title.absolute)
      const canonical = new URL((locale === "en" ? "/en" : "") + (route.path === "/" && locale === "en" ? "" : route.path), "https://adakansoftware.com").href
      assert.equal(metadata.alternates.canonical, canonical)
      assert.equal(metadata.openGraph.url, canonical)
      assert.ok(metadata.alternates.languages.en)
      assert.ok(metadata.alternates.languages.tr)
      assert.equal(new URL(metadata.openGraph.images[0].url).searchParams.get("locale"), locale)
      assert.equal(metadata.robots.index, route.indexable !== false)
      assert.equal(metadata.robots.googleBot.index, route.indexable !== false)
    }
    assert.equal(titles.size, publicRoutes.length)
  }
})

/* global URL */
import assert from "node:assert/strict"
import test from "node:test"

import { buildLlmsText, buildRobotsPolicy, buildSitemapEntries, publicRoutes } from "./public-routes.ts"
import { getBlogPostPaths } from "./blog-posts.ts"

const baseUrl = "https://adakansoftware.com"

test("sitemap emits every public locale URL with reciprocal language alternates", () => {
  const entries = buildSitemapEntries(publicRoutes, baseUrl)

  assert.equal(entries.length, publicRoutes.filter(route => route.indexable !== false).length * 2)
  assert.ok(!entries.some(entry => /\/(careers|testimonials)$/.test(entry.url)))
  assert.ok(entries.some(entry => entry.url === "https://adakansoftware.com/blog"))
  assert.deepEqual(entries[0], {
    url: "https://adakansoftware.com",
    alternates: {
      languages: {
        tr: "https://adakansoftware.com",
        en: "https://adakansoftware.com/en",
        "x-default": "https://adakansoftware.com",
      },
    },
    changeFrequency: "weekly",
    priority: 1,
  })

  const projectsEntry = entries.find(entry => entry.url === "https://adakansoftware.com/projects")
  assert.deepEqual(projectsEntry.images, [
    "https://adakansoftware.com/projects/z-grup-insaat-cover.png",
    "https://adakansoftware.com/projects/sallihogullari-hafriyat-cover.png",
    "https://adakansoftware.com/projects/z-grup-logo.svg",
    "https://adakansoftware.com/projects/salihogullari-hafriyat-logo.svg",
    "https://adakansoftware.com/projects/adakan-hafriyat-logo.svg",
    "https://adakansoftware.com/favicon-v3.svg",
  ])
})

test("sitemap publishes localized article slugs with honest modification dates", () => {
  const entries = buildSitemapEntries(publicRoutes, baseUrl)

  for (const post of getBlogPostPaths()) {
    const tr = entries.find(entry => entry.url === new URL(post.tr, baseUrl).href)
    const en = entries.find(entry => entry.url === new URL(`/en${post.en}`, baseUrl).href)
    assert.equal(tr.lastModified, post.lastModified)
    assert.equal(en.lastModified, post.lastModified)
    assert.equal(tr.alternates.languages.en, en.url)
    assert.equal(en.alternates.languages.tr, tr.url)
  }
})

test("sitemap publishes the Istanbul service page and localized case studies", () => {
  const entries = buildSitemapEntries(publicRoutes, baseUrl)
  const local = entries.find(entry => entry.url === `${baseUrl}/istanbul-yazilim-sirketi`)
  assert.equal(local.alternates.languages.en, `${baseUrl}/en/istanbul-software-company`)
  assert.ok(entries.some(entry => entry.url === `${baseUrl}/projects/z-grup-insaat`))
  assert.ok(entries.some(entry => entry.url === `${baseUrl}/en/projects/z-group-construction`))
  assert.ok(entries.some(entry => entry.url === `${baseUrl}/projects/salihogullari-hafriyat`))
})

test("robots policy permits public crawling and prevents admin and API crawling", () => {
  assert.deepEqual(buildRobotsPolicy(baseUrl), {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/en/admin"] },
    sitemap: "https://adakansoftware.com/sitemap.xml",
    host: "https://adakansoftware.com",
  })
})

test("llms index includes canonical public marketing pages and omits legal pages", () => {
  const output = buildLlmsText({ name: "Adakan Software", location: "Istanbul, Turkey", baseUrl, routes: publicRoutes })

  assert.match(output, /\[services\]\(https:\/\/adakansoftware\.com\/services\)/)
  assert.match(output, /\[blog\]\(https:\/\/adakansoftware\.com\/blog\)/)
  assert.match(output, /ozel-yazilim-gelistirme-rehberi/)
  assert.doesNotMatch(output, /\/privacy\)/)
  assert.match(output, /English equivalents are available under \/en\./)
})

/* global URL */
import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

import { blogPostKeys } from "./blog-posts.ts"
import { getBlogEditorial, getRelatedBlogPosts } from "./blog-editorial.ts"

test("every guide discloses authorship, editorial basis, and primary sources", () => {
  for (const locale of ["tr", "en"]) {
    for (const key of blogPostKeys) {
      const editorial = getBlogEditorial(key, locale)
      assert.equal(editorial.author.name, "Adakan Software")
      assert.equal(editorial.author.href, locale === "tr" ? "/about" : "/en/about")
      assert.ok(editorial.method.length >= 100)
      assert.ok(editorial.sources.length >= 2)
      assert.ok(editorial.sources.every(source => /^https:\/\//.test(source.href)))
      assert.ok(editorial.sources.every(source => ["developers.google.com", "nextjs.org", "owasp.org", "developer.mozilla.org"].includes(new URL(source.href).hostname)))
    }
  }
})

test("every guide has contextual links to distinct related guides", () => {
  for (const locale of ["tr", "en"]) {
    for (const key of blogPostKeys) {
      const related = getRelatedBlogPosts(key, locale)
      assert.ok(related.length >= 2)
      assert.ok(related.every(post => post.key !== key))
      assert.equal(new Set(related.map(post => post.key)).size, related.length)
    }
  }
})

test("article page renders visible authorship, sources, and related guide links", () => {
  const source = fs.readFileSync(new URL("../components/blog-article-page.tsx", import.meta.url), "utf8")
  assert.match(source, /getBlogEditorial/)
  assert.match(source, /getRelatedBlogPosts/)
  assert.match(source, /editorial\.author/)
  assert.match(source, /editorial\.sources/)
  assert.match(source, /relatedPosts/)
})

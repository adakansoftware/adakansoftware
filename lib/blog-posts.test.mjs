import assert from "node:assert/strict"
import test from "node:test"

import { blogPostKeys, getBlogPostBySlug, getBlogPostPaths, getBlogPosts } from "./blog-posts.ts"

test("publishes four substantial bilingual software guides", () => {
  assert.equal(blogPostKeys.length, 4)

  for (const locale of ["tr", "en"]) {
    const posts = getBlogPosts(locale)
    assert.equal(posts.length, 4)
    assert.equal(new Set(posts.map(post => post.slug)).size, posts.length)
    assert.equal(new Set(posts.map(post => post.seo.title)).size, posts.length)

    for (const post of posts) {
      const body = post.sections.flatMap(section => section.paragraphs).join(" ")
      assert.ok(post.sections.length >= 4, `${post.slug} needs at least four sections`)
      assert.ok(body.length >= 1800, `${post.slug} is too thin`)
      assert.ok(post.faqs.length >= 3, `${post.slug} needs useful FAQs`)
      assert.match(post.relatedService.href, /^\/services\//)
      assert.equal(post.publishedAt, "2026-09-25")
      assert.equal(post.modifiedAt, "2026-09-25")
    }
  }
})

test("localized paths pair each Turkish guide with its English equivalent", () => {
  const paths = getBlogPostPaths()
  assert.equal(paths.length, blogPostKeys.length)
  assert.equal(new Set(paths.flatMap(item => [item.tr, item.en])).size, paths.length * 2)

  for (const item of paths) {
    const trSlug = item.tr.split("/").at(-1)
    const enSlug = item.en.split("/").at(-1)
    assert.equal(getBlogPostBySlug(trSlug, "tr")?.key, item.key)
    assert.equal(getBlogPostBySlug(enSlug, "en")?.key, item.key)
  }
})


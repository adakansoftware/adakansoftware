import assert from "node:assert/strict"
import test from "node:test"

import { blogPostKeys, getBlogPostBySlug, getBlogPostPaths, getBlogPosts } from "./blog-posts.ts"

test("publishes every registered bilingual software guide", () => {
  assert.ok(blogPostKeys.length >= 5)

  for (const locale of ["tr", "en"]) {
    const posts = getBlogPosts(locale)
    assert.equal(posts.length, blogPostKeys.length)
    assert.deepEqual(new Set(posts.map(post => post.key)), new Set(blogPostKeys))
    assert.equal(new Set(posts.map(post => post.slug)).size, posts.length)
    assert.equal(new Set(posts.map(post => post.seo.title)).size, posts.length)

    for (const post of posts) {
      const body = post.sections.flatMap(section => section.paragraphs).join(" ")
      assert.ok(post.sections.length >= 4, `${post.slug} needs at least four sections`)
      assert.ok(body.length >= 1800, `${post.slug} is too thin`)
      assert.ok(post.faqs.length >= 3, `${post.slug} needs useful FAQs`)
      assert.match(post.relatedService.href, /^\/services\//)
      assert.match(post.publishedAt, /^\d{4}-\d{2}-\d{2}$/)
      assert.ok(Number.isFinite(Date.parse(post.publishedAt)))
      assert.ok(Date.parse(post.modifiedAt) >= Date.parse(post.publishedAt))
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


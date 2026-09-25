/* global URL */
import assert from "node:assert/strict"
import test from "node:test"
import { loadTypescript } from "./test-support/load-typescript.mjs"

const load = loadTypescript()
const { createPageMetadata, createRouteMetadata } = load("lib/metadata.ts")
const { getPublicUrl, publicRoutes } = load("lib/public-routes.ts")
const { getServicePage } = load("lib/service-pages.ts")
const { getBlogPosts } = load("lib/blog-posts.ts")
const { getCaseStudyPaths, getCaseStudy } = load("lib/case-studies.ts")
const { getLocalSoftwarePage } = load("lib/local-service-page.ts")

test("every localized route has one branded title and consistent canonical and social URLs", () => {
  for (const locale of ["tr", "en"]) {
    const titles = new Set()
    for (const route of publicRoutes) {
      const servicePage = route.path.startsWith("/services/") ? getServicePage(route.path.split("/").at(-1), locale) : undefined
      const blogPost = route.blogPostKey ? getBlogPosts(locale).find(post => post.key === route.blogPostKey) : undefined
      const casePath = getCaseStudyPaths().find(item => item.tr === route.path)
      const caseStudy = casePath ? getCaseStudy(casePath.key, locale) : undefined
      const localPage = route.metadataKey === "istanbulSoftwareCompany" ? getLocalSoftwarePage(locale) : undefined
      const metadata = blogPost
        ? createPageMetadata({ locale, path: route.localizedPaths[locale], localizedPaths: route.localizedPaths, title: blogPost.seo.title, description: blogPost.seo.description, keywords: blogPost.seo.keywords })
        : caseStudy
        ? createPageMetadata({ locale, path: route.path, localizedPaths: route.localizedPaths, title: caseStudy.seo.title, description: caseStudy.seo.description, keywords: caseStudy.seo.keywords })
        : localPage
        ? createPageMetadata({ locale, path: route.path, localizedPaths: route.localizedPaths, title: localPage.seo.title, description: localPage.seo.description, keywords: localPage.seo.keywords })
        : servicePage
        ? createPageMetadata({ locale, path: servicePage.path, title: servicePage.seo.title, description: servicePage.seo.description, keywords: servicePage.keywords })
        : createRouteMetadata(route.metadataKey, locale, route.path)
      assert.equal(typeof metadata.title.absolute, "string")
      assert.equal(metadata.title.absolute.split("Adakan Software").length, 2)
      assert.ok(metadata.title.absolute.length <= 70, `${route.path} title is too long`)
      if (route.indexable !== false) assert.ok(metadata.description.length >= 70, `${route.path} description is too short`)
      assert.ok(metadata.description.length <= 170, `${route.path} description is too long`)
      titles.add(metadata.title.absolute)
      const canonical = getPublicUrl(route, locale, "https://adakansoftware.com")
      assert.equal(metadata.alternates.canonical, canonical)
      assert.equal(metadata.openGraph.url, canonical)
      assert.ok(metadata.alternates.languages.en)
      assert.ok(metadata.alternates.languages.tr)
      assert.equal(metadata.alternates.languages["x-default"], metadata.alternates.languages.tr)
      assert.equal(new URL(metadata.openGraph.images[0].url).searchParams.get("locale"), locale)
      assert.equal(metadata.robots.index, route.indexable !== false)
      assert.equal(metadata.robots.googleBot.index, route.indexable !== false)
    }
    assert.equal(titles.size, publicRoutes.length)
  }
})

test("article metadata supports different Turkish and English slugs", () => {
  const localizedPaths = {
    tr: "/blog/ozel-yazilim-gelistirme-rehberi",
    en: "/blog/custom-software-development-guide",
  }
  const metadata = createPageMetadata({
    locale: "en",
    path: localizedPaths.en,
    localizedPaths,
    title: "Custom Software Development Guide",
    description: "A practical guide to planning and delivering reliable custom software for a real business workflow.",
  })

  assert.equal(metadata.alternates.canonical, "https://adakansoftware.com/en/blog/custom-software-development-guide")
  assert.deepEqual(metadata.alternates.languages, {
    tr: "https://adakansoftware.com/blog/ozel-yazilim-gelistirme-rehberi",
    en: "https://adakansoftware.com/en/blog/custom-software-development-guide",
    "x-default": "https://adakansoftware.com/blog/ozel-yazilim-gelistirme-rehberi",
  })
})

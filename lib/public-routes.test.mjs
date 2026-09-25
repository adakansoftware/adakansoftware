import assert from "node:assert/strict"
import test from "node:test"

import { getLocalizedPublicPath, getPublicUrl, publicRoutes } from "./public-routes.ts"
import { getBlogPostPaths } from "./blog-posts.ts"
import { getCaseStudyPaths } from "./case-studies.ts"

test("public routes produce unique canonical URLs for both supported locales", () => {
  const urls = publicRoutes.flatMap((route) => [getPublicUrl(route, "tr", "https://adakansoftware.com"), getPublicUrl(route, "en", "https://adakansoftware.com")])

  assert.equal(new Set(urls).size, urls.length)
  assert.equal(getLocalizedPublicPath(publicRoutes[0], "tr"), "/")
  assert.equal(getLocalizedPublicPath(publicRoutes[0], "en"), "/en")
  assert.equal(getPublicUrl(publicRoutes[0], "tr", "https://adakansoftware.com"), "https://adakansoftware.com")
  assert.deepEqual(
    publicRoutes.map((route) => route.path),
    ["/", "/about", "/approach", "/blog", ...getBlogPostPaths().map(post => post.tr), "/careers", "/contact", "/demos", "/istanbul-yazilim-sirketi", "/logo", "/privacy", "/pricing", "/projects", ...getCaseStudyPaths().map(study => study.tr), "/services", "/services/software-development", "/services/web-development", "/services/nextjs-development", "/services/web-application-development", "/services/business-automation", "/services/ui-ux-design", "/terms", "/testimonials"],
  )
})

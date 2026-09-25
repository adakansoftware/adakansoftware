import type { Locale } from "./i18n"
import type { RouteMetadataKey } from "./route-metadata-content"
import { getBlogPostPaths, type BlogPostKey } from "./blog-posts.ts"
import { getCaseStudyPaths } from "./case-studies.ts"

export type PublicRoute = {
  path: string
  metadataKey: RouteMetadataKey
  llms: boolean
  indexable?: boolean
  images?: readonly string[]
  localizedPaths?: Partial<Record<Locale, string>>
  lastModified: string
  blogPostKey?: BlogPostKey
}

const siteContentRevision = "2026-09-25"

const blogPublicRoutes = getBlogPostPaths().map((post) => ({
  path: post.tr,
  localizedPaths: { tr: post.tr, en: post.en },
  metadataKey: "blog" as const,
  llms: true,
  lastModified: post.lastModified,
  blogPostKey: post.key,
}))

const caseStudyPublicRoutes = getCaseStudyPaths().map((study) => ({
  path: study.tr,
  localizedPaths: { tr: study.tr, en: study.en },
  metadataKey: "projects" as const,
  llms: true,
  lastModified: study.lastModified,
  images: [study.key === "z-grup-insaat" ? "/projects/optimized/z-grup-insaat-cover.webp" : "/projects/optimized/sallihogullari-hafriyat-cover.webp"],
}))

export const publicRoutes = [
  { path: "/", metadataKey: "home", llms: true, lastModified: siteContentRevision },
  { path: "/about", metadataKey: "about", llms: true, lastModified: siteContentRevision },
  { path: "/approach", metadataKey: "approach", llms: true, lastModified: siteContentRevision },
  { path: "/blog", metadataKey: "blog", llms: true, lastModified: siteContentRevision },
  ...blogPublicRoutes,
  { path: "/careers", metadataKey: "careers", llms: false, indexable: false, lastModified: siteContentRevision },
  { path: "/contact", metadataKey: "contact", llms: true, lastModified: siteContentRevision },
  { path: "/demos", metadataKey: "demos", llms: true, lastModified: siteContentRevision, images: ["/demos/tableflow-pos-dashboard.png", "/projects/optimized/z-grup-insaat-cover.webp", "/demos/adakan-dental-clinic.png", "/projects/optimized/sallihogullari-hafriyat-cover.webp"] },
  { path: "/istanbul-yazilim-sirketi", localizedPaths: { tr: "/istanbul-yazilim-sirketi", en: "/istanbul-software-company" }, metadataKey: "istanbulSoftwareCompany", llms: true, lastModified: siteContentRevision },
  { path: "/logo", metadataKey: "logo", llms: true, lastModified: siteContentRevision, images: ["/projects/optimized/z-grup-logo.webp", "/projects/optimized/salihogullari-hafriyat-logo.webp", "/projects/optimized/adakan-hafriyat-insaat-logo.webp", "/projects/optimized/adakan-software-logo.webp"] },
  { path: "/privacy", metadataKey: "privacy", llms: false, lastModified: siteContentRevision },
  { path: "/pricing", metadataKey: "pricing", llms: true, lastModified: siteContentRevision },
  { path: "/projects", metadataKey: "projects", llms: true, lastModified: siteContentRevision, images: ["/projects/optimized/z-grup-insaat-cover.webp", "/projects/optimized/sallihogullari-hafriyat-cover.webp", "/projects/optimized/z-grup-logo.webp", "/projects/optimized/salihogullari-hafriyat-logo.webp", "/projects/optimized/adakan-hafriyat-insaat-logo.webp", "/projects/optimized/adakan-software-logo.webp"] },
  ...caseStudyPublicRoutes,
  { path: "/services", metadataKey: "services", llms: true, lastModified: siteContentRevision },
  { path: "/services/software-development", metadataKey: "services", llms: true, lastModified: siteContentRevision },
  { path: "/services/web-development", metadataKey: "services", llms: true, lastModified: siteContentRevision },
  { path: "/services/nextjs-development", metadataKey: "services", llms: true, lastModified: siteContentRevision },
  { path: "/services/web-application-development", metadataKey: "services", llms: true, lastModified: siteContentRevision },
  { path: "/services/business-automation", metadataKey: "services", llms: true, lastModified: siteContentRevision },
  { path: "/services/ui-ux-design", metadataKey: "services", llms: true, lastModified: siteContentRevision },
  { path: "/terms", metadataKey: "terms", llms: false, lastModified: siteContentRevision },
  { path: "/testimonials", metadataKey: "testimonials", llms: false, indexable: false, lastModified: siteContentRevision },
] as const satisfies readonly PublicRoute[]

export function getLocalizedPublicPath(route: PublicRoute, locale: Locale): string {
  const localizedPath = route.localizedPaths?.[locale] ?? route.path
  return locale === "tr" ? localizedPath : localizedPath === "/" ? "/en" : `/en${localizedPath}`
}

export function getPublicUrl(route: PublicRoute, locale: Locale, baseUrl: string): string {
  const url = new URL(getLocalizedPublicPath(route, locale), baseUrl).toString()
  return getLocalizedPublicPath(route, locale) === "/" ? url.replace(/\/$/, "") : url
}

export function getPublicRouteByPath(path: string): PublicRoute | undefined {
  return publicRoutes.find((route) => route.path === path)
}

export function buildSitemapEntries(routes: readonly PublicRoute[], baseUrl: string) {
  return routes.filter((route) => route.indexable !== false).flatMap((route) => {
    const alternates = {
      languages: {
        tr: getPublicUrl(route, "tr", baseUrl),
        en: getPublicUrl(route, "en", baseUrl),
        "x-default": getPublicUrl(route, "tr", baseUrl),
      },
    }

    return [
      {
        url: getPublicUrl(route, "tr", baseUrl),
        alternates,
        ...(route.images?.length ? { images: route.images.map((image) => new URL(image, baseUrl).href) } : {}),
        lastModified: route.lastModified,
      },
      {
        url: getPublicUrl(route, "en", baseUrl),
        alternates,
        ...(route.images?.length ? { images: route.images.map((image) => new URL(image, baseUrl).href) } : {}),
        lastModified: route.lastModified,
      },
    ]
  })
}

export function buildRobotsPolicy(baseUrl: string) {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/en/admin"] },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

export function buildLlmsText({
  name,
  location,
  baseUrl,
  routes,
}: {
  name: string
  location: string
  baseUrl: string
  routes: readonly PublicRoute[]
}) {
  const links = routes
    .filter((route) => route.llms)
    .map((route) => `- [${route.path === "/" ? name : route.path.slice(1)}](${getPublicUrl(route, "tr", baseUrl)})`)
    .join("\n")

  return `# ${name}\n\n${location}. Design, brand identity, and web development studio.\n\n## Canonical public pages\n${links}\n\nEnglish equivalents are available under /en.\n`
}

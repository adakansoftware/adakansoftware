import type { MetadataRoute } from "next"

import type { Locale } from "./i18n"
import type { RouteMetadataKey } from "./route-metadata-content"
import { getBlogPostPaths, type BlogPostKey } from "./blog-posts.ts"
import { getCaseStudyPaths } from "./case-studies.ts"

export type PublicRoute = {
  path: string
  metadataKey: RouteMetadataKey
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
  llms: boolean
  indexable?: boolean
  images?: readonly string[]
  localizedPaths?: Partial<Record<Locale, string>>
  lastModified?: string
  blogPostKey?: BlogPostKey
}

const blogPublicRoutes = getBlogPostPaths().map((post) => ({
  path: post.tr,
  localizedPaths: { tr: post.tr, en: post.en },
  metadataKey: "blog" as const,
  changeFrequency: "monthly" as const,
  priority: 0.75,
  llms: true,
  lastModified: post.lastModified,
  blogPostKey: post.key,
}))

const caseStudyPublicRoutes = getCaseStudyPaths().map((study) => ({
  path: study.tr,
  localizedPaths: { tr: study.tr, en: study.en },
  metadataKey: "projects" as const,
  changeFrequency: "monthly" as const,
  priority: 0.8,
  llms: true,
  lastModified: study.lastModified,
  images: [study.key === "z-grup-insaat" ? "/projects/z-grup-insaat-cover.png" : "/projects/sallihogullari-hafriyat-cover.png"],
}))

export const publicRoutes = [
  { path: "/", metadataKey: "home", changeFrequency: "weekly", priority: 1, llms: true },
  { path: "/about", metadataKey: "about", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/approach", metadataKey: "approach", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/blog", metadataKey: "blog", changeFrequency: "weekly", priority: 0.8, llms: true, lastModified: "2026-09-25" },
  ...blogPublicRoutes,
  { path: "/careers", metadataKey: "careers", changeFrequency: "monthly", priority: 0.8, llms: false, indexable: false },
  { path: "/contact", metadataKey: "contact", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/demos", metadataKey: "demos", changeFrequency: "monthly", priority: 0.8, llms: true, images: ["/demos/tableflow-pos-dashboard.png", "/projects/z-grup-insaat-cover.png", "/demos/adakan-dental-clinic.png", "/projects/sallihogullari-hafriyat-cover.png"] },
  { path: "/istanbul-yazilim-sirketi", localizedPaths: { tr: "/istanbul-yazilim-sirketi", en: "/istanbul-software-company" }, metadataKey: "istanbulSoftwareCompany", changeFrequency: "monthly", priority: 0.9, llms: true, lastModified: "2026-09-25" },
  { path: "/logo", metadataKey: "logo", changeFrequency: "monthly", priority: 0.8, llms: true, images: ["/projects/z-grup-logo.svg", "/projects/salihogullari-hafriyat-logo.svg", "/projects/adakan-hafriyat-logo.svg", "/favicon-v3.svg"] },
  { path: "/privacy", metadataKey: "privacy", changeFrequency: "yearly", priority: 0.3, llms: false },
  { path: "/pricing", metadataKey: "pricing", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/projects", metadataKey: "projects", changeFrequency: "monthly", priority: 0.8, llms: true, images: ["/projects/z-grup-insaat-cover.png", "/projects/sallihogullari-hafriyat-cover.png", "/projects/z-grup-logo.svg", "/projects/salihogullari-hafriyat-logo.svg", "/projects/adakan-hafriyat-logo.svg", "/favicon-v3.svg"] },
  ...caseStudyPublicRoutes,
  { path: "/services", metadataKey: "services", changeFrequency: "monthly", priority: 0.9, llms: true },
  { path: "/services/software-development", metadataKey: "services", changeFrequency: "monthly", priority: 0.9, llms: true },
  { path: "/services/web-development", metadataKey: "services", changeFrequency: "monthly", priority: 0.9, llms: true },
  { path: "/services/nextjs-development", metadataKey: "services", changeFrequency: "monthly", priority: 0.9, llms: true },
  { path: "/services/web-application-development", metadataKey: "services", changeFrequency: "monthly", priority: 0.9, llms: true },
  { path: "/services/business-automation", metadataKey: "services", changeFrequency: "monthly", priority: 0.9, llms: true },
  { path: "/services/ui-ux-design", metadataKey: "services", changeFrequency: "monthly", priority: 0.9, llms: true },
  { path: "/terms", metadataKey: "terms", changeFrequency: "yearly", priority: 0.3, llms: false },
  { path: "/testimonials", metadataKey: "testimonials", changeFrequency: "monthly", priority: 0.7, llms: false, indexable: false },
] as const satisfies readonly PublicRoute[]

export function getLocalizedPublicPath(route: PublicRoute, locale: Locale): string {
  const localizedPath = route.localizedPaths?.[locale] ?? route.path
  return locale === "tr" ? localizedPath : localizedPath === "/" ? "/en" : `/en${localizedPath}`
}

export function getPublicUrl(route: PublicRoute, locale: Locale, baseUrl: string): string {
  return new URL(getLocalizedPublicPath(route, locale), baseUrl).toString()
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
        ...(route.lastModified ? { lastModified: route.lastModified } : {}),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      },
      {
        url: getPublicUrl(route, "en", baseUrl),
        alternates,
        ...(route.images?.length ? { images: route.images.map((image) => new URL(image, baseUrl).href) } : {}),
        ...(route.lastModified ? { lastModified: route.lastModified } : {}),
        changeFrequency: route.changeFrequency,
        priority: Math.max(route.priority - 0.05, 0),
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

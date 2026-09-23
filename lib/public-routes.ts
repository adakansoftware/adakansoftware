import type { MetadataRoute } from "next"

import type { Locale } from "./i18n"
import type { RouteMetadataKey } from "./route-metadata-content"

export type PublicRoute = {
  path: string
  metadataKey: RouteMetadataKey
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
  llms: boolean
  indexable?: boolean
}

export const publicRoutes = [
  { path: "/", metadataKey: "home", changeFrequency: "weekly", priority: 1, llms: true },
  { path: "/about", metadataKey: "about", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/approach", metadataKey: "approach", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/blog", metadataKey: "blog", changeFrequency: "monthly", priority: 0.8, llms: false, indexable: false },
  { path: "/careers", metadataKey: "careers", changeFrequency: "monthly", priority: 0.8, llms: false, indexable: false },
  { path: "/contact", metadataKey: "contact", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/logo", metadataKey: "logo", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/privacy", metadataKey: "privacy", changeFrequency: "yearly", priority: 0.3, llms: false },
  { path: "/pricing", metadataKey: "pricing", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/projects", metadataKey: "projects", changeFrequency: "monthly", priority: 0.8, llms: true },
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
  return locale === "tr" ? route.path : route.path === "/" ? "/en" : `/en${route.path}`
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
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      },
      {
        url: getPublicUrl(route, "en", baseUrl),
        alternates,
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

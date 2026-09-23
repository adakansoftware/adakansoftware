import type { Locale } from "@/lib/i18n"
import { getPublicRouteByPath, getPublicUrl } from "@/lib/public-routes"
import { routeMetadataContent } from "@/lib/route-metadata-content"
import { siteConfig } from "@/lib/site-config"
import { createBreadcrumbSchema, createServiceSchema, createWebPageSchema } from "@/lib/structured-data"
import { serializeJsonLd } from "@/lib/json-ld"

export function PageJsonLd({ locale, path, content: contentOverride, serviceTypes }: { locale: Locale; path: string; content?: { title: string; description: string }; serviceTypes?: string[] }) {
  const route = getPublicRouteByPath(path)

  if (!route) return null

  const content = contentOverride ?? routeMetadataContent[route.metadataKey][locale]
  const url = getPublicUrl(route, locale, siteConfig.url)
  const schemas = [
    createWebPageSchema({ route, locale, url, content }),
    ...(path === "/" ? [] : [createBreadcrumbSchema({ locale, url, pageName: content.title })]),
    ...(route.metadataKey === "services" ? [createServiceSchema({ locale, url, name: content.title, description: content.description, serviceTypes })] : []),
  ]

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemas) }} />
}

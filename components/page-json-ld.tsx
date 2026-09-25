import type { Locale } from "@/lib/i18n"
import { getPublicRouteByPath, getPublicUrl } from "@/lib/public-routes"
import { routeMetadataContent } from "@/lib/route-metadata-content"
import { siteConfig } from "@/lib/site-config"
import { createBreadcrumbSchema, createFaqSchema, createItemListSchema, createServiceSchema, createWebPageSchema, type StructuredDataItem } from "@/lib/structured-data"
import { serializeJsonLd } from "@/lib/json-ld"
import { NonceScript } from "@/components/nonce-script"

export function PageJsonLd({ locale, path, content: contentOverride, serviceTypes, faqs, items }: { locale: Locale; path: string; content?: { title: string; description: string }; serviceTypes?: string[]; faqs?: Array<{ question: string; answer: string }>; items?: StructuredDataItem[] }) {
  const route = getPublicRouteByPath(path)

  if (!route) return null

  const content = contentOverride ?? routeMetadataContent[route.metadataKey][locale]
  const url = getPublicUrl(route, locale, siteConfig.url)
  const absoluteItems = items?.map((item) => ({
    ...item,
    ...(item.url ? { url: new URL(item.url, siteConfig.url).href } : {}),
    ...(item.image ? { image: new URL(item.image, siteConfig.url).href } : {}),
  }))
  const schemas = [
    createWebPageSchema({ route, locale, url, content, mainEntityId: absoluteItems?.length ? `${url}#item-list` : undefined }),
    ...(path === "/" ? [] : [createBreadcrumbSchema({ locale, url, pageName: content.title })]),
    ...(route.metadataKey === "services" ? [createServiceSchema({ locale, url, name: content.title, description: content.description, serviceTypes })] : []),
    ...(faqs?.length ? [createFaqSchema({ url, faqs })] : []),
    ...(absoluteItems?.length ? [createItemListSchema({ url, name: content.title, items: absoluteItems })] : []),
  ]

  return <NonceScript type="application/ld+json" content={serializeJsonLd(schemas)} />
}

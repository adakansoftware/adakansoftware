import type { Metadata } from "next"

import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"
import { routeMetadataContent, type RouteMetadataKey } from "@/lib/route-metadata-content"
import { getPublicRouteByPath } from "@/lib/public-routes"

const siteName = siteConfig.name
const siteUrl = siteConfig.url
const localeMap: Record<Locale, { og: string; alternates: string }> = {
  tr: { og: "tr_TR", alternates: "tr-TR" },
  en: { og: "en_US", alternates: "en-US" },
}

type PageMetadataInput = {
  locale: Locale
  title: string
  description: string
  path: string
  keywords?: string[]
}

export function createPageMetadata({
  locale,
  title,
  description,
  path,
  keywords = [],
}: PageMetadataInput): Metadata {
  const canonicalPath = locale === "tr" ? path : `/en${path === "/" ? "" : path}`
  const canonicalUrl = new URL(canonicalPath, siteUrl).href
  const ogImageUrl = new URL("/og", siteUrl)
  ogImageUrl.searchParams.set("page", path.slice(1) || "home")
  ogImageUrl.searchParams.set("locale", locale)
  const ogImage = ogImageUrl.href
  const fullTitle = `${title} | ${siteName}`
  const index = getPublicRouteByPath(path)?.indexable !== false

  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        tr: new URL(path, siteUrl).href,
        en: new URL(path === "/" ? "/en" : `/en${path}`, siteUrl).href,
        "x-default": new URL(path, siteUrl).href,
      },
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: canonicalUrl,
      siteName,
      locale: localeMap[locale].og,
      alternateLocale: [localeMap[locale === "tr" ? "en" : "tr"].og],
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} | ${siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage],
    },
    robots: {
      index,
      follow: true,
      googleBot: { index, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  }
}

export function createRouteMetadata(route: RouteMetadataKey, locale: Locale, path: string): Metadata {
  const content = routeMetadataContent[route][locale]

  return createPageMetadata({
    locale,
    title: content.title,
    description: content.description,
    path,
    keywords: content.keywords,
  })
}

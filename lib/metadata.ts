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
  localizedPaths?: Record<Locale, string>
}

export function createPageMetadata({
  locale,
  title,
  description,
  path,
  keywords = [],
  localizedPaths,
}: PageMetadataInput): Metadata {
  const paths = localizedPaths ?? { tr: path, en: path }
  const canonicalPath = locale === "tr" ? paths.tr : `/en${paths.en === "/" ? "" : paths.en}`
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
        tr: new URL(paths.tr, siteUrl).href,
        en: new URL(paths.en === "/" ? "/en" : `/en${paths.en}`, siteUrl).href,
        "x-default": new URL(paths.tr, siteUrl).href,
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

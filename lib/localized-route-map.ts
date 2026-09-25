import { stripLocalePrefix, switchLocalePath, type Locale } from "./i18n.ts"

const localizedRoutePairs = [
  { tr: "/blog/ozel-yazilim-gelistirme-rehberi", en: "/blog/custom-software-development-guide" },
  { tr: "/blog/kurumsal-web-sitesi-maliyeti", en: "/blog/corporate-website-cost-and-scope" },
  { tr: "/blog/nextjs-seo-performans-rehberi", en: "/blog/nextjs-seo-performance-guide" },
  { tr: "/blog/web-sitesi-ve-web-uygulamasi-farki", en: "/blog/website-vs-web-application" },
  { tr: "/istanbul-yazilim-sirketi", en: "/istanbul-software-company" },
  { tr: "/projects/z-grup-insaat", en: "/projects/z-group-construction" },
  { tr: "/projects/salihogullari-hafriyat", en: "/projects/salihogullari-excavation" },
] as const

export function getLocalizedRouteAlternate(pathname: string, targetLocale: Locale) {
  const cleanPath = stripLocalePrefix(pathname)
  const pair = localizedRoutePairs.find((item) => item.tr === cleanPath || item.en === cleanPath)

  if (!pair) return switchLocalePath(pathname, targetLocale)
  return targetLocale === "tr" ? pair.tr : `/en${pair.en}`
}

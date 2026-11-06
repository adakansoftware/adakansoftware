import type { Locale } from "@/lib/i18n"
import { privacyStorageCopy } from "@/lib/privacy-content"

/**
 * Cloudflare Web Analytics beacon token. Set CF_ANALYTICS_TOKEN (e.g. in the
 * Cloudflare dashboard worker variables) to enable the cookieless beacon and
 * the matching privacy notice. Empty or unset keeps the site fully tracking-free.
 */
export const cloudflareAnalyticsToken = (process.env.CF_ANALYTICS_TOKEN ?? "").trim()

export function isWebAnalyticsEnabled() {
  return cloudflareAnalyticsToken !== ""
}

const analyticsNotice: Record<Locale, string> = {
  tr: "Sitede reklam veya davranışsal profil oluşturma kullanılmaz. Sayfa görüntüleme istatistikleri, çerez kullanmadan ve kişisel profil oluşturmadan yalnızca toplu biçimde ölçen Cloudflare Web Analytics aracılığıyla toplanır. Açık/koyu tema tercihiniz cihazınızdaki yerel depolamada tutulur; bu tercih sizi tanımlamak için kullanılmaz.",
  en: "The site does not use advertising or behavioral profiling. Page-view statistics are collected in aggregate only, via Cloudflare Web Analytics, which does not use cookies for tracking or build personal profiles. Your light or dark theme preference is stored in your device's local storage and is not used to identify you.",
}

/**
 * Paragraphs for privacy section 11 ("Cookies and local storage").
 * Must stay consistent with whether the beacon actually renders.
 */
export function privacyStorageParagraphs(locale: Locale): readonly string[] {
  if (isWebAnalyticsEnabled()) return [analyticsNotice[locale]]
  return [privacyStorageCopy[locale]]
}

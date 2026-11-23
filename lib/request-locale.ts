import { headers } from "next/headers"

import { defaultLocale, isLocale, localeHeaderName, type Locale } from "@/lib/i18n"

export async function getRequestLocale(params?: Promise<{ locale?: string }>): Promise<Locale> {
  if (process.env.NEXT_STATIC_EXPORT === "1") {
    const locale = (await params)?.locale
    return locale && isLocale(locale) ? locale : defaultLocale
  }
  const requestHeaders = await headers()
  const requestLocale = requestHeaders.get(localeHeaderName)

  return requestLocale && isLocale(requestLocale) ? requestLocale : defaultLocale
}

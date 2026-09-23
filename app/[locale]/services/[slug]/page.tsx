import { notFound } from "next/navigation"

import { ServiceSeoPage } from "@/components/service-seo-page"
import { createPageMetadata } from "@/lib/metadata"
import { getPrefixedRouteLocale } from "@/lib/route-locale"
import { getServicePage, isServicePageSlug, servicePageSlugs } from "@/lib/service-pages"

export const dynamicParams = false

export function generateStaticParams() {
  return servicePageSlugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolved = await params
  const locale = await getPrefixedRouteLocale(resolved)
  const page = getServicePage(resolved.slug, locale)
  if (!page) return {}
  return createPageMetadata({ locale, path: page.path, title: page.seo.title, description: page.seo.description, keywords: page.keywords })
}

export default async function LocalizedServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolved = await params
  const locale = await getPrefixedRouteLocale(resolved)
  if (!isServicePageSlug(resolved.slug)) notFound()
  return <ServiceSeoPage slug={resolved.slug} locale={locale} />
}

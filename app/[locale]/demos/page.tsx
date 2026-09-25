import { DemosPageContent } from "@/components/demos-page"
import { createRouteMetadata } from "@/lib/metadata"
import { getPrefixedLocaleStaticParams, getPrefixedRouteLocale } from "@/lib/route-locale"

export function generateStaticParams() {
  return getPrefixedLocaleStaticParams()
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getPrefixedRouteLocale(params)
  return createRouteMetadata("demos", locale, "/demos")
}

export default async function DemosRoute({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getPrefixedRouteLocale(params)
  return <DemosPageContent locale={locale} />
}

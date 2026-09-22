import { StudioHome } from "@/components/studio-home"
import { PageJsonLd } from "@/components/page-json-ld"
import { createRouteMetadata } from "@/lib/metadata"
import { getPrefixedLocaleStaticParams, getPrefixedRouteLocale } from "@/lib/route-locale"

export const revalidate = 60

export function generateStaticParams() {
  return getPrefixedLocaleStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return createRouteMetadata("home", locale, "/")
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)

  return (
    <>
      <PageJsonLd locale={locale} path="/" />
      <StudioHome locale={locale} />
    </>
  )
}

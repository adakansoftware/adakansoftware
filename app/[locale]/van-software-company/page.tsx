import { LocalSoftwarePage } from "@/components/local-software-page"
import { getLocalSoftwarePage } from "@/lib/local-service-page"
import { createPageMetadata } from "@/lib/metadata"
import { getPrefixedLocaleStaticParams, getPrefixedRouteLocale } from "@/lib/route-locale"

export function generateStaticParams() { return getPrefixedLocaleStaticParams() }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const locale = await getPrefixedRouteLocale(params); const page = getLocalSoftwarePage(locale, "van"); return createPageMetadata({ locale, path: "/van-yazilim-firmasi", localizedPaths: { tr: "/van-yazilim-firmasi", en: "/van-software-company" }, title: page.seo.title, description: page.seo.description, keywords: page.seo.keywords }) }
export default async function VanSoftwareCompanyLocalizedPage({ params }: { params: Promise<{ locale: string }> }) { const locale = await getPrefixedRouteLocale(params); return <LocalSoftwarePage city="van" locale={locale} /> }

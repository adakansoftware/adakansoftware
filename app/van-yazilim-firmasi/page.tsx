import { LocalSoftwarePage } from "@/components/local-software-page"
import { getLocalSoftwarePage } from "@/lib/local-service-page"
import { createPageMetadata } from "@/lib/metadata"

const page = getLocalSoftwarePage("tr", "van")
export const metadata = createPageMetadata({ locale: "tr", path: page.path, localizedPaths: { tr: page.path, en: "/van-software-company" }, title: page.seo.title, description: page.seo.description, keywords: page.seo.keywords })
export default function VanSoftwareCompanyPage() { return <LocalSoftwarePage city="van" locale="tr" /> }

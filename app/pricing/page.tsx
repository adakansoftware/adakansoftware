import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import { PricingSection } from "@/components/pricing-section"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("pricing", "tr", "/pricing")

export default function PricingPage() {
  return <><PageJsonLd locale="tr" path="/pricing" /><PageHeader locale="tr" title="Net kapsam," gradientText="net yatırım" description="Logo tasarımı, tek seferlik web sitesi projeleri ve yazılım ürünlerinin kurulum + aylık bakım kapsamlarını ayrı inceleyin." /><PricingSection locale="tr" /></>
}

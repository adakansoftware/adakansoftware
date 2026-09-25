import { DemosPageContent } from "@/components/demos-page"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("demos", "tr", "/demos")

export default function DemosPage() {
  return <DemosPageContent locale="tr" />
}

import { PrivacyPage } from "@/components/privacy-page"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("privacy", "tr", "/privacy")

export default function PrivacyRoute() {
  return <PrivacyPage locale="tr" />
}

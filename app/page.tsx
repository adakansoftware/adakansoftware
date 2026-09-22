import { StudioHome } from "@/components/studio-home"
import { PageJsonLd } from "@/components/page-json-ld"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("home", "tr", "/")
export const revalidate = 60

export default async function HomePage() {
  return (
    <>
      <PageJsonLd locale="tr" path="/" />
      <StudioHome locale="tr" />
    </>
  )
}

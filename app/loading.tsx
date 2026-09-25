import { getRequestLocale } from "@/lib/request-locale"
import { boundaryContent } from "@/lib/shell-content"
import { PageLoading } from "@/components/page-loading"

export default async function Loading() {
  const locale = await getRequestLocale()

  return <PageLoading label={boundaryContent.loading[locale]} />
}

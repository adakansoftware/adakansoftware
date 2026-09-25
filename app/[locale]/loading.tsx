import { PageLoading } from "@/components/page-loading"

export default function LocaleLoading() {
  const loadingText = "Yükleniyor · Loading"

  return <PageLoading label={loadingText} />
}

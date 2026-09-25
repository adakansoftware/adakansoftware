import { headers } from "next/headers"

import { cspNonceHeaderName } from "@/lib/server/content-security-policy"

export async function NonceScript({
  type,
  content,
}: {
  type?: string
  content: string
}) {
  const nonce = (await headers()).get(cspNonceHeaderName) ?? undefined

  return <script nonce={nonce} type={type} dangerouslySetInnerHTML={{ __html: content }} />
}

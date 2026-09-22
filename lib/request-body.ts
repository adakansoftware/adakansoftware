export function hasJsonContentType(request: Request) {
  return request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() === "application/json"
}

export async function readBoundedJsonObject(request: Request, maxBytes: number) {
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined

  try {
    reader = request.body?.getReader()
    if (!reader) return { ok: false as const, status: 400 as const }

    const decoder = new TextDecoder("utf-8", { fatal: true })
    let totalBytes = 0
    let rawBody = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        // Do not wait for an upstream producer to finish cancelling.
        void reader.cancel().catch(() => {})
        return { ok: false as const, status: 413 as const }
      }
      rawBody += decoder.decode(value, { stream: true })
    }
    rawBody += decoder.decode()

    const body: unknown = JSON.parse(rawBody)
    return body && typeof body === "object" && !Array.isArray(body)
      ? { ok: true as const, body: body as Record<string, unknown> }
      : { ok: false as const, status: 400 as const }
  } catch {
    if (reader) void reader.cancel().catch(() => {})
    return { ok: false as const, status: 400 as const }
  } finally {
    reader?.releaseLock()
  }
}

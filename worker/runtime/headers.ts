import { AsyncLocalStorage } from "node:async_hooks"

const requests = new AsyncLocalStorage<Request>()

export function withRequestContext<T>(request: Request, callback: () => T): T {
  return requests.run(request, callback)
}

function currentRequest() {
  const request = requests.getStore()
  if (!request) throw new Error("No active request context")
  return request
}

export async function headers() {
  return new Headers(currentRequest().headers)
}

export async function cookies() {
  const values = new Map<string, { name: string; value: string }>()
  for (const part of (currentRequest().headers.get("cookie") ?? "").split(";")) {
    const separator = part.indexOf("=")
    if (separator < 0) continue
    const name = part.slice(0, separator).trim()
    try {
      values.set(name, { name, value: decodeURIComponent(part.slice(separator + 1).trim()) })
    } catch {
      // Match Next's cookie parser: ignore malformed percent-encoded values.
    }
  }
  return {
    get: (name: string) => values.get(name),
    getAll: (name?: string) => [...values.values()].filter(cookie => !name || cookie.name === name),
    has: (name: string) => values.has(name),
  }
}

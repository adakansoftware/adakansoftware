import { withRequestContext } from "./headers"
import { createRequestId } from "../../lib/server/request-id"

type Handler = (request: Request) => Response | Promise<Response>
export type Route = Partial<Record<"GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS", Handler>>
const methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"] as const

export async function dispatchRoute(request: Request, route: Route): Promise<Response> {
  const allowed = methods.filter(method => route[method] || method === "OPTIONS" || (method === "HEAD" && route.GET)).join(", ")
  const method = request.method
  const handler = methods.includes(method as typeof methods[number]) ? route[method as keyof Route] ?? (method === "HEAD" ? route.GET : undefined) : undefined
  let response: Response
  try {
    if (handler) response = await withRequestContext(request, () => handler(request))
    else if (method === "OPTIONS") response = new Response(null, { status: 204, headers: { Allow: allowed, "Cache-Control": "no-store" } })
    else response = Response.json({ ok: false, error: "Method not allowed" }, { status: 405, headers: { Allow: allowed, "Cache-Control": "no-store" } })
  } catch {
    // Never serialize exception details or configuration into responses/logs.
    response = Response.json({ ok: false, error: "Internal server error" }, { status: 500, headers: { "Cache-Control": "no-store", "X-Request-Id": createRequestId(request) } })
  }
  if (method === "HEAD") {
    await response.body?.cancel()
    return new Response(null, { status: response.status, statusText: response.statusText, headers: response.headers })
  }
  return response
}

import * as contact from "../app/api/contact/route"
import * as contactState from "../app/api/contact/state/route"
import * as replay from "../app/api/contact/replay/route"
import * as replayCron from "../app/api/contact/replay/cron/route"
import * as health from "../app/api/health/route"
import * as login from "../app/api/admin/login/route"
import * as logout from "../app/api/admin/logout/route"
import * as session from "../app/api/admin/session/route"
import * as content from "../app/api/admin/content/route"
import * as contactRequests from "../app/api/admin/contact-requests/route"
import * as publicContent from "../app/api/public-content/route"
import { dispatchRoute, type Route } from "./runtime/dispatch"

const routes = new Map<string, Route>([
  ["/api/public-content", publicContent],
  ["/api/contact", contact],
  ["/api/contact/state", contactState],
  ["/api/contact/replay", replay],
  ["/api/contact/replay/cron", replayCron],
  ["/api/health", health],
  ["/api/admin/login", login],
  ["/api/admin/logout", logout],
  ["/api/admin/session", session],
  ["/api/admin/content", content],
  ["/api/admin/contact-requests", contactRequests],
])

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const pathname = new URL(request.url).pathname
  if (pathname !== "/api" && !pathname.startsWith("/api/")) return null
  const route = routes.get(pathname)
  if (route) return dispatchRoute(request, route)
  return new Response(request.method === "HEAD" ? null : JSON.stringify({ ok: false, error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  })
}

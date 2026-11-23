import { isSensitiveDotPath } from '../lib/server/sensitive-path'
import { getTrustedClientIp } from '../lib/server/client-ip'
import { isProxyRateLimited } from '../lib/server/proxy-rate-limit'

type Manifest = { files: string[]; pages: Record<string, { file: string; csp: string }> }
type Environment = { ASSETS: { fetch(request: Request): Promise<Response> }; PREVIEW_MODE?: string }
type ApiHandler = (request: Request) => Promise<Response | null>
const origin = 'https://adakansoftware.com'
const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Resource-Policy': 'same-origin',
  'X-DNS-Prefetch-Control': 'off', 'X-Permitted-Cross-Domain-Policies': 'none',
  'Origin-Agent-Cluster': '?1', 'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}
function secure(response: Response, head: boolean, csp?: string, privateResponse = false) {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value)
  headers.set('Content-Security-Policy', csp ?? "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'")
  if (privateResponse) headers.set('Cache-Control', 'no-store')
  // Hash/SRI protected HTML must reach the browser byte-for-byte, including
  // authenticated pages. Prevent edge analytics/minification script injection.
  if (csp && !headers.get('Cache-Control')?.includes('no-transform')) headers.set('Cache-Control', `${headers.get('Cache-Control') ?? 'no-store'}, no-transform`)
  if (head) void response.body?.cancel()
  return new Response(head ? null : response.body, { status: response.status, statusText: response.statusText, headers })
}
function redirect(path: string, status = 307) {
  return new Response(null, { status, headers: { Location: path, 'Cache-Control': 'no-store' } })
}

export function createAssetHandler(manifest: Manifest, api: ApiHandler) {
  const files = new Set(manifest.files)
  return async (request: Request, environment: Environment): Promise<Response> => {
    const url = new URL(request.url)
    const head = request.method === 'HEAD'
    // Custom domains and HTTP variants have a single canonical origin. Local preview remains local.
    if (url.hostname === 'www.adakansoftware.com' || (url.hostname.endsWith('.workers.dev') && environment.PREVIEW_MODE !== '1') ||
      (url.hostname === 'adakansoftware.com' && url.protocol === 'http:')) {
      return secure(redirect(origin + url.pathname + url.search, 308), head)
    }
    let path: string
    try { path = decodeURIComponent(url.pathname) } catch { return secure(new Response(null, { status: 404 }), head) }
    // Resolve once; never let the asset service reinterpret encoded separators/dot segments.
    if (/%[0-9a-f]{2}/i.test(path) || path.includes('\\') || path.includes('\0') || path.split('/').includes('..') || isSensitiveDotPath(path)) {
      return secure(new Response(null, { status: 404 }), head)
    }
    if (path === '/tr' || path.startsWith('/tr/')) return secure(redirect((path.slice(3) || '/') + url.search), head)
    if (path.length > 1 && path.endsWith('/')) return secure(redirect(path.slice(0, -1) + url.search, 308), head)
    if (path === '/api' || path.startsWith('/api/')) {
      if (isProxyRateLimited(`${getTrustedClientIp(request.headers)}:${path}`, Date.now())) {
        return secure(Response.json({ ok: false, error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '10' } }), head, undefined, true)
      }
      const normalized = new URL(request.url); normalized.pathname = path
      const response = await api(new Request(normalized, request))
      return secure(response ?? new Response(null, { status: 404 }), head, undefined, true)
    }
    if (request.method !== 'GET' && !head) return secure(new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } }), head)
    const admin = /^\/admin(?:$|\.(?:html|txt|segments)(?:\/|$)|\/)/.test(path) && !/^\/admin\/login(?:$|\/|\.(?:html|txt|segments)(?:\/|$))/.test(path)
    if (admin) {
      const session = await api(new Request(new URL('/api/admin/session', url), { headers: request.headers }))
      if (!session || session.status !== 200) {
        const status = session?.status
        await session?.body?.cancel()
        return secure(status === 401 ? redirect('/admin/login') : new Response(null, { status: 503 }), head, undefined, true)
      }
      await session.body?.cancel()
    }
    let pagePath = path.endsWith('.html') ? path.slice(0, -5) : path
    if (pagePath === '/index') pagePath = '/'
    const page = Object.hasOwn(manifest.pages, pagePath) ? manifest.pages[pagePath] : undefined
    let file = page?.file ?? path
    if (request.headers.get('RSC') === '1' && page) file = page.file.replace(/\.html$/, '.txt')
    if (path === '/og') {
      const key = url.searchParams.get('page') ?? 'home'
      const known = ['services', 'projects', 'contact', 'logo', 'about', 'home'].includes(key) ? key : 'home'
      file = `/og-static/${known}-${url.searchParams.get('locale') === 'en' ? 'en' : 'tr'}.png`
    }
    let status = 200; let csp = page?.csp
    if (!files.has(file)) { file = '/404.html'; status = 404; csp = manifest.pages['/404']?.csp }
    const assetUrl = new URL(file, url.origin)
    const asset = await environment.ASSETS.fetch(new Request(assetUrl, { method: 'GET' }))
    if (asset.status !== 200) return secure(new Response(null, { status: 503 }), head, undefined, true)
    const headers = new Headers(asset.headers)
    headers.delete('set-cookie')
    headers.set('Cache-Control', admin ? 'no-store, no-transform' : file.startsWith('/_next/static/') ? 'public, max-age=31536000, immutable, no-transform' : 'public, max-age=0, must-revalidate, no-transform')
    if (file.endsWith('.txt') || file.endsWith('.rsc')) headers.set('Content-Type', file === '/robots.txt' || file === '/llms.txt' || file.startsWith('/.well-known/') ? 'text/plain; charset=utf-8' : 'text/x-component')
    headers.set('Vary', 'RSC')
    return secure(new Response(asset.body, { status, headers }), head, csp, admin)
  }
}

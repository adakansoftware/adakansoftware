/* global process, console, fetch, URL */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
const origin = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:8791'
const sitemapResponse = await fetch(origin + '/sitemap.xml')
assert.equal(sitemapResponse.status, 200)
const sitemap = await sitemapResponse.text()
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]))
assert.equal(urls.length, 60)
for (const url of urls) {
  const response = await fetch(origin + url.pathname)
  assert.equal(response.status, 200, url.pathname)
  const html = await response.text(); const csp = response.headers.get('content-security-policy') ?? ''
  assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, url.pathname)
  assert.ok(html.includes('</html>'), url.pathname)
  assert.ok(html.includes(`lang="${url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'tr'}"`), url.pathname)
  assert.ok(html.includes('rel="canonical"'), url.pathname)
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const hash = script[1].includes('src=') ? script[1].match(/integrity="([^"]+)"/)?.[1] : 'sha256-' + createHash('sha256').update(script[2]).digest('base64')
    assert.ok(hash && csp.includes(`'${hash}'`), `${url.pathname} CSP script`)
  }
  assert.ok(!/script-src[^;]*(unsafe-inline|unsafe-eval|nonce-)/.test(csp))
}
for (const path of ['/admin', '/admin.html', '/admin.txt', '/%61dmin.html']) assert.equal((await fetch(origin + path, { redirect: 'manual' })).status, 307, path)
for (const path of ['/.env', '/.git/config', '/%252eenv', '/does-not-exist']) assert.equal((await fetch(origin + path)).status, 404, path)
for (const path of ['/api/admin/content', '/api/admin/contact-requests', '/api/admin/session', '/api/contact/state', '/api/contact/replay/cron']) {
  const response = await fetch(origin + path); assert.equal(response.status, 401, path); assert.equal(response.headers.get('cache-control'), 'no-store')
}
const invalid = await fetch(origin + '/api/contact', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{}' })
assert.equal(invalid.status, 400, 'invalid contact payload')
const denied = await fetch(origin + '/api/admin/login', { method: 'POST', headers: { Origin: 'https://untrusted.invalid', 'Content-Type': 'application/json' }, body: '{}' })
assert.equal(denied.status, 403, 'cross-origin admin login')
const health = await (await fetch(origin + '/api/health')).json()
assert.deepEqual(Object.keys(health).sort(), ['ok', 'status'])
console.log(`Static Worker HTTP checks passed: ${urls.length} pages, CSP, admin boundaries, contact validation and health`)

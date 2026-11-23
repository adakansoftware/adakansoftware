/* global Request, Response, URL */
import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
import { createRequire } from 'node:module'
const bundled = await build({ entryPoints: ['worker/router.ts'], bundle: true, write: false, platform: 'node', format: 'cjs' })
const testModule = { exports: {} }
new Function('require', 'module', 'exports', bundled.outputFiles[0].text)(createRequire(import.meta.url), testModule, testModule.exports)
const { createAssetHandler } = testModule.exports
const manifest = { files: ['/index.html', '/index.txt', '/admin.html', '/admin.txt', '/admin.segments/_tree.segment.rsc', '/admin/login/__next._full.txt', '/404.html', '/x.css'], pages: { '/': { file: '/index.html', csp: "script-src 'sha256-test'" }, '/admin': { file: '/admin.html', csp: "script-src 'sha256-admin'" }, '/404': { file: '/404.html', csp: "default-src 'none'" } } }
const environment = { ASSETS: { fetch: async request => new Response(new URL(request.url).pathname, { headers: { 'Content-Type': 'text/html' } }) } }

test('redirect normalization rejects external-authority and control-character paths', async () => {
  const handle = createAssetHandler(manifest, async () => null)
  for (const path of ['/tr//example.org', '/tr/%2fexample.org', '//example.org/', '/%2fexample.org/', '/tr/%09/example.org', '/tr/%0a/example.org']) {
    const response = await handle(new Request('https://adakansoftware.com' + path), environment)
    assert.equal(response.status, 404, path)
    assert.equal(response.headers.get('location'), null, path)
  }
  const normal = await handle(new Request('https://adakansoftware.com/tr/hizmetler?source=test'), environment)
  assert.equal(normal.headers.get('location'), '/hizmetler?source=test')
})
test('admin HTML, navigation and encoded aliases require active session', async () => {
  let assetReads = 0
  const env = { ASSETS: { fetch: async () => { assetReads++; return new Response('private') } } }
  const handle = createAssetHandler(manifest, async () => new Response(null, { status: 401 }))
  for (const path of ['/admin', '/admin.html', '/admin.txt', '/%61dmin.html', '/admin.segments/_tree.segment.rsc']) {
    const response = await handle(new Request('https://adakansoftware.com'+path), env)
    assert.equal(response.status, 307, path)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
  assert.equal(assetReads, 0)
})
test('static pages and RSC use exact assets, unknown routes stay 404', async () => {
  const handle = createAssetHandler(manifest, async () => null)
  const html = await handle(new Request('https://adakansoftware.com/'), environment)
  assert.equal(await html.text(), '/index.html')
  assert.match(html.headers.get('content-security-policy'), /sha256-test/)
  assert.match(html.headers.get('cache-control'), /no-transform/)
  const rsc = await handle(new Request('https://adakansoftware.com/', { headers: { RSC: '1' } }), environment)
  assert.equal(await rsc.text(), '/index.txt')
  for (const path of ['/does-not-exist', '/.env', '/%252eenv', '/%252fadmin.html']) assert.equal((await handle(new Request('https://adakansoftware.com'+path), environment)).status, 404, path)
})
test('login navigation payload stays accessible before authentication', async () => {
  const handle = createAssetHandler(manifest, async () => new Response(null, { status: 401 }))
  const response = await handle(new Request('https://adakansoftware.com/admin/login/__next._full.txt'), environment)
  assert.equal(response.status, 200)
  assert.equal(await response.text(), '/admin/login/__next._full.txt')
})
test('authorized admin and HEAD responses stay private and bodyless', async () => {
  const handle = createAssetHandler(manifest, async () => new Response('{}', { status: 200 }))
  const response = await handle(new Request('https://adakansoftware.com/admin', { method: 'HEAD' }), environment)
  assert.equal(response.status, 200)
  assert.equal(await response.text(), '')
  assert.equal(response.headers.get('cache-control'), 'no-store, no-transform')
})

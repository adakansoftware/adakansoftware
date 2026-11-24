/* global process */
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import test from 'node:test'

test('live verification fails on unavailable or malformed public database content', async () => {
  let contentStatus = 503
  let content = { ok: false }
  const server = createServer((request, response) => {
    if (request.url === '/api/health') return response.end(JSON.stringify({ ok: true, status: 'ok' }))
    if (request.url === '/api/public-content') {
      response.writeHead(contentStatus, { 'Content-Type': 'application/json' })
      return response.end(JSON.stringify(content))
    }
    if (request.url === '/sitemap.xml') return response.end(`<urlset><url><loc>http://127.0.0.1:${server.address().port}/</loc></url></urlset>`)
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end('<html></html>')
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const run = () => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['scripts/verify-live-site.mjs'], {
      env: { ...process.env, LIVE_SITE_ORIGIN: `http://127.0.0.1:${server.address().port}`, LIVE_VERIFY_ATTEMPTS: '1', LIVE_VERIFY_RETRY_DELAY_MS: '0' },
      stdio: 'ignore',
    })
    child.on('error', reject)
    child.on('exit', code => resolve(code))
  })
  try {
    assert.notEqual(await run(), 0, 'DB error must fail monitoring even when static pages are healthy')
    contentStatus = 200
    assert.notEqual(await run(), 0, 'invalid snapshot must fail monitoring')
    content = { projects: { tr: [], en: [] }, logos: { tr: [], en: [] } }
    assert.equal(await run(), 0, 'valid empty collections remain supported')
  } finally {
    await new Promise(resolve => server.close(resolve))
  }
})

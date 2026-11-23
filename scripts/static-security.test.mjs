/* global Buffer */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import test from 'node:test'
import { secureDocument } from './static-security.mjs'

test('static documents trust exact inline and external scripts without reusable nonces', async () => {
  const code = 'window.ready=true'; const external = 'export {}'
  const result = await secureDocument(`<html><head><link rel="preload" as="script" href="/_next/app.js"/><script>${code}</script><script src="/_next/app.js"></script><style>body{margin:0}</style></head></html>`, async path => {
    assert.equal(path, '/_next/app.js'); return Buffer.from(external)
  })
  for (const source of [code, external]) {
    assert.ok(result.csp.includes(`'sha256-${createHash('sha256').update(source).digest('base64')}'`))
  }
  assert.match(result.html, /integrity="sha256-/)
  assert.equal([...result.html.matchAll(/integrity="sha256-/g)].length, 2)
  assert.match(result.csp, /script-src [^;]*'strict-dynamic'/)
  assert.doesNotMatch(result.csp.split(';').find(s => s.trim().startsWith('script-src ')), /unsafe-inline|unsafe-eval|nonce-/)
})

test('refuses unpinned external scripts, reusable nonces and malformed asset paths', async () => {
  for (const html of ['<script src="https://evil.example/app.js"></script>', '<script nonce="reused">x()</script>', '<script src="/../secret.js"></script>']) {
    await assert.rejects(secureDocument(html, async () => Buffer.from('')))
  }
})

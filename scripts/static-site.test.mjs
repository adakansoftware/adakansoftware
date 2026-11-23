/* global URL */
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const assets = new URL('../.free-worker/assets/', import.meta.url)
test('static HTML retains Turkish and English language, metadata, and JSON-LD', async () => {
  for (const [path, locale] of [['index.html', 'tr'], ['en.html', 'en'], ['en/services.html', 'en']]) {
    const html = await readFile(new URL(path, assets), 'utf8')
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`))
    assert.match(html, /rel="canonical"/)
    assert.match(html, /hrefLang="en"/i)
    assert.match(html, /application\/ld\+json/)
    assert.doesNotMatch(html, /nonce="[^"]+"/)
  }
})
test('static admin shell never publishes server configured identity', async () => {
  const html = await readFile(new URL('admin.html', assets), 'utf8')
  assert.doesNotMatch(html, /static-export-secret-identity@example\.invalid/)
  assert.match(html, /Yönetici/)
})

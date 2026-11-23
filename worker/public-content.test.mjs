/* global process, setTimeout */
import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

async function endpoint(query) {
  const bundle = await build({
    entryPoints: ['app/api/public-content/route.ts'], bundle: true, write: false, platform: 'node', format: 'cjs',
    alias: { '@': process.cwd(), 'next/cache': resolve('worker/runtime/cache.ts') },
    plugins: [{ name: 'mock-database', setup(builder) {
      builder.onLoad({ filter: /lib[\\/]neon\.ts$/ }, () => ({ contents: 'export function getNeonSql() { return { query: globalThis.__snapshotQuery } }', loader: 'ts' }))
    } }],
  })
  const testModule = { exports: {} }
  new Function('require', 'module', 'exports', 'globalThis', bundle.outputFiles[0].text)(createRequire(import.meta.url), testModule, testModule.exports, { __snapshotQuery: query })
  return testModule.exports.GET
}

test('any failed snapshot query stays failed when another query succeeds', async () => {
  const previous = process.env.DATABASE_URL
  process.env.DATABASE_URL = 'test-only'
  try {
    let calls = 0
    const GET = await endpoint(async () => {
      if (++calls === 1) throw new Error('simulated database failure')
      await new Promise(resolve => setTimeout(resolve, 5))
      return []
    })
    const response = await GET()
    assert.equal(response.status, 503)
    assert.deepEqual(await response.json(), { ok: false })
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL
    else process.env.DATABASE_URL = previous
  }
})

test('unconfigured database and empty published collections preserve built-in public content', async () => {
  const previous = process.env.DATABASE_URL
  try {
    let calls = 0
    const GET = await endpoint(async () => { calls++; return [] })
    delete process.env.DATABASE_URL
    const unconfigured = await GET()
    assert.equal(unconfigured.status, 200)
    assert.equal(calls, 0)
    const fallback = await unconfigured.json()
    assert.ok(fallback.projects.tr.length > 0)
    assert.ok(fallback.logos.en.length > 0)
    process.env.DATABASE_URL = 'test-only'
    const empty = await GET()
    assert.equal(empty.status, 200)
    assert.equal(calls, 2)
    assert.deepEqual(await empty.json(), fallback)
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL
    else process.env.DATABASE_URL = previous
  }
})

test('concurrent successful snapshot cannot hide another snapshot failure', async () => {
  const previous = process.env.DATABASE_URL
  process.env.DATABASE_URL = 'test-only'
  try {
    let calls = 0
    const GET = await endpoint(async () => {
      const call = ++calls
      await new Promise(resolve => setTimeout(resolve, call === 1 ? 1 : 5))
      if (call === 1) throw new Error('simulated database failure')
      return []
    })
    const responses = await Promise.all([GET(), GET()])
    assert.deepEqual(responses.map(response => response.status), [503, 200])
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL
    else process.env.DATABASE_URL = previous
  }
})

test('snapshot queries once per kind and exposes only public fields in both locales', async () => {
  const previous = process.env.DATABASE_URL
  process.env.DATABASE_URL = 'test-only'
  try {
    const queries = []
    const row = { id: 'private-id', title_tr: 'Türkçe', title_en: 'English', category_tr: 'Kategori', category_en: 'Category', description_tr: 'Açıklama', description_en: 'Description', year: '2026', href: '/project', color: 'blue', cover_image: '/cover.png', initials: 'AB', logo_image: '/logo.png', secret: 'private-secret' }
    const GET = await endpoint(async sql => { queries.push(sql); return [row] })
    const response = await GET()
    const value = await response.json()
    assert.equal(response.status, 200)
    assert.equal(queries.length, 2)
    for (const sql of queries) assert.match(sql, /published = true and archived = false/)
    assert.equal(value.projects.tr[0].title, 'Türkçe')
    assert.equal(value.projects.en[0].title, 'English')
    assert.deepEqual(Object.keys(value.projects.tr[0]).sort(), ['title', 'category', 'description', 'year', 'href', 'color', 'coverImage'].sort())
    assert.deepEqual(Object.keys(value.logos.en[0]).sort(), ['title', 'category', 'description', 'initials', 'color', 'logoImage'].sort())
    assert.doesNotMatch(JSON.stringify(value), /private-id|private-secret/)
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL
    else process.env.DATABASE_URL = previous
  }
})

/* global process, fetch, AbortSignal */
import { build } from 'esbuild'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

export function validatePublicSnapshot(value) {
  if (!value || typeof value !== 'object') throw new Error('Missing public content snapshot')
  const snapshot = { projects: {}, logos: {} }
  const fields = {
    projects: ['title', 'category', 'description', 'year', 'href', 'color', 'coverImage', 'liveUrl'],
    logos: ['title', 'category', 'description', 'initials', 'color', 'logoImage'],
  }
  for (const kind of ['projects', 'logos']) for (const locale of ['tr', 'en']) {
    const rows = value[kind]?.[locale]
    if (!Array.isArray(rows) || rows.length > 1000) throw new Error('Invalid public content collection')
    snapshot[kind][locale] = rows.map(row => {
      const result = {}
      for (const field of fields[kind]) {
        if (row[field] === undefined && ['coverImage', 'liveUrl', 'logoImage'].includes(field)) continue
        if (typeof row[field] !== 'string' || row[field].length > 20000) throw new Error('Invalid public content field')
        result[field] = row[field]
      }
      return result
    })
  }
  return snapshot
}

export async function getBuildContentSnapshot(root, fixtures) {
  if (!fixtures && !process.env.DATABASE_URL) {
    const response = await fetch('https://adakansoftware.com/api/public-content', { signal: AbortSignal.timeout(30000) })
    if (!response.ok) throw new Error(`Public content snapshot unavailable (${response.status}); refusing to publish fallback content`)
    return validatePublicSnapshot(await response.json())
  }
  const source = fixtures ? { stdin: { contents: `import {getProjects,getLogoWorks} from './lib/site-data.ts'; export function GET(){return Response.json({projects:{tr:getProjects('tr'),en:getProjects('en')},logos:{tr:getLogoWorks('tr'),en:getLogoWorks('en')}})}`, resolveDir: root, loader: 'ts' } } : { entryPoints: [resolve(root, 'app/api/public-content/route.ts')] }
  const bundle = await build({ ...source, bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
    alias: { '@': root, 'next/cache': resolve(root, 'worker/runtime/cache.ts') },
  })
  const compiled = { exports: {} }
  new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports)
  const response = await compiled.exports.GET()
  if (!response.ok) throw new Error('Cannot publish content after a database read failure')
  return validatePublicSnapshot(await response.json())
}

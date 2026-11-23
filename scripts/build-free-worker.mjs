/* global Buffer */
/* global console, process, URL */
import { build } from 'esbuild'
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname, relative, isAbsolute } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { secureDocument } from './static-security.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(root)
if (process.argv.includes('--local-env')) process.loadEnvFile(resolve(root, '.dev.vars'))
if (!process.argv.includes('--skip-static')) {
  const child = spawnSync(process.execPath, ['scripts/build-static-site.mjs', ...(process.argv.includes('--fixtures') ? ['--fixtures'] : [])], { stdio: 'inherit', env: process.env })
  if (child.status !== 0) process.exit(child.status ?? 1)
}
const output = resolve(root, '.free-worker')
const assets = resolve(output, 'assets')
await mkdir(resolve(assets, 'og-static'), { recursive: true })
await build({ entryPoints: ['app/og/route.tsx'], outfile: resolve(output, 'og-renderer.cjs'), bundle: true, format: 'cjs', platform: 'node', packages: 'external', jsx: 'automatic' })
const renderer = await import(pathToFileURL(resolve(output, 'og-renderer.cjs')).href)
for (const key of ['services', 'projects', 'contact', 'logo', 'about', 'home']) {
  for (const locale of ['tr', 'en']) {
    const response = await renderer.GET({ nextUrl: new URL(`https://adakansoftware.com/og?page=${key}&locale=${locale}`) })
    if (!response.ok) throw new Error('OG generation failed')
    await writeFile(resolve(assets, `og-static/${key}-${locale}.png`), Buffer.from(await response.arrayBuffer()))
  }
}
async function walk(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(path))
    else if (entry.isFile()) files.push('/' + relative(assets, path).replaceAll('\\', '/'))
    else throw new Error('Exported assets must not contain symlinks')
  }
  return files
}
const files = await walk(assets)
const pages = {}
for (const file of files.filter(file => file.endsWith('.html'))) {
  const path = resolve(assets, '.' + file)
  const document = await secureDocument(await readFile(path, 'utf8'), async assetPath => {
    const target = resolve(assets, '.' + decodeURIComponent(assetPath))
    const inside = relative(assets, target)
    if (inside.startsWith('..') || isAbsolute(inside)) throw new Error('Script asset escapes export directory')
    return readFile(target)
  }, { turnstile: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()) })
  await writeFile(path, document.html)
  const route = file === '/index.html' ? '/' : file.replace(/\.html$/, '')
  pages[route] = { file, csp: document.csp }
}
await writeFile(resolve(output, 'asset-manifest.json'), JSON.stringify({ files, pages }))
await build({
  entryPoints: ['worker/entry.mjs'], outfile: resolve(output, 'worker.js'), bundle: true, format: 'esm', platform: 'node', target: 'es2022',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire('/worker.js');" }, minify: true,
  conditions: ['workerd', 'worker', 'browser'], mainFields: ['module', 'main'], external: ['node:*'],
  alias: { '@': root, 'next/headers': resolve('worker/runtime/headers.ts'), 'next/server': resolve('worker/runtime/server.ts'), 'next/cache': resolve('worker/runtime/cache.ts') },
  define: { 'process.env.NODE_ENV': '"production"' }, metafile: true,
}).then(async result => {
  if (Object.keys(result.metafile.inputs).some(path => /next[/\\]dist[/\\]server[/\\]/.test(path))) throw new Error('Next rendering server leaked into lightweight Worker')
  await writeFile(resolve(output, 'bundle-meta.json'), JSON.stringify(result.metafile))
})
// Scan in the same process environment as the build, including known private values.
const scan = spawnSync(process.execPath, ['scripts/check-client-secrets.mjs', '--static'], { stdio: 'inherit', env: process.env })
if (scan.status !== 0) process.exit(scan.status ?? 1)
console.log(`Free Worker built: ${Object.keys(pages).length} HTML routes; ${files.length} static assets`)

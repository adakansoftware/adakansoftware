/* global process, console */
import { cp, mkdir, rm, symlink, writeFile, readFile, readdir, rename } from 'node:fs/promises'
import { dirname, resolve, relative, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { getBuildContentSnapshot } from './public-content-snapshot.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const staging = resolve(root, '.static-build')
const assets = resolve(root, '.free-worker/assets')
const snapshot = await getBuildContentSnapshot(root, process.argv.includes('--fixtures'))
async function clearOwnedDirectory(target) {
  const inside = relative(root, target)
  if (!inside || inside.startsWith('..') || isAbsolute(inside)) throw new Error('Refusing to delete outside build workspace')
  await rm(target, { recursive: true, force: true })
}
await clearOwnedDirectory(staging)
await mkdir(staging, { recursive: true })
for (const name of ['app', 'components', 'hooks', 'lib', 'public', 'styles', 'package.json', 'tsconfig.json', 'next-env.d.ts', 'postcss.config.mjs', 'tailwind.config.ts', 'next.config.mjs']) {
  try {
    await cp(resolve(root, name), resolve(staging, name), {
      recursive: true,
      filter: (source) => !['app/api', 'app/og'].includes(relative(root, source).replaceAll('\\', '/')),
    })
  } catch (error) {
    if (error.code !== 'ENOENT' || !['hooks', 'styles', 'next-env.d.ts'].includes(name)) throw error
  }
}
await symlink(resolve(root, 'node_modules'), resolve(staging, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir')
const contentTemplate = await readFile(resolve(staging, 'lib/build-content.ts'), 'utf8')
await writeFile(resolve(staging, 'lib/build-content.ts'), contentTemplate.replace('null // BUILD_CONTENT_VALUE', JSON.stringify(snapshot) + ' // BUILD_CONTENT_VALUE'))
// A root layout cannot read child segment params. Separate locale roots keep
// HTML language and server-rendered footer content correct without request headers.
const layout = await readFile(resolve(staging, 'app/layout.tsx'), 'utf8')
await writeFile(resolve(staging, 'components/static-root-layout.tsx'), layout.replace('"./globals.css"', '"../app/globals.css"'))
await rm(resolve(staging, 'app/layout.tsx'))
await mkdir(resolve(staging, 'app/(tr)'), { recursive: true })
for (const entry of await readdir(resolve(staging, 'app'), { withFileTypes: true })) {
  if (['(tr)', '[locale]'].includes(entry.name) || entry.name.endsWith('.css')) continue
  await rename(resolve(staging, 'app', entry.name), resolve(staging, 'app/(tr)', entry.name))
}
await writeFile(resolve(staging, 'app/(tr)/layout.tsx'), `import RootLayout from '@/components/static-root-layout'\nexport { metadata, viewport } from '@/components/static-root-layout'\nexport default function Layout({children}: {children: React.ReactNode}) { return <RootLayout params={Promise.resolve({locale:'tr'})}>{children}</RootLayout> }\n`)
await writeFile(resolve(staging, 'app/[locale]/layout.tsx'), `import RootLayout from '@/components/static-root-layout'\nimport { getPrefixedLocaleStaticParams, getPrefixedRouteLocale } from '@/lib/route-locale'\nexport { metadata, viewport } from '@/components/static-root-layout'\nexport function generateStaticParams() { return getPrefixedLocaleStaticParams() }\nexport default async function Layout({children,params}: {children: React.ReactNode; params: Promise<{locale:string}>}) { const locale=await getPrefixedRouteLocale(params); return <RootLayout params={Promise.resolve({locale})}>{children}</RootLayout> }\n`)
await writeFile(resolve(staging, 'next.config.mjs'), `import base from '../next.config.mjs'\nconst { headers, ...config } = base\nexport default { ...config, output: 'export', outputFileTracingRoot: ${JSON.stringify(root)}, turbopack: { root: ${JSON.stringify(root)} }, images: { ...base.images, unoptimized: true } }\n`)
const result = spawnSync(process.execPath, [resolve(root, 'node_modules/next/dist/bin/next'), 'build', '--webpack'], {
  cwd: staging,
  stdio: 'inherit',
  env: { ...process.env, NEXT_STATIC_EXPORT: '1' },
})
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
await clearOwnedDirectory(assets)
await cp(resolve(staging, 'out'), assets, { recursive: true })
console.log('Static site exported to .free-worker/assets')

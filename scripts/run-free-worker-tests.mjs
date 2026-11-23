/* global process, fetch, AbortSignal, setTimeout */
import { spawn, spawnSync } from 'node:child_process'
import { writeFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join, sep, basename } from 'node:path'
import { createSmokeEnvironment } from './smoke-environment.mjs'

const port = 8792
const origin = `http://127.0.0.1:${port}`
const state = await mkdtemp(join(tmpdir(), 'adakan-free-smoke-'))
const config = resolve('.free-worker/wrangler.test.json')
const vars = createSmokeEnvironment({}, '/tmp/contact-free-smoke', 'start')
vars.NEXT_PUBLIC_SITE_URL = origin
await writeFile(config, JSON.stringify({
  name: 'local-free-worker-tests', main: 'worker.js', compatibility_date: '2026-09-21', compatibility_flags: ['nodejs_compat'],
  assets: { directory: 'assets', binding: 'ASSETS', run_worker_first: true, html_handling: 'none', not_found_handling: 'none' }, vars,
}))
const server = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'dev', '--config', config, '--local', '--port', String(port), '--persist-to', state, '--show-interactive-dev-session', 'false', '--log-level', 'error'], {
  stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true, detached: process.platform !== 'win32',
})
let logs = ''
server.stdout.on('data', data => { logs = (logs + data).slice(-3000) })
server.stderr.on('data', data => { logs = (logs + data).slice(-3000) })
try {
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    try { const response = await fetch(origin + '/api/health', { signal: AbortSignal.timeout(1000) }); await response.body?.cancel(); ready = response.status === 200 } catch { /* starting */ }
    if (ready) break
    if (server.exitCode !== null) throw new Error(`Worker startup failed: ${logs}`)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  if (!ready) throw new Error(`Worker did not become ready: ${logs}`)
  for (const script of ['scripts/test-free-worker-http.mjs', ...(process.argv.includes('--browser') ? ['scripts/test-free-worker-browser.mjs'] : [])]) {
    const result = spawnSync(process.execPath, [script], { stdio: 'inherit', env: { ...process.env, SMOKE_BASE_URL: origin }, windowsHide: true })
    if (result.status !== 0) throw new Error(`${script} failed`)
  }
} finally {
  if (server.exitCode === null) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true })
    else { try { process.kill(-server.pid, 'SIGTERM') } catch { /* already stopped */ } }
  }
  if (resolve(state).startsWith(resolve(tmpdir()) + sep) && basename(state).startsWith('adakan-free-smoke-')) {
    await rm(state, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
  }
  await rm(config, { force: true })
}

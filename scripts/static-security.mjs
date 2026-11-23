/* global Buffer */
import { createHash } from 'node:crypto'

const hash = value => `sha256-${createHash('sha256').update(value).digest('base64')}`

export async function secureDocument(html, readAsset, { turnstile = false } = {}) {
  if (/<(?:script|style)\b[^>]*\bnonce\s*=/i.test(html)) throw new Error('Static documents must not reuse CSP nonces')
  const scripts = new Set(); const styles = new Set()
  const matches = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  for (const match of matches.reverse()) {
    const src = match[1].match(/\bsrc="([^"]+)"/i)?.[1]
    let replacement = match[0]
    if (src) {
      if (!src.startsWith('/') || src.startsWith('//') || decodeURIComponent(src).split('/').includes('..') || /[?#\\]/.test(src)) {
        throw new Error('Static script must reference a local pinned asset')
      }
      const integrity = hash(await readAsset(src))
      scripts.add(`'${integrity}'`)
      replacement = `<script${match[1].replace(/\s+integrity="[^"]*"/gi, '')} integrity="${integrity}">${match[2]}</script>`
    } else {
      scripts.add(`'${hash(match[2])}'`)
    }
    html = html.slice(0, match.index) + replacement + html.slice(match.index + match[0].length)
  }
  for (const match of [...html.matchAll(/<link\b[^>]*>/gi)].reverse()) {
    if (!/\bas="script"/i.test(match[0])) continue
    const href = match[0].match(/\bhref="([^"]+)"/i)?.[1]
    if (!href?.startsWith('/') || href.startsWith('//') || decodeURIComponent(href).split('/').includes('..') || /[?#\\]/.test(href)) throw new Error('Script preload must reference a local asset')
    const integrity = hash(await readAsset(href)); scripts.add(`'${integrity}'`)
    const replacement = match[0].replace(/\s+integrity="[^"]*"/gi, '').replace(/\/?\s*>$/, ` integrity="${integrity}"/>`)
    html = html.slice(0, match.index) + replacement + html.slice(match.index + match[0].length)
  }
  for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) styles.add(`'${hash(match[1])}'`)
  const csp = [
    "default-src 'self'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self' mailto:", "object-src 'none'",
    `script-src 'self' 'strict-dynamic' ${[...scripts].join(' ')}`, "script-src-attr 'none'",
    `style-src 'self' ${[...styles].join(' ')}`, "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:", "font-src 'self' data:",
    `connect-src 'self'${turnstile ? ' https://challenges.cloudflare.com' : ''}`,
    `frame-src ${turnstile ? 'https://challenges.cloudflare.com' : "'none'"}`,
    "worker-src 'self' blob:", "manifest-src 'self'", 'upgrade-insecure-requests',
  ].join('; ')
  if (Buffer.byteLength(csp) > 24_000) throw new Error('Static CSP exceeds conservative response header budget')
  return { html, csp }
}

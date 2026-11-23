/* global process, console, document, window */
import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
const origin = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:8791'
const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) })
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, colorScheme: 'light' })
    const failures = []
    page.on('pageerror', error => failures.push(error.message))
    page.on('console', message => { if (message.type() === 'error' && /Content Security Policy|integrity|Refused to|violates|hydration|hydrated|Minified React/i.test(message.text())) failures.push(message.text().slice(0, 180)) })
    await page.goto(origin, { waitUntil: 'networkidle' })
    assert.match(await page.locator('h1').innerText(), /Yazılım/)
    await page.locator('.studio-theme-toggle').click()
    assert.equal(await page.locator('html').evaluate(element => element.classList.contains('dark')), true)
    await page.locator('.studio-theme-toggle').click()
    await page.locator('.studio-lead a[href="/van-yazilim-firmasi"]').click()
    await page.waitForURL('**/van-yazilim-firmasi')
    await page.locator('h1').waitFor()
    assert.match(await page.locator('h1').innerText(), /Van/)
    await page.goto(origin + '/en/van-software-company', { waitUntil: 'networkidle' })
    assert.equal(await page.locator('html').getAttribute('lang'), 'en')
    assert.match(await page.locator('footer').innerText(), /Company|Contact|Istanbul/)
    await page.goto(origin + '/contact', { waitUntil: 'networkidle' })
    assert.ok(await page.locator('form').count() > 0)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, 'horizontal overflow')
    await page.screenshot({ path: `.free-worker/contact-${viewport.width}.png`, fullPage: true })
    assert.deepEqual(failures, [], `browser/CSP failures at ${viewport.width}px`)
    await page.close()
  }
  console.log('Free Worker browser checks passed at desktop and mobile widths')
} finally { await browser.close() }

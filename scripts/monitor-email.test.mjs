/* global Response */
import assert from 'node:assert/strict'
import test from 'node:test'
import { sendMonitorEmail } from './monitor-email.mjs'

const environment = { ALERT_RESEND_API_KEY: 'test-only-mail-credential', ALERT_FROM_EMAIL: 'alerts@example.com', GITHUB_RUN_ID: '12345', GITHUB_RUN_ATTEMPT: '1' }

test('missing mail configuration fails without making a request', async () => {
  let calls = 0
  await assert.rejects(sendMonitorEmail({}, async () => { calls++ }), /configuration/)
  assert.equal(calls, 0)
})

test('monitor mail has a fixed recipient, safe content and stable idempotency key', async () => {
  const requests = []
  const send = async (url, options) => { requests.push({ url, options }); return new Response(JSON.stringify({ id: 'message-test' }), { status: 200 }) }
  await sendMonitorEmail(environment, send)
  await sendMonitorEmail(environment, send)
  assert.equal(requests[0].url, 'https://api.resend.com/emails')
  const body = JSON.parse(requests[0].options.body)
  assert.deepEqual(body.to, ['info@adakansoftware.com'])
  assert.ok(body.text.includes('/actions/runs/12345'))
  assert.ok(!body.text.includes(environment.ALERT_RESEND_API_KEY))
  assert.equal(requests[0].options.headers['Idempotency-Key'], requests[1].options.headers['Idempotency-Key'])
})

test('provider errors never expose response bodies or credentials', async () => {
  await assert.rejects(sendMonitorEmail(environment, async () => new Response(environment.ALERT_RESEND_API_KEY, { status: 403 })), { message: 'Email provider rejected the request (HTTP 403)' })
  await assert.rejects(sendMonitorEmail(environment, async () => { throw new Error(environment.ALERT_RESEND_API_KEY) }), { message: 'Email provider could not be reached' })
})

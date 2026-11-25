/* global AbortSignal, console, fetch, process */
import { pathToFileURL } from 'node:url'

export async function sendMonitorEmail(environment, request = fetch, testMessage = false) {
  const key = environment.ALERT_RESEND_API_KEY
  const from = environment.ALERT_FROM_EMAIL
  const run = environment.GITHUB_RUN_ID
  const attempt = environment.GITHUB_RUN_ATTEMPT ?? '1'
  if (!key || !from || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(from) || !/^\d+$/.test(run ?? '') || !/^\d+$/.test(attempt)) {
    throw new Error('Monitor email configuration is incomplete or invalid')
  }
  const subject = testMessage ? 'Adakan Software: bildirim testi' : 'Adakan Software: otomatik kontrol başarısız'
  let response
  try {
    response = await request('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `monitor-${run}-${attempt}-${testMessage ? 'test' : 'failure'}` },
      body: JSON.stringify({ from, to: ['info@adakansoftware.com'], subject,
        text: `${subject}\n\n${testMessage ? 'Bu mesaj bildirim kanalını doğrulamak içindir.' : 'Canlı site veya haftalık güvenlik denetimi başarısız oldu. İş akışı kaydını kontrol edin.'}\nhttps://github.com/adakansoftware/adakansoftware/actions/runs/${run}\n\nBu e-posta gizli anahtar veya kullanıcı verisi içermez.` }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    throw new Error('Email provider could not be reached')
  }
  await response.body?.cancel()
  if (!response.ok) throw new Error(`Email provider rejected the request (HTTP ${response.status})`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await sendMonitorEmail(process.env, fetch, process.env.ALERT_TEST_EMAIL === 'true')
    console.log('Notification accepted by provider; inbox delivery still requires verification.')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

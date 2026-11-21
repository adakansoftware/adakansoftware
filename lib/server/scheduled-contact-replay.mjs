/* global Request, AbortSignal */

export async function runScheduledContactReplay(environment, sendRequest) {
  // Database-only inboxes have no email outbox to replay.
  if (environment.CONTACT_STATE_BACKEND?.trim().toLowerCase() !== "redis") return "skipped"

  const secret = environment.CONTACT_CRON_SECRET?.trim() || environment.CRON_SECRET?.trim()
  if (!secret || secret.length < 32) {
    throw new Error("CONTACT_CRON_SECRET or CRON_SECRET of at least 32 characters is required for scheduled replay")
  }

  const response = await sendRequest(new Request("https://adakansoftware.com/api/contact/replay/cron", {
    method: "POST",
    redirect: "manual",
    headers: {
      Authorization: `Bearer ${secret}`,
      "X-Worker-Id": "cloudflare-scheduled",
    },
    signal: AbortSignal.timeout(300_000),
  }))
  // Diagnostics can contain contact state; never log the response body.
  await response.body?.cancel()
  if (response.status === 409) return "busy"
  if (!response.ok) throw new Error(`Scheduled contact replay failed with HTTP ${response.status}`)
  return "completed"
}

const API_BURST_WINDOW_MS = 10_000
const API_BURST_MAX_REQUESTS = 30
const MAX_TRACKED_KEYS = 1_000
const MAX_KEY_LENGTH = 512

const requestTimestampsByKey = new Map<string, number[]>()
let nextCleanupAt = 0

function pruneOldRequests(now: number) {
  for (const [key, timestamps] of requestTimestampsByKey.entries()) {
    const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < API_BURST_WINDOW_MS)

    if (recentTimestamps.length === 0) {
      requestTimestampsByKey.delete(key)
      continue
    }

    requestTimestampsByKey.set(key, recentTimestamps)
  }
}

export function getProxyRateLimitPolicy() {
  return {
    windowMs: API_BURST_WINDOW_MS,
    maxRequests: API_BURST_MAX_REQUESTS,
    maxTrackedKeys: MAX_TRACKED_KEYS,
  }
}

export function isProxyRateLimited(key: string, now: number) {
  if (key.length > MAX_KEY_LENGTH) return true
  // Bound both memory and cleanup work under a flood of distinct API paths.
  if (now >= nextCleanupAt) {
    pruneOldRequests(now)
    nextCleanupAt = now + 1_000
  }
  if (!requestTimestampsByKey.has(key) && requestTimestampsByKey.size >= MAX_TRACKED_KEYS) return true

  const recentTimestamps = (requestTimestampsByKey.get(key) ?? []).filter(
    (timestamp) => now - timestamp < API_BURST_WINDOW_MS,
  )

  // Rejected requests must neither allocate more timestamps nor prolong a ban.
  if (recentTimestamps.length >= API_BURST_MAX_REQUESTS) return true
  recentTimestamps.push(now)
  requestTimestampsByKey.set(key, recentTimestamps)

  return false
}

export function getProxyRateLimitDiagnostics() {
  return {
    trackedKeys: requestTimestampsByKey.size,
    policy: getProxyRateLimitPolicy(),
    scope: "best-effort-per-instance",
    authoritative: false,
  }
}

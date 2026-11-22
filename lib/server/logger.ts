type LogLevel = "info" | "warn" | "error"

type LogContext = Record<string, unknown>
type LogPayload = LogContext & {
  schemaVersion: 1
  level: LogLevel
  event: string
  timestamp: string
}

const SENSITIVE_KEY = /(authorization|cookie|credential|email|password|phone|private|secret|session|signing|token|api[_-]?key|encryption[_-]?key|database[_-]?url|redis[_-]?url)/i
const CREDENTIAL_URL = /\b([a-z][a-z0-9+.-]*:\/\/)[^/@\s]+@/giu
const AUTHORIZATION_CREDENTIAL = /\b(Authorization\s*:\s*(?:Bearer|Basic)\s+)[A-Za-z0-9._~+/=-]+/giu
const AUTHORIZATION_ASSIGNMENT = /\b(authorization\s*=\s*)[^\s,;]+/giu
const BEARER_CREDENTIAL = /\b(Bearer\s+)[A-Za-z0-9._~+/=-]+/giu
const INLINE_SECRET_ASSIGNMENT = /\b((?:api[_-]?key|cookie|credential|email|password|phone|secret|session|signing[_-]?key|token)\s*[=:]\s*)[^\s,;]+/giu
const QUOTED_SECRET_ASSIGNMENT = /\b([\w-]*(?:authorization|api[_-]?key|password|secret|token|encryption[_-]?key|database[_-]?url|redis[_-]?url)[\w-]*["']?\s*[=:]\s*)(["'])(.*?)\2/giu
const PREFIXED_SECRET_ASSIGNMENT = /\b([\w-]*(?:api[_-]?key|password|secret|token|encryption[_-]?key)[\w-]*\s*[=:]\s*)[^\s,;&"']+/giu
const PROVIDER_TOKEN = /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{20,}|re_[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{30,})\b/gu

export function sanitizeLogString(value: string) {
  for (const [name, secret] of Object.entries(process.env)) {
    if (!name.startsWith("NEXT_PUBLIC_") && name !== "CF_ANALYTICS_TOKEN"
      && /SECRET|TOKEN|PASSWORD|API_KEY|ENCRYPTION_KEY|DATABASE_URL|REDIS_URL/i.test(name)
      && secret && secret.length >= 8) {
      value = value.replaceAll(secret, "[REDACTED]")
    }
  }
  return value
    .replace(QUOTED_SECRET_ASSIGNMENT, "$1$2[REDACTED]$2")
    .replace(PREFIXED_SECRET_ASSIGNMENT, "$1[REDACTED]")
    .replace(PROVIDER_TOKEN, "[REDACTED]")
    .replace(CREDENTIAL_URL, "$1[REDACTED]@")
    .replace(AUTHORIZATION_CREDENTIAL, "$1[REDACTED]")
    .replace(AUTHORIZATION_ASSIGNMENT, "$1[REDACTED]")
    .replace(BEARER_CREDENTIAL, "$1[REDACTED]")
    .replace(INLINE_SECRET_ASSIGNMENT, "$1[REDACTED]")
}

function sanitizeLogValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeLogValue)
  if (typeof value === "string") return sanitizeLogString(value)
  if (!value || typeof value !== "object") return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
      key,
      SENSITIVE_KEY.test(key) ? "[REDACTED]" : sanitizeLogValue(nestedValue),
    ]),
  )
}

export function createLogPayload(level: LogLevel, event: string, context: LogContext = {}): LogPayload {
  return {
    schemaVersion: 1,
    level,
    event,
    timestamp: new Date().toISOString(),
    ...(sanitizeLogValue(context) as LogContext),
  }
}

export function logServerEvent(level: LogLevel, event: string, context: LogContext = {}) {
  const payload = createLogPayload(level, event, context)

  const line = JSON.stringify(payload)

  if (level === "error") {
    console.error(line)
    return
  }

  if (level === "warn") {
    console.warn(line)
    return
  }

  console.info(line)
}

type LogLevel = "info" | "warn" | "error"

type LogContext = Record<string, unknown>
type LogPayload = LogContext & {
  schemaVersion: 1
  level: LogLevel
  event: string
  timestamp: string
}

const SENSITIVE_KEY = /(authorization|cookie|email|password|secret|token|api[_-]?key|phone)/i
const CREDENTIAL_URL = /\b((?:postgres(?:ql)?|redis(?:s)?):\/\/)[^@\s]+@/giu
const BEARER_CREDENTIAL = /\b(Bearer\s+)[A-Za-z0-9._~+/=-]+/giu
const INLINE_SECRET_ASSIGNMENT = /\b((?:api[_-]?key|token|secret|password)\s*[=:]\s*)[^\s,;]+/giu

function sanitizeLogString(value: string) {
  return value
    .replace(CREDENTIAL_URL, "$1[REDACTED]@")
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

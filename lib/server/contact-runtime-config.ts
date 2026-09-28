const PLACEHOLDER_VALUE_PATTERNS = [
  /change-this/i,
  /your[_-]/i,
  /example/i,
  /test-(admin|cron|signing)/i,
]
const RESEND_API_KEY_PATTERN = /^re_[A-Za-z0-9_-]+$/
const MINIMUM_SECRET_LENGTH = 32

function isPlaceholderValue(value: string | undefined) {
  const normalized = value?.trim()
  return !normalized || PLACEHOLDER_VALUE_PATTERNS.some((pattern) => pattern.test(normalized))
}

export function isValidContactFromDomain(value: string | undefined) {
  return Boolean(value?.trim() && /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/i.test(value.trim()))
}

export function isValidResendApiKey(value: string | undefined) {
  return Boolean(value?.trim() && RESEND_API_KEY_PATTERN.test(value.trim()))
}

function hasStrongSecret(value: string | undefined) {
  return !isPlaceholderValue(value) && value!.trim().length >= MINIMUM_SECRET_LENGTH
}

function hasValidEncryptionKey(value: string | undefined) {
  if (!value || !/^[A-Za-z0-9_-]{43}$/u.test(value.trim())) return false
  try {
    const normalized = value.trim().replaceAll("-", "+").replaceAll("_", "/")
    return atob(`${normalized}=`).length === 32
  } catch {
    return false
  }
}

function isValidDatabaseUrl(value: string | undefined) {
  if (isPlaceholderValue(value)) return false

  try {
    const url = new URL(value!.trim())
    return (url.protocol === "postgres:" || url.protocol === "postgresql:") && Boolean(url.hostname)
  } catch {
    return false
  }
}

function isValidRedisUrl(value: string | undefined) {
  if (isPlaceholderValue(value)) {
    return false
  }

  try {
    const url = new URL(value!.trim())
    return (url.protocol === "redis:" || url.protocol === "rediss:") && Boolean(url.hostname)
  } catch {
    return false
  }
}

function getEmailPipelineConfigurationIssues() {
  const issues: string[] = []

  if (!isValidDatabaseUrl(process.env.DATABASE_URL)) {
    issues.push("DATABASE_URL must be a valid PostgreSQL URL for durable contact persistence")
  }

  if (!hasValidEncryptionKey(process.env.CONTACT_DATA_ENCRYPTION_KEY)) {
    issues.push("CONTACT_DATA_ENCRYPTION_KEY must be a base64url encoded 256-bit key")
  }

  if (!isValidResendApiKey(process.env.RESEND_API_KEY)) {
    issues.push("RESEND_API_KEY must be a valid production Resend API key")
  }

  if (isPlaceholderValue(process.env.RESEND_FROM_DOMAIN)) {
    issues.push("RESEND_FROM_DOMAIN is required for production contact delivery")
  } else if (!isValidContactFromDomain(process.env.RESEND_FROM_DOMAIN)) {
    issues.push("RESEND_FROM_DOMAIN must be a valid domain name")
  }

  const signingSecretConfigured = hasStrongSecret(process.env.CONTACT_ADMIN_SIGNING_SECRET)
  if (!signingSecretConfigured) {
    issues.push(`CONTACT_ADMIN_SIGNING_SECRET of at least ${MINIMUM_SECRET_LENGTH} characters is required in production`)
  }

  const cronSecret = process.env.CONTACT_CRON_SECRET?.trim() || process.env.CRON_SECRET?.trim()
  if (cronSecret && !hasStrongSecret(cronSecret)) {
    issues.push(`CONTACT_CRON_SECRET must be at least ${MINIMUM_SECRET_LENGTH} characters when configured`)
  }

  if (process.env.CONTACT_STATE_BACKEND?.trim().toLowerCase() !== "redis") {
    issues.push("CONTACT_STATE_BACKEND=redis is required in production")
  }

  if (!isValidRedisUrl(process.env.REDIS_URL)) {
    issues.push("REDIS_URL must be a valid redis:// or rediss:// URL for the production contact state backend")
  }

  return issues
}

function isDatabaseInboxConfigured() {
  return isValidDatabaseUrl(process.env.DATABASE_URL)
    && hasStrongSecret(process.env.ADMIN_SESSION_SECRET)
    && hasValidEncryptionKey(process.env.CONTACT_DATA_ENCRYPTION_KEY)
}

export function getContactRuntimeMode(environment = process.env.NODE_ENV) {
  if (environment !== "production") return "development" as const
  if (getEmailPipelineConfigurationIssues().length === 0) return "email" as const
  if (isDatabaseInboxConfigured()) return "database" as const
  return "invalid" as const
}

export function isContactDeliveryPipelineConfigured(environment = process.env.NODE_ENV) {
  return environment !== "production" || getContactRuntimeMode(environment) === "email"
}

export function getContactRuntimeConfigurationIssues(environment = process.env.NODE_ENV) {
  if (environment !== "production" || getContactRuntimeMode(environment) !== "invalid") {
    return []
  }

  return [
    ...getEmailPipelineConfigurationIssues(),
    "DATABASE_URL and an ADMIN_SESSION_SECRET of at least 32 characters are required for database-only contact delivery",
    "CONTACT_DATA_ENCRYPTION_KEY must be a base64url encoded 256-bit key for durable contact storage",
  ]
}

export function isContactRuntimeConfigurationValid(environment = process.env.NODE_ENV) {
  return getContactRuntimeConfigurationIssues(environment).length === 0
}

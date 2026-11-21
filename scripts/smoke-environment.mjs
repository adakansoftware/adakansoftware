export function createSmokeEnvironment(environment, stateDirectory, serverMode) {
  const contactWrites = environment.SMOKE_ENABLE_CONTACT_WRITES === "1"
  if (contactWrites && serverMode !== "dev") {
    throw new Error("Contact-write smoke tests require development mode")
  }
  if (contactWrites && !environment.SMOKE_DATABASE_URL?.trim()) {
    throw new Error("Set SMOKE_DATABASE_URL to a disposable test database before enabling contact writes")
  }
  if (contactWrites && !/^postgres(?:ql)?:\/\//.test(environment.SMOKE_DATABASE_URL.trim())) {
    throw new Error("SMOKE_DATABASE_URL must be a PostgreSQL connection URL")
  }

  const isolatedEnvironment = Object.fromEntries(Object.entries(environment).map(([name, value]) => [
    name,
    /^(?:ADMIN_|CONTACT_|RESEND_|REDIS_|RATE_LIMIT_|TURNSTILE_)/.test(name) ? "" : value,
  ]))

  return {
    ...isolatedEnvironment,
    NODE_ENV: serverMode === "start" ? "production" : "development",
    DATABASE_URL: contactWrites ? environment.SMOKE_DATABASE_URL.trim() : "",
    REDIS_URL: "",
    RESEND_API_KEY: "",
    RESEND_FROM_DOMAIN: "",
    TURNSTILE_SECRET_KEY: "",
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
    CF_ANALYTICS_TOKEN: "",
    CONTACT_STATE_BACKEND: "file",
    CONTACT_STATE_DIRECTORY: stateDirectory,
    CONTACT_ADMIN_KEY: "test-admin-key",
    CONTACT_ADMIN_SIGNING_SECRET: "test-admin-signing-secret",
    CONTACT_CRON_SECRET: "test-cron-secret",
    CRON_SECRET: "",
    ADMIN_EMAIL: "smoke@example.com",
    ADMIN_PASSWORD_HASH: "pbkdf2-sha256$100000$MDEyMzQ1Njc4OWFiY2RlZg$CQEF03iMraucElCfobodRqkaFY16F3mxFDIvP9WoJcs",
    ADMIN_SESSION_SECRET: "test-only-session-secret-at-least-32-characters",
    RATE_LIMIT_HASH_SECRET: "test-only-rate-limit-secret-at-least-32-characters",
    CONTACT_DATA_ENCRYPTION_KEY: "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY",
  }
}

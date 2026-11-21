# Next Steps

Reviewed against the repository on 2026-11-21. Preserve the current UI.

## Implemented foundation

- Turkish routes and prefixed English routes share typed locale/content helpers.
- Localized metadata, sitemap, robots, structured data and route boundaries exist.
- Admin content management and contact inbox use Neon/PostgreSQL.
- Contact validation, encrypted storage, rate limiting, signed replay requests,
  optional Redis outbox and security headers are implemented.
- CI runs lint, secret scanning, dependency auditing, unit tests, build and smoke checks.
- Smoke runs isolate file state and test credentials. DB-write checks require an
  explicitly supplied disposable database; ordinary CI needs no database secrets.
- Cloudflare has an hourly replay handler; the Vercel fallback runs daily.

## Deployment verification

1. Build and package Cloudflare output before deployment; check scheduled execution
   afterward. Confirm cron credentials only when using the Redis email pipeline.
2. Run contact-write integration against a disposable Neon database. Default smoke
   tests verify missing-DB failure, not successful DB persistence or email delivery.
3. Verify production database, encryption key, shared rate-limit secret, optional
   Turnstile and email settings through authenticated health diagnostics.

## Follow-up work requiring measurements

- Profile mobile animation cost, page weight and Core Web Vitals in a browser.
- Review keyboard navigation, focus and reduced-motion behavior visually.
- Root layout reads request headers for locale and a per-request CSP nonce, so
  marketing pages render dynamically. `revalidate = 60` does not make their HTML
  static. Keep this security design unless a separately measured caching change
  preserves nonce correctness, localization and admin content freshness.

See `OPERATIONS.md` for smoke-test isolation and `docs/cloudflare-deployment.md`
for deployment and scheduling details.

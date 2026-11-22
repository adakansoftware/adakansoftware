# Operations Runbook

## Production contact delivery

Set a verified `RESEND_API_KEY`, `RESEND_FROM_DOMAIN`, and
`CONTACT_ADMIN_SIGNING_SECRET`. Production replay and diagnostic requests use
timestamped, HMAC-signed, single-use nonces; `CONTACT_ADMIN_KEY` is accepted
only outside production. Placeholder values are rejected in production.

`RESEND_API_KEY` must use Resend's `re_` key format.

For the email outbox, use `CONTACT_STATE_BACKEND=redis` and set `REDIS_URL`. The file backend is only
for local development because it is not shared between production instances.

## Replay worker

Cloudflare uses `custom-worker.mjs` and `wrangler.jsonc` to run replay hourly
at minute zero (UTC). The scheduled handler reuses the OpenNext request handler
to send an authenticated POST to `/api/contact/replay/cron`. It skips deployments
that do not select the Redis outbox. Redis deployments require a cron secret of
at least 32 characters; missing credentials and HTTP failures fail the scheduled
invocation. HTTP 409 means another replay already holds the lock.

The optional Vercel deployment uses `vercel.json` to schedule
`GET /api/contact/replay/cron` daily at 00:00 UTC (03:00 Europe/Istanbul). Set either
`CONTACT_CRON_SECRET` or Vercel's `CRON_SECRET`; Vercel sends the latter as a
Bearer token. Review `/api/health` with an admin credential for detailed queue
and worker diagnostics. Public health responses intentionally contain only a
safe readiness summary.

Signed admin request nonces are stored in the configured contact state backend;
production Redis is therefore also required for replay-protection across instances.

## API perimeter rate limiting

`proxy.ts` provides an in-process burst brake only. Configure Vercel Firewall/WAF
or an equivalent edge rule for cross-instance API rate limiting. Redis-backed
or PostgreSQL-backed route policies remain authoritative for contact submissions
and failed admin logins, depending on the configured runtime.

## Failed deliveries

Failed deliveries use exponential retry and become `dead-letter` entries after
`CONTACT_OUTBOX_MAX_ATTEMPTS` attempts. Inspect the authenticated health
diagnostics before manually resolving the upstream configuration or replaying
messages; do not edit the state store files directly.

## Verification

Before deployment run:

```sh
npm run lint
npm test
npm run audit:all
npm run build
npm run test:client-secrets
npm run test:smoke:production
npm run test:smoke:boundaries
npm run test:smoke
```

Run the production smoke check before starting a development smoke server, so
it uses the fresh production build. The boundary smoke check uses the runner's
deterministic test administrator.
It sends only invalid submissions and unauthenticated content requests.

By default `test:smoke` uses no database and verifies that a valid contact payload
returns 503 instead of falsely reporting successful persistence. It also checks
routes, metadata, authentication, replay authorization and empty-outbox behavior.
All smoke runs use a temporary `CONTACT_STATE_DIRECTORY`, removed after shutdown;
they never load `.dev.vars`. Email, Redis and Turnstile credentials are disabled,
and test admin credentials are supplied by `scripts/smoke-environment.mjs`.

To run contact-write integration, explicitly set `SMOKE_ENABLE_CONTACT_WRITES=1`
and `SMOKE_DATABASE_URL` to a disposable Neon database with `neon/schema.sql`
already applied. Then run `npm run test:smoke` in development mode. This mode
creates contact records with a test encryption key; discard that test database
afterward. The runner never falls back to `DATABASE_URL`, never applies schemas,
and rejects write mode without the explicit test URL. Production smoke only
checks headers and does not support contact writes.

API JSON body limits are enforced while reading bytes, including requests without
Content-Length. Oversized streams are cancelled and receive 413; malformed JSON,
invalid UTF-8 and failed body reads receive 400. Existing limits remain 8 KiB for
admin login, 32 KiB for admin content and `CONTACT_MAX_CONTENT_LENGTH` for contact.

Local JSON state writes replace files through a temporary file in the same
directory. Failed writes reject their caller without blocking later writes.
This is single-process development storage, not a distributed transaction layer.

## Secret leak prevention

Run `git config --local core.hooksPath .githooks` once per clone to enable the
repository pre-commit check. It scans staged content as well as tracked and
non-ignored untracked files. A clean working copy cannot hide a secret still
present in the index. Ignored `.dev.vars` files remain local; do not force-add
them. Findings print file names and line numbers, never credential values.

CI also scans public build assets after building and checks that client import
graphs do not read server environment variables. `npm run audit:all` includes
build tools, which are excluded by `audit:production`.

The `glob` override pins 14.0.6 because the OpenNext adapter still requests the
affected 13.x line. Reassess it when upstream updates its dependency range.
Relevant advisories: https://github.com/advisories/GHSA-3g3m-2fjr-6pw4 and
https://github.com/advisories/GHSA-g3hv-75wg-m249. OpenNext, ESLint and
typescript-eslint were updated alongside the lockfile; production UI dependencies
were not intentionally upgraded.

Log strings and persisted delivery errors redact known environment secrets,
credential URLs, provider token formats and quoted credential fields. Historical
outbox errors are also sanitized before appearing in authenticated diagnostics.
These checks reduce leak risk; they do not establish that every possible secret
format or every external service configuration has been audited.

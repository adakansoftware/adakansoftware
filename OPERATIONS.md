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

Cloudflare uses the lightweight `worker/entry.mjs` bundle and `wrangler.jsonc` to run replay hourly
at minute zero (UTC). The scheduled handler reuses the API dispatcher
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

`worker/router.ts` (Cloudflare) and `proxy.ts` (Next development) provide an in-process burst brake only. Use an edge rule for cross-instance API rate limiting. Redis-backed
or PostgreSQL-backed route policies remain authoritative for contact submissions
and failed admin logins, depending on the configured runtime.

The burst brake stores at most 1,000 IP/path keys and 30 accepted timestamps per
key. Keys over 512 characters and new keys at capacity receive 429 until space
is reclaimed; active keys are not evicted to admit new traffic. Cleanup runs at
most once per second. Rejected requests do not extend the burst window.

The scheduled security monitor runs `scripts/verify-live-site.mjs`, which checks
public health, published database content, and sitemap pages. A database read
failure from `/api/public-content` now fails the monitor even when static pages
remain available. This verifies published-content reads, not DB write access,
backup recovery, or receipt of a failure notification.

### Email notifications

The monitor's failure job sends only to `info@adakansoftware.com`. Configure the
repository secret `ALERT_RESEND_API_KEY` with a sending-only Resend key and the
repository variable `ALERT_FROM_EMAIL` with a verified sender address. Do not add
these values to public files, build assets or workflow logs. No subscription or
automatic recharge should be enabled. Without configuration the notification job
fails explicitly; successful site checks never imply email delivery is working.

After configuring a free account, manually dispatch `security-monitor.yml` with
`test_email=true` once and confirm receipt in the target inbox. Provider acceptance
alone is not delivery confirmation. Repeated attempts within the same run/attempt
use the same idempotency key. The message contains only a generic failure summary
and the workflow URL, never diagnostic payloads or application secrets.

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

The former OpenNext server adapter was removed from the free deployment. ESLint
and typescript-eslint remain on the audited versions; `audit:all` also checks
the static build and lightweight Worker dependencies.

Log strings and persisted delivery errors redact known environment secrets,
credential URLs, provider token formats and quoted credential fields. Historical
outbox errors are also sanitized before appearing in authenticated diagnostics.
These checks reduce leak risk; they do not establish that every possible secret
format or every external service configuration has been audited.

## Free Cloudflare deployment and publishing

Production serves prebuilt HTML, navigation payloads and images through the
ASSETS binding. The Worker routes API requests directly to the existing handlers;
it does not load a Next.js rendering server. No paid subscription, automatic
recharge or paid add-on is required or enabled by this configuration. Free-plan
CPU and daily request quotas still apply; this is not unlimited capacity.

`npm run build:cloudflare` creates `.free-worker/assets` and the server-only
`.free-worker/worker.js`. Static export uses an ignored `.static-build` workspace.
Published project/logo data comes from `/api/public-content`; it contains only
the same presentation fields shown on public pages. A failed snapshot stops the
build. Server credentials are not needed in the remote build environment.
For initial bootstrap only, `node scripts/build-free-worker.mjs --local-env`
reads the existing ignored `.dev.vars` locally and obtains the published data
directly. Never print that file, commit it, or upload it as an asset.

Admin changes save to the database immediately but become visible on public
pages after the next successful deployment. Run the build and deploy again after
editing, deleting, archiving or changing publication status. The admin save
message explains this delay. `next dev` retains its usual dynamic behavior.

For isolated verification, run:

```sh
npm run test:worker
node scripts/build-free-worker.mjs --fixtures
npm run test:static
npx playwright install chromium
npm run test:worker:preview
```

Fixture builds do not read a production database. Never deploy fixture assets to
production. Rebuild without `--fixtures` before `wrangler deploy`. The preview
test runner uses local deterministic credentials and no external delivery services.

The CSP is generated per document from exact inline hashes and external script
integrity values, retaining `strict-dynamic`. No request nonce is reused. Admin
HTML and navigation aliases are protected by the same session check as the API.
Secrets remain Worker bindings; do not place them in the assets directory.

HTML uses `Cache-Control: no-transform` so edge features cannot inject scripts
or rewrite hash-protected documents. This also suppresses automatic Cloudflare
Web Analytics injection. The current analytics token is empty; any future
analytics integration must be added explicitly to the hashed build pipeline.
JavaScript, CSS and RSC payloads allow edge compression; script SRI still checks
the decoded bytes. Compression does not change page markup or appearance.

Cloudflare build output and local Next output are separate. `npm run build` and
the original Next smoke commands still verify the development implementation.
Rollback, if necessary, uses the prior Worker version; do not remove protection
or increase paid quotas as a workaround for a failed verification.

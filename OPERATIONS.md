# Operations Runbook

## Production contact delivery

Set a verified `RESEND_API_KEY`, `RESEND_FROM_DOMAIN`, and
`CONTACT_ADMIN_SIGNING_SECRET`. Production replay and diagnostic requests use
timestamped, HMAC-signed, single-use nonces; `CONTACT_ADMIN_KEY` is accepted
only outside production. Placeholder values are rejected in production.

`RESEND_API_KEY` must use Resend's `re_` key format.

Use `CONTACT_STATE_BACKEND=redis` and set `REDIS_URL`. The file backend is only
for local development because it is not shared between production instances.

## Replay worker

`vercel.json` schedules `GET /api/contact/replay/cron` hourly. Set either
`CONTACT_CRON_SECRET` or Vercel's `CRON_SECRET`; Vercel sends the latter as a
Bearer token. Review `/api/health` with an admin credential for detailed queue
and worker diagnostics. Public health responses intentionally contain only a
safe readiness summary.

Signed admin request nonces are stored in the configured contact state backend;
production Redis is therefore also required for replay-protection across instances.

## API perimeter rate limiting

`proxy.ts` provides an in-process burst brake only. Configure Vercel Firewall/WAF
or an equivalent edge rule for cross-instance API rate limiting. Redis-backed
route policies remain authoritative for contact submissions and failed admin logins.

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
npm run audit:production
npm run build
npm run test:smoke:production
npm run test:smoke:boundaries
npm run test:smoke
```

Run the production smoke check before starting a development smoke server, so
it uses the fresh production build. The boundary smoke check expects a configured
test administrator (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`).
It sends only invalid submissions and unauthenticated content requests.

The full `test:smoke` suite creates contact records and replays the outbox. Run it
only with a disposable test database and isolated contact state, with email
delivery disabled. A successful contact response requires its database write;
the full suite cannot validate successful delivery with no database configured.

API JSON body limits are enforced while reading bytes, including requests without
Content-Length. Oversized streams are cancelled and receive 413; malformed JSON,
invalid UTF-8 and failed body reads receive 400. Existing limits remain 8 KiB for
admin login, 32 KiB for admin content and `CONTACT_MAX_CONTENT_LENGTH` for contact.

Local JSON state writes replace files through a temporary file in the same
directory. Failed writes reject their caller without blocking later writes.
This is single-process development storage, not a distributed transaction layer.

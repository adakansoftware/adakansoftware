# Operational fixes without UI changes

**Goal:** Make smoke runs isolated and add Cloudflare contact replay scheduling.

**Constraints:** Preserve components, styles, public copy, routing, CSP and rendering. Preserve the existing next-env.d.ts change. No deployment or production data writes.

**Design:** Keep database-free smoke checks as the default. Require an explicit disposable SMOKE_DATABASE_URL for opt-in contact writes. Use temporary file state and deterministic test credentials, without loading .dev.vars. Keep the generated OpenNext fetch handler and add a scheduled handler through a custom entry point, following https://opennext.js.org/cloudflare/howtos/custom-worker. Schedule hourly on Cloudflare; retain the daily Vercel fallback and document both accurately. Skip replay when the Redis email pipeline is not selected; surface missing credentials and replay errors when it is selected.

- [x] Add regression coverage for smoke environment isolation and database opt-in.
- [x] Isolate smoke state and credentials; validate missing-DB behavior.
- [x] Test and implement scheduled contact replay with authenticated internal requests.
- [x] Update operational documentation and replace stale next steps.
- [x] Run unit tests, lint, build, production and development smoke checks, and Cloudflare packaging. Review diff for UI changes.

Full DB-write integration requires a disposable Neon database supplied explicitly; local credentials must not be reused implicitly.

## Verification results

- 259 unit/regression tests passed; lint passed.
- Secret scan and its six regression tests passed.
- Next.js build and OpenNext Cloudflare build passed.
- Production security-header smoke, request-boundary smoke and default route smoke passed.
- Existing .data file hashes remained unchanged across development smoke runs.
- Wrangler deploy --dry-run passed without uploading.
- The packaged Worker ran locally with isolated configuration; invoking
  /cdn-cgi/local/scheduled?format=json returned outcome=ok in database-only mode.
- Components, styles and public assets have no changes. The pre-existing generated
  next-env.d.ts production paths remain in the working tree.
- OpenNext still warns that Node.js middleware support is experimental.
- No deployment, production database writes or live email delivery performed.

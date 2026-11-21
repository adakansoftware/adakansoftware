# Cloudflare deployment

The Worker name is `adakansoftware`. This is separate from the public domain
`adakansoftware.com`. The `WORKER_SELF_REFERENCE` service must use the same name.

The previous build auto-generated a service reference to
`adakan-software-website` while deploying `adakansoftwarewebsite`, which caused
Cloudflare error 10143. The configuration is now committed rather than generated
during deployment.

## Workers Builds settings

- Connect this repository to the Worker named `adakansoftware`.
- Build command: leave empty; Wrangler runs the configured OpenNext build.
- Deploy command: `npx wrangler deploy`.
- If the panel requires a build command, `npm run build` is safe but repeats the Next.js build.
- Do not override the Worker name with `--name adakansoftwarewebsite`.
- Keep the custom domain `adakansoftware.com` attached to the intended Worker.

For a local build-and-deploy, use `npm run deploy`; Wrangler runs the configured
OpenNext build first. `npm run preview:cloudflare` runs a local Workers preview.

The R2 bucket name is deliberately preserved from the existing deployment log:
`adakan-software-website-opennext-cache`. R2 names do not need to match Worker
names. Configure application secrets in Cloudflare, never in `wrangler.jsonc`.
The contact API requires its production shared state backend and credentials;
a successful Worker build does not validate external database or email services.

Reference: https://opennext.js.org/cloudflare/get-started

## Scheduled contact replay

`custom-worker.mjs` preserves the generated OpenNext fetch handler and adds a
scheduled handler. `wrangler.jsonc` triggers it hourly at minute zero UTC. Set
`CONTACT_CRON_SECRET` (or `CRON_SECRET`) to a random secret of at least 32
characters when `CONTACT_STATE_BACKEND=redis`. Database-only inbox deployments
skip scheduled replay because they have no Redis email outbox.

The handler calls the existing authenticated replay route internally, without
making a public network request or logging contact diagnostics. Failed requests
fail the cron invocation; a 409 indicates an overlapping replay. Verify cron
execution in Cloudflare observability after deployment. Local build success does
not prove production secrets or cron delivery are configured.

Build with `npm run build:cloudflare`, then use
`npx wrangler deploy --dry-run --outdir .wrangler/review-build` to verify packaging
without publishing. The scheduled handler follows the supported custom-worker
pattern: https://opennext.js.org/cloudflare/howtos/custom-worker.

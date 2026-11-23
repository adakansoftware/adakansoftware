# Free hosting migration proposal

Status: approved and implemented. Local and isolated Cloudflare preview checks passed; no subscription changes.

## Constraints and evidence

- Hosting must remain free. Do not enable paid plans, auto recharge, or paid add-ons.
- Preserve the existing UI, URLs, Turkish/English SEO, contact form, and admin authorization.
- Live Worker traces showed five `exceededCpu` failures at 10 ms, including the Van page and admin APIs. Retrying a successful request does not establish that this is fixed.
- The root layout and JSON-LD components read request headers for locale and CSP nonces. This makes public pages dynamically rendered. The current Next.js server also handles API requests.

## Recommended approach: remain on Cloudflare

1. Generate public HTML and client navigation payloads during the build and serve them as static assets. Keep the existing component markup, styling, route paths, canonical URLs and language alternatives.
2. Use a static-compatible strict CSP validated against generated scripts. Never cache and reuse request nonces, and do not relax script protection to `unsafe-inline` or remove authentication to save CPU.
3. Separate contact and admin API execution from the Next.js rendering server. Retain body limits, origin checks, rate limiting, password hashing strength, session revocation, encryption and secret redaction. Measure the resulting Worker against the free CPU limit before switching production traffic.
4. Keep private credentials in server configuration. Build assets and public content must never contain admin/session credentials or database URLs.
5. Preserve the existing deployment until the replacement passes local, preview and live checks. An unsuccessful optimization must not be represented as a resolved outage.

### Material behavior change requiring agreement

With static public pages, admin content changes need a new build/deployment before appearing publicly. Saving a record and publishing it become separate events. An automated publishing mechanism would need separately scoped credentials and verification. Do not silently replace the current cache revalidation behavior with stale static content.

## Alternative: another free Next.js host

Netlify Free supports a hard usage cap with no auto recharge. It requires an account and a hosting migration. Sites pause when the free monthly allowance is exhausted; this is not unlimited free hosting. This option avoids rewriting the application around Cloudflare's 10 ms CPU limit but changes deployment, scheduled jobs and host-specific security configuration.

## Acceptance checks

- Existing security regression tests and production smoke tests pass.
- Anonymous admin requests remain denied; successful contact/admin flows are tested with isolated fixtures.
- Every published route has correct HTML, canonical, language alternatives and structured data.
- Desktop/mobile layout, navigation, themes and contact interaction match the current site.
- Fresh Worker traces for public, rejected and authenticated API requests show no CPU-limit failures during the verification sample. Record CPU measurements and remaining free-plan quotas; do not claim unlimited capacity.
- Generated HTML, JavaScript and public assets pass secret scans.
- No paid plan or billable add-on is enabled.

## Sources

- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/pages/functions/pricing/
- https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/
- Installed Next.js guides: `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` and `static-exports.md`.

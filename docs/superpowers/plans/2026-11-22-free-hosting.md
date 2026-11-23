# Free Cloudflare Hosting Implementation Plan

> Execute with subagent-driven-development. User approved the design and the change from immediate content revalidation to publishing through deployment.

**Goal:** Remove Next.js server rendering from production requests while preserving UI, security and the free hosting constraint.

**Architecture:** Build a separate static Next export in an ignored staging directory. Serve exported assets through a small Worker with strict per-document CSP. Bundle existing API handlers separately with request-scoped Next compatibility adapters; do not include the Next rendering server. Keep normal Next development and its tests available.

**Constraints:** No paid plans/add-ons; no secret values in logs/assets; no shared nonces; no weakened authentication/password hashing/rate limiting/encryption; preserve URLs and UI. Keep unrelated next-env.d.ts changes uncommitted. Never switch production until preview checks pass.

## Tasks

- [x] Static export: build staging script, static-compatible layout/JSON-LD/locale behavior, admin shell without embedded private data. Export to `.free-worker/assets`. Test routes, language and no request-time rendering dependencies.
- [x] API runtime: request-scoped cookies and Response compatibility; preserve existing route handlers and security controls. Export `handleApiRequest(request)` returning Response or null. Test anonymous boundaries, concurrent context isolation and cookie serialization.
- [x] Worker routing/build: canonical redirects, sensitive-path denial, API burst protection, admin HTML protection, assets/RSC routing, CSP hashes and security headers, scheduled replay. Fail closed on missing assets/manifests.
- [x] Verification: unit/security regression suite; build/secret scan; local Worker route/form/auth/SEO smoke; browser visual/navigation/theme checks; wrangler dry run.
- [ ] Release: commit/push only scoped files; deploy existing workers without subscription changes; verify all sitemap routes, API denial paths and CPU trace samples. Update operations and publishing instructions with actual limits/results.

## Review

Independent review before release focuses on static asset auth bypasses, nonce/hash CSP, build secret exposure, request context isolation, client navigation and loss of admin/contact behavior. Fix findings and re-run affected checks before claiming completion.

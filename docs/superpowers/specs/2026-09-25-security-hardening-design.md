# Security Hardening Design

## Goal

Harden the production site against distributed login and contact-form abuse without changing the UI, public content, sitemap, or static rendering strategy.

## Chosen approach

Use the existing Neon database as the shared authority for production rate limits. A small `security_rate_limits` table stores one fixed-window counter per hashed client key and scope. PostgreSQL performs each increment atomically, so all Cloudflare Worker instances observe the same count. Raw IP addresses are never stored; the application derives a keyed HMAC identifier from the existing server session secret.

The admin login fails closed when its shared limiter is unavailable. The public contact endpoint already depends on Neon for durable lead storage, so a limiter failure returns the same generic service-unavailable response instead of accepting an unprotected write.

## Request filtering

Requests whose path contains a dot-prefixed segment, except `/.well-known`, receive a real 404 response before routing. This prevents soft-200 responses for probes such as `/.env` while preserving standards-based verification paths.

The unauthenticated health response contains only `ok` and `status`. Detailed diagnostics remain behind the existing signed administrator authorization.

## CSP decision

Keep the current static-compatible CSP and add `script-src-attr 'none'` to prohibit inline event-handler execution. Do not adopt request nonces: the installed Next.js 16 documentation states that nonce CSP requires dynamic rendering, disables static optimization and normal CDN caching, and raises request cost. JSON-LD remains protected by the existing escaping serializer.

## Validation

Tests cover atomic limiter decisions, hashed identifiers, fail-closed behavior, dot-path filtering, the public health shape, and the tightened CSP. The complete unit suite, lint, production build, production security smoke test, and dependency audit must pass before deployment.


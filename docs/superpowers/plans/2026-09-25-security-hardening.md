# Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shared production abuse controls and reduce public information exposure without changing the site UI or static SEO behavior.

**Architecture:** Neon stores atomic fixed-window counters keyed by an HMAC of the client identifier and route scope. Route helpers consume this shared limiter in production, while Proxy rejects sensitive dot paths and the health endpoint exposes a minimal public payload.

**Tech Stack:** Next.js 16, TypeScript, Neon PostgreSQL, Node test runner, Cloudflare Workers/OpenNext.

## Global Constraints

- Do not change UI, public page copy, sitemap contents, or static rendering.
- Do not store raw client IP addresses.
- Do not require a new third-party account or public widget.
- Fail closed for privileged login attempts when shared protection is unavailable.

---

### Task 1: Shared Neon rate limiter

**Files:**
- Modify: `neon/schema.sql`
- Create: `lib/server/shared-rate-limit.ts`
- Create: `lib/server/shared-rate-limit.test.mjs`
- Modify: `lib/server/admin-login-rate-limit.ts`
- Modify: `lib/server/admin-login-rate-limit.test.mjs`
- Modify: `lib/server/contact-service.ts`

**Interfaces:**
- Produces: `consumeSharedRateLimit(scope, identifier, windowMs, maxRequests, now?) -> Promise<{ limited: boolean; retryAfterSeconds: number }>`.
- Consumes: `DATABASE_URL`, `ADMIN_SESSION_SECRET`, and `getNeonSql()`.

- [x] Write tests proving identifiers are HMAC-hashed, the SQL boundary receives no raw IP, counts over the limit are rejected, and database errors fail closed.
- [x] Run the focused tests and verify they fail because the shared limiter does not exist.
- [x] Add the table, atomic SQL operation, and route integration.
- [x] Run the focused tests and verify they pass.

### Task 2: Public request-surface hardening

**Files:**
- Create: `lib/server/sensitive-path.ts`
- Create: `lib/server/sensitive-path.test.mjs`
- Modify: `proxy.ts`
- Modify: `app/api/health/route.ts`
- Modify: `lib/server/health-response.test.mjs`
- Modify: `next.config.mjs`

**Interfaces:**
- Produces: `isSensitiveDotPath(pathname: string): boolean`.
- Preserves: `/.well-known/**` and all normal public assets.

- [x] Write tests for dot-path denial, `/.well-known` allowance, minimal health output, and `script-src-attr 'none'`.
- [x] Run focused tests and verify the new expectations fail.
- [x] Implement the proxy response, health payload reduction, and CSP directive.
- [x] Run focused tests and verify they pass.

### Task 3: Verification and release

**Files:**
- Modify: plan checkboxes after verification.

**Interfaces:**
- Consumes: completed Tasks 1-2.
- Produces: a tested commit deployed to the current Cloudflare production project.

- [x] Apply the idempotent Neon schema to production.
- [x] Run `npm test`, `npm run lint`, `npm run build`, `npm run test:smoke:production`, and `npm audit --audit-level=low`.
- [x] Commit and push the verified changes.
- [x] Deploy and verify live headers, protected endpoints, health output, `/.env` 404 behavior, and ordinary page availability.

# UI-preserving Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the application's browser and API security boundaries without changing UI behavior.

**Architecture:** `proxy.ts` will own a dynamic per-request CSP while `next.config.mjs` retains static, deployment-wide security headers. Route handlers will preserve their existing authorization model but convert backing-store faults in protected operational routes into controlled fail-closed responses. Existing route helpers continue to provide no-store responses and request IDs.

**Tech Stack:** Next.js 16 App Router/Proxy, TypeScript, Node.js test runner, ESLint.

## Global Constraints

- Do not change UI components, page content, styling, navigation, or user-facing form semantics.
- Production authentication, state, and cryptographic failures must deny or make the relevant sensitive operation unavailable.
- Do not expose secrets, raw exception messages, connection strings, or new diagnostics in responses.
- Preserve static-page performance: do not force public pages to dynamic rendering solely for CSP.

---

### Task 1: Tighten deployment-wide browser protections

**Files:**
- Modify: `next.config.mjs:6-80`
- Test: `scripts/test-smoke-routes.mjs`

**Interfaces:**
- Consumes: Next.js `headers()` configuration.
- Produces: HSTS with subdomain/preload coverage and a static CSP compatible with public static rendering.

- [ ] **Step 1: Add a smoke assertion for the HSTS contract**

Extend the existing smoke fixture that fetches the running application so it asserts the production HSTS response contains `includeSubDomains` and `preload` when `NODE_ENV=production`.

- [ ] **Step 2: Run the smoke assertion before the configuration change**

Run: `npm run test:smoke`

Expected: FAIL because the current HSTS value is only `max-age=31536000`.

- [ ] **Step 3: Update static headers minimally**

Change the production HSTS value in `next.config.mjs` to:

```js
"max-age=63072000; includeSubDomains; preload"
```

Do not add `unsafe-eval` to production and do not use a nonce CSP, because nonce CSP would make otherwise static public pages dynamic.

- [ ] **Step 4: Re-run the smoke suite**

Run: `npm run test:smoke`

Expected: PASS, including the new HSTS assertion and existing route checks.

- [ ] **Step 5: Commit the independent header hardening**

```bash
git add next.config.mjs scripts/test-smoke-routes.mjs
git commit -m "security: strengthen transport headers"
```

### Task 2: Fail closed for protected operational state access

**Files:**
- Modify: `app/api/contact/state/route.ts:21-47`
- Create: `lib/contact-state-route.test.mjs`
- Modify: `package.json:12-13`

**Interfaces:**
- Consumes: `getContactStateStoreStatus()` availability result.
- Produces: a `503` response without backend error details when the authorized operational state endpoint cannot reach its backing store.

- [ ] **Step 1: Write the failing route behavior test**

Extract the serializable response selection into a route-local exported helper if necessary. The test must pass an unavailable state with an internal error such as `redis://user:password@host` and assert the public body is exactly `{ ok: false, error: "Contact state is unavailable" }` with status `503`.

- [ ] **Step 2: Run the focused test before implementation**

Run: `node --experimental-strip-types --test lib/contact-state-route.test.mjs`

Expected: FAIL because the current endpoint returns `{ ok: true, error: <raw backend message> }`.

- [ ] **Step 3: Implement the fail-closed response**

Return a no-store `503` body before reading worker state when `stateStatus.available` is false:

```ts
return jsonResponse(
  { ok: false, error: "Contact state is unavailable" },
  { status: 503, requestId },
)
```

Only include backend/capability/worker details once availability is true and the request is authorized.

- [ ] **Step 4: Run focused and established security tests**

Run: `node --experimental-strip-types --test lib/contact-state-route.test.mjs lib/server/http.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the operational fail-closed boundary**

```bash
git add app/api/contact/state/route.ts lib/contact-state-route.test.mjs package.json
git commit -m "security: fail closed for contact state diagnostics"
```

### Task 3: Validate production configuration and full regression suite

**Files:**
- Modify: `.env.example:1-80` only if the documented HSTS/deployment contract needs clarification.
- Modify: `OPERATIONS.md:1-80` only if an operator action is required by the finalized implementation.

**Interfaces:**
- Consumes: the existing production environment variables and deployment behavior.
- Produces: a checked security baseline without exposing configuration values.

- [ ] **Step 1: Inspect the final diff against the design constraints**

Run: `git diff HEAD~2..HEAD -- next.config.mjs proxy.ts app/api/contact/state/route.ts lib package.json scripts`

Confirm no component, page, CSS, or public copy files changed.

- [ ] **Step 2: Run static checks and security suites**

Run: `npm run test:admin-security; npm run lint; npx tsc --noEmit; npm audit --omit=dev --audit-level=high`

Expected: every command exits 0.

- [ ] **Step 3: Run production-oriented build and smoke verification**

Run: `npm run build; npm run test:smoke`

Expected: both commands exit 0.

- [ ] **Step 4: Document only concrete operational requirements**

If the final tests demonstrate a deployment requirement not already in `OPERATIONS.md`, add one concise instruction. Otherwise make no documentation edits.

- [ ] **Step 5: Commit documentation only when it changed**

```bash
git add .env.example OPERATIONS.md
git commit -m "docs: clarify security deployment requirements"
```


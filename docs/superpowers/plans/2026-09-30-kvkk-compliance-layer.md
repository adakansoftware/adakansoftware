# KVKK Compliance Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a legally transparent, technically enforceable KVKK layer for contact submissions without redesigning the public site or adding unnecessary consent/cookie UI.

**Architecture:** Keep legal copy in a dedicated typed content module and render it through a focused privacy page component. Extend contact records with an explicit retention deadline and hold flag, then centralize preview/apply deletion logic in a testable server module used by an operations CLI and the authenticated admin API. Store only aggregate, non-PII deletion audit records.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, Zod, Neon PostgreSQL, Node test runner, Tailwind CSS.

## Global Constraints

- Data controller: **Özgür Erdem Adakan**, operating under **Adakan Software**.
- KVKK contact address in site copy: **kvkk@adakansoftware.com**.
- Do not create or configure the mailbox until the user provides the destination Gmail account and explicitly requests the external setup.
- Preserve `/privacy` and `/en/privacy`; Turkish text is authoritative.
- Do not add a mandatory consent checkbox or cookie banner.
- Unconverted contact requests have a maximum two-year retention period from their latest update.
- Deletion audit records contain no personal data and are retained for at least three years.
- Keep the public visual language unchanged except for a small disclosure line above the contact submit button.
- Preserve encryption, validation, origin checks, rate limiting, spam protection, log redaction, and admin authorization.
- Follow the installed Next.js 16.3 documentation in `node_modules/next/dist/docs/`.

---

## File Structure

- Create `lib/privacy-content.ts`: typed Turkish and English KVKK/privacy content and the canonical KVKK email constant.
- Create `components/privacy-page.tsx`: structured legal page renderer using existing page shells and typography.
- Modify `app/privacy/page.tsx` and `app/[locale]/privacy/page.tsx`: render `PrivacyPage` while preserving metadata and localized routes.
- Modify `components/contact-form.tsx`: localized inline disclosure and sensitive-data warning.
- Modify `lib/shell-content.ts` and `lib/public-routes.ts`: footer copy and honest revision date.
- Create `lib/privacy-content.test.mjs` and `lib/contact-form-privacy.test.mjs`: legal-copy and form-boundary regression tests.
- Modify `neon/schema.sql`: retention deadline, retention hold, supporting index, and aggregate deletion audit table.
- Create `lib/server/contact-retention.ts`: testable retention SQL operations and result types.
- Create `lib/server/contact-retention.test.mjs`: preview/apply/hold/audit tests.
- Modify `lib/contact-request-record.ts` and its test: set two-year deadline when inserting.
- Modify `lib/admin-contact.ts`, `app/api/admin/contact-requests/route.ts`, and `components/admin/admin-contact-inbox.tsx`: expose hold state and authenticated manual erasure.
- Create `scripts/cleanup-contact-data.mjs`: dry-run-by-default operator command.
- Create `scripts/cleanup-contact-data.test.mjs`: CLI argument and mode tests.
- Modify `package.json`: dry-run and apply operations commands.
- Create `docs/compliance/kvkk-operations.md`: activation, monthly cleanup, request handling, and external-transfer checklist.

---

### Task 1: Publish complete localized KVKK disclosure

**Files:**
- Create: `lib/privacy-content.ts`
- Create: `components/privacy-page.tsx`
- Create: `lib/privacy-content.test.mjs`
- Modify: `app/privacy/page.tsx`
- Modify: `app/[locale]/privacy/page.tsx`
- Modify: `lib/shell-content.ts`
- Modify: `lib/public-routes.ts`

**Interfaces:**
- Produces: `kvkkContactEmail: "kvkk@adakansoftware.com"`.
- Produces: `privacyPageContent: Record<Locale, PrivacyPageCopy>` with `title`, `gradientText`, `description`, `effectiveDate`, `sections`, and `primaryHref`.
- Produces: `PrivacyPage({ locale }: { locale: Locale })`.

- [ ] **Step 1: Write failing legal-content tests**

Create `lib/privacy-content.test.mjs` using `loadTypeScriptModule` from `lib/test-support/load-typescript.mjs`. Assert that both locales include the controller name, KVKK email, collected data, purposes, legal grounds, provider categories, overseas-processing explanation, two-year retention, rights, application method, local-storage explanation, and effective date. Assert the Turkish footer label is `KVKK ve Gizlilik`, the English label remains `Privacy`, and `publicRoutes` dates `/privacy` as `2026-09-30`.

```js
test("publishes the controller and application channel in both locales", () => {
  assert.equal(kvkkContactEmail, "kvkk@adakansoftware.com")
  for (const locale of ["tr", "en"]) {
    const text = JSON.stringify(privacyPageContent[locale])
    assert.match(text, /Özgür Erdem Adakan/)
    assert.match(text, /kvkk@adakansoftware\.com/)
  }
})

test("states retention and avoids presenting contact processing as consent", () => {
  const tr = JSON.stringify(privacyPageContent.tr)
  assert.match(tr, /iki yıl/i)
  assert.match(tr, /5\/2-c/)
  assert.match(tr, /5\/2-f/)
  assert.doesNotMatch(tr, /açık rıza vererek|rıza göstermektesiniz/i)
})
```

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `node --experimental-strip-types --test lib/privacy-content.test.mjs`

Expected: FAIL because `lib/privacy-content.ts` does not exist and footer/revision copy is unchanged.

- [ ] **Step 3: Implement the typed content module**

Define:

```ts
export type PrivacySection = {
  id: string
  title: string
  paragraphs: readonly string[]
  bullets?: readonly string[]
}

export type PrivacyPageCopy = {
  title: string
  gradientText: string
  description: string
  effectiveDate: string
  primaryHref: string
  primaryLabel: string
  sections: readonly PrivacySection[]
}

export const kvkkContactEmail = "kvkk@adakansoftware.com" as const
```

Populate both locales with these exact information blocks:

1. Controller: Özgür Erdem Adakan / Adakan Software / `kvkk@adakansoftware.com`.
2. Data: name, email, optional phone, project brief, locale, timestamp, request ID, and limited anti-abuse records.
3. Purposes: answer inquiries, evaluate work, prepare proposals, secure the form, satisfy legal duties.
4. Legal grounds: KVKK 5/2-c and 5/2-f; explain that contact processing is not based on marketing consent.
5. Collection: form, email, and technical request processing.
6. Recipients: hosting/security, database, email delivery, and authorities when legally required; name Cloudflare, Neon, and Resend and disclose possible overseas processing without claiming an unverified transfer guarantee.
7. Retention: unconverted inquiries for two years after last update; contractual/statutory records under their applicable periods; expiry leads to deletion/destruction/anonymization.
8. Security: encrypted contact fields, restricted admin access, validation, rate limiting, and redacted logs.
9. Rights: list the Article 11 rights in plain language.
10. Application: email `kvkk@adakansoftware.com`, include name, request, reply channel, and proportionate identity-verification information; do not request an identity-card copy by default; answer within thirty days.
11. Storage: no advertising/behavioral analytics; theme preference stays in local storage; future non-essential tracking requires a separate choice.
12. Updates: effective date 30 September 2026; Turkish text prevails if translations differ.

- [ ] **Step 4: Render a dedicated privacy page without redesigning the shell**

Build `PrivacyPage` with the existing `PageHeader`, `PageJsonLd`, `CTASection`, `section-shell`, card, border, and typography classes. Render semantic `<article>`, `<section aria-labelledby>`, headings, paragraphs, bullet lists, effective date, and a `mailto:` link. Keep line lengths readable and do not add animations, modal banners, or new brand styling.

Update both privacy routes to render `PrivacyPage`. Leave the terms route and `legalPageContent.terms` untouched. Change the footer Turkish privacy label and set the privacy route revision to `2026-09-30` without changing unrelated route dates.

- [ ] **Step 5: Run focused tests and lint the changed files**

Run:

```powershell
node --experimental-strip-types --test lib/privacy-content.test.mjs lib/public-routes.test.mjs lib/seo-routes.test.mjs
npx eslint lib/privacy-content.ts components/privacy-page.tsx app/privacy/page.tsx "app/[locale]/privacy/page.tsx" lib/shell-content.ts lib/public-routes.ts
```

Expected: all tests pass and ESLint exits 0.

- [ ] **Step 6: Commit the legal-page slice**

```powershell
git add lib/privacy-content.ts components/privacy-page.tsx lib/privacy-content.test.mjs app/privacy/page.tsx "app/[locale]/privacy/page.tsx" lib/shell-content.ts lib/public-routes.ts
git commit -m "Add complete KVKK privacy disclosure"
```

---

### Task 2: Add contextual notice to the contact form

**Files:**
- Create: `lib/contact-form-privacy.test.mjs`
- Modify: `components/contact-form.tsx`

**Interfaces:**
- Consumes: `kvkkContactEmail` is not needed in the form; the form links to localized `/privacy` through `withLocale`.
- Produces: localized notice and sensitive-data warning; submission payload remains unchanged.

- [ ] **Step 1: Write the failing source-boundary test**

Create `lib/contact-form-privacy.test.mjs` to read `components/contact-form.tsx` and assert:

```js
assert.match(source, /withLocale\("\/privacy", locale\)/)
assert.match(source, /KVKK Aydınlatma Metni/)
assert.match(source, /Privacy Notice/)
assert.match(source, /hassas bilgi paylaşmayın/i)
assert.doesNotMatch(source, /type=["']checkbox["']/)
assert.doesNotMatch(source, /consent|explicitConsent/)
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test lib/contact-form-privacy.test.mjs`

Expected: FAIL because the disclosure does not exist.

- [ ] **Step 3: Implement localized notice copy and link**

Add `privacyLead`, `privacyLink`, `privacyTail`, and `sensitiveDataWarning` to the existing `copy` object. Render a compact `text-xs leading-5 text-muted-foreground` block immediately above the existing submit button:

```tsx
<div className="space-y-1 text-xs leading-5 text-muted-foreground">
  <p>
    {t.privacyLead}{" "}
    <Link className="underline underline-offset-4 hover:text-foreground" href={withLocale("/privacy", locale)}>
      {t.privacyLink}
    </Link>{" "}
    {t.privacyTail}
  </p>
  <p>{t.sensitiveDataWarning}</p>
</div>
```

Turkish copy: “Bu formdaki kişisel verileriniz talebinizi yanıtlamak amacıyla işlenir. Ayrıntılar için KVKK Aydınlatma Metni'ni inceleyebilirsiniz. Lütfen proje alanında parola, ödeme bilgisi, kimlik belgesi, sağlık verisi veya başka hassas bilgi paylaşmayın.”

English copy: “Personal data in this form is processed to respond to your request. See the Privacy Notice for details. Do not include passwords, payment details, identity documents, health data, or other sensitive information in the project field.”

- [ ] **Step 4: Verify behavior and accessibility**

Run:

```powershell
node --test lib/contact-form-privacy.test.mjs
npx eslint components/contact-form.tsx
npx tsc --noEmit
```

Expected: all commands exit 0; the form schema and submitted JSON have no consent property.

- [ ] **Step 5: Commit the form notice**

```powershell
git add components/contact-form.tsx lib/contact-form-privacy.test.mjs
git commit -m "Add KVKK notice to contact form"
```

---

### Task 3: Model two-year retention and aggregate erasure audits

**Files:**
- Modify: `neon/schema.sql`
- Modify: `lib/contact-request-record.ts`
- Modify: `lib/contact-request-store.test.mjs`
- Create: `lib/server/contact-retention.ts`
- Create: `lib/server/contact-retention.test.mjs`

**Interfaces:**
- Produces: `CONTACT_RETENTION_MONTHS = 24`.
- Produces: `previewExpiredContactRequests(sql, now): Promise<ContactRetentionPreview>`.
- Produces: `eraseExpiredContactRequests(sql, now, actor): Promise<ContactRetentionResult>`.
- `ContactRetentionPreview`: `{ eligibleCount: number; heldCount: number; oldestEligibleAt: string | null }`.
- `ContactRetentionResult`: preview plus `{ runId: string; deletedCount: number; executedAt: string }`.

- [ ] **Step 1: Write failing recorder and retention tests**

Update the recorder test to expect an explicit retention expression in the insert:

```sql
insert into contact_requests (name, email, phone, project, locale, retention_until)
values ($1, $2, $3, $4, $5, now() + interval '24 months')
```

In `lib/server/contact-retention.test.mjs`, use a fake SQL client and assert:

- preview counts only `retention_until <= now()` rows with `retention_hold = false`;
- held records are counted separately and never selected for deletion;
- apply deletes eligible rows and inserts one aggregate audit row;
- audit values contain run ID, actor, counts, execution time, and expiry but no name/email/phone/project fields;
- an SQL failure does not report a successful deletion result.

- [ ] **Step 2: Run tests and confirm failure**

Run:

```powershell
node --experimental-strip-types --test lib/contact-request-store.test.mjs lib/server/contact-retention.test.mjs
```

Expected: FAIL because retention schema/functions are absent.

- [ ] **Step 3: Extend the Neon schema idempotently**

Add:

```sql
alter table contact_requests
  add column if not exists retention_until timestamptz,
  add column if not exists retention_hold boolean not null default false;

update contact_requests
set retention_until = updated_at + interval '24 months'
where retention_until is null;

alter table contact_requests
  alter column retention_until set default (now() + interval '24 months'),
  alter column retention_until set not null;

create index if not exists contact_requests_retention_idx
  on contact_requests (retention_until)
  where retention_hold = false;

create table if not exists contact_deletion_audits (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null,
  actor text not null check (length(actor) between 1 and 80),
  reason text not null check (reason in ('retention_expired', 'manual_request')),
  deleted_count integer not null check (deleted_count >= 0),
  executed_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '3 years')
);

create index if not exists contact_deletion_audits_expires_at_idx
  on contact_deletion_audits (expires_at);
```

- [ ] **Step 4: Implement retention operations**

Keep query text parameterized. Apply mode must run deletion and audit insertion in one database transaction. Select deleted IDs only inside the transaction and never write those IDs to the audit table or application logs. Use a UUID run ID and ISO timestamps in returned operational results.

Also update `createContactRequestRecorder` to set the deadline explicitly. Existing encryption behavior and argument order remain unchanged.

- [ ] **Step 5: Run focused tests**

Run:

```powershell
node --experimental-strip-types --test lib/contact-request-store.test.mjs lib/server/contact-retention.test.mjs
npx eslint lib/contact-request-record.ts lib/server/contact-retention.ts
npx tsc --noEmit
```

Expected: all pass.

- [ ] **Step 6: Commit the retention model**

```powershell
git add neon/schema.sql lib/contact-request-record.ts lib/contact-request-store.test.mjs lib/server/contact-retention.ts lib/server/contact-retention.test.mjs
git commit -m "Add contact data retention model"
```

---

### Task 4: Add safe cleanup operations and manual erasure

**Files:**
- Create: `scripts/cleanup-contact-data.mjs`
- Create: `scripts/cleanup-contact-data.test.mjs`
- Modify: `package.json`
- Modify: `lib/admin-contact.ts`
- Modify: `lib/admin-contact.test.mjs`
- Modify: `app/api/admin/contact-requests/route.ts`
- Modify: `components/admin/admin-contact-inbox.tsx`

**Interfaces:**
- Produces CLI: `npm run ops:kvkk:cleanup:dry` and `npm run ops:kvkk:cleanup:apply`.
- Produces admin update shape `{ id, status, adminNote, retentionHold }`.
- Produces authenticated `DELETE /api/admin/contact-requests` body `{ id, confirmation: "DELETE" }`.

- [ ] **Step 1: Write failing CLI, parser, and admin tests**

Add tests that require:

- no flag or `--dry-run` selects preview mode;
- only exact `--apply` selects deletion mode;
- unknown flags exit nonzero;
- `parseContactRequestUpdate` accepts a boolean `retentionHold` and rejects non-booleans;
- `parseContactRequestDeletion` accepts a UUID plus exact `confirmation: "DELETE"`;
- admin response conversion exposes `retentionHold` and `retentionUntil`;
- deleted rows are removed from client state through `removeContactRequest(requests, id)`.

- [ ] **Step 2: Run focused tests and confirm failure**

Run:

```powershell
node --experimental-strip-types --test scripts/cleanup-contact-data.test.mjs lib/admin-contact.test.mjs
```

Expected: FAIL for missing CLI/parser fields.

- [ ] **Step 3: Implement the dry-run-first CLI**

The script loads `DATABASE_URL`, creates the Neon client, calls the Task 3 module, and prints aggregate JSON only:

```json
{"mode":"dry-run","eligibleCount":0,"heldCount":0,"oldestEligibleAt":null}
```

Apply output additionally contains `runId`, `deletedCount`, and `executedAt`. Never print record IDs or personal fields. Add package scripts:

```json
"ops:kvkk:cleanup:dry": "node --env-file=.dev.vars scripts/cleanup-contact-data.mjs --dry-run",
"ops:kvkk:cleanup:apply": "node --env-file=.dev.vars scripts/cleanup-contact-data.mjs --apply"
```

Keep the public-policy retention period fixed at 24 months in the shared server constant so the published notice and deletion behavior cannot drift through an environment override.

- [ ] **Step 4: Add hold and erasure to the authenticated admin boundary**

Extend PATCH to persist `retention_hold`. Add DELETE with the same `isAdmin`, allowed-origin, bounded-JSON, request-ID, and generic-error controls as PATCH. Manual deletion must delete by UUID and insert a `manual_request` aggregate audit in one transaction. Do not return the deleted row or log its personal fields.

Update `ALLOW_HEADER_VALUE` to `GET, PATCH, DELETE, OPTIONS`.

- [ ] **Step 5: Add compact admin controls**

In the selected-request panel:

- add a labeled retention-hold switch/checkbox with plain copy (“Yasal/aktif süreç nedeniyle saklamayı durdur”);
- save it through PATCH;
- add a destructive “Kişisel veriyi kalıcı sil” button;
- require the existing `AlertDialog` with the request name and a clear irreversible warning;
- send exact `{ id, confirmation: "DELETE" }` only after confirmation;
- remove the record from local state and close the detail panel after success.

This changes only the authenticated admin UI, not the public design.

- [ ] **Step 6: Run focused security and behavior tests**

Run:

```powershell
node --experimental-strip-types --test scripts/cleanup-contact-data.test.mjs lib/admin-contact.test.mjs lib/admin-content-request.test.mjs lib/admin-session-request.test.mjs
npx eslint scripts/cleanup-contact-data.mjs lib/admin-contact.ts app/api/admin/contact-requests/route.ts components/admin/admin-contact-inbox.tsx
npx tsc --noEmit
```

Expected: all pass.

- [ ] **Step 7: Commit operations support**

```powershell
git add scripts/cleanup-contact-data.mjs scripts/cleanup-contact-data.test.mjs package.json lib/admin-contact.ts lib/admin-contact.test.mjs app/api/admin/contact-requests/route.ts components/admin/admin-contact-inbox.tsx
git commit -m "Add KVKK contact erasure operations"
```

---

### Task 5: Document operations and verify the complete release

**Files:**
- Create: `docs/compliance/kvkk-operations.md`
- Modify if required by failures: only files introduced or modified in Tasks 1–4

**Interfaces:**
- Produces an operator checklist for mailbox activation, monthly cleanup, applications, overseas-transfer review, and incident handling.

- [ ] **Step 1: Write the operations guide**

Include these concrete procedures:

1. Before production release, route `kvkk@adakansoftware.com` to the Gmail destination supplied by the user and verify inbound mail.
2. Do not configure outbound “send as” unless the user requests it; inbound application handling is sufficient for initial publication.
3. Run `npm run ops:kvkk:cleanup:dry`, review only aggregate counts, then run `npm run ops:kvkk:cleanup:apply` when authorized.
4. Schedule cleanup monthly after the first successful manual run.
5. Record request received date, identity-verification steps, decision, response date, and any lawful retention reason outside the public contact inbox.
6. Respond within thirty days.
7. Review Cloudflare, Neon, and Resend transfer locations/contracts before claiming full cross-border-transfer compliance.
8. Reassess consent/cookie controls before adding analytics, advertising, newsletter, or profiling tools.
9. Keep deletion audit rows for three years, then purge expired audit rows through a separate aggregate maintenance query.

- [ ] **Step 2: Apply the schema in the configured development database**

Run: `npm run db:apply-schema`

Expected: exit 0; the idempotent schema can be applied twice without failure.

- [ ] **Step 3: Run the full verification suite**

Run:

```powershell
npm run lint
npx tsc --noEmit
npm test
npm run test:secrets
npm run audit:production
npm run build
npm run test:smoke:production
npm run ops:kvkk:cleanup:dry
```

Expected: every command exits 0; production audit reports no high-or-higher vulnerabilities; cleanup output is aggregate-only and uses `mode: "dry-run"`.

- [ ] **Step 4: Perform browser verification**

Check `/privacy`, `/en/privacy`, `/contact`, and `/en/contact` at desktop and mobile widths. Verify:

- legal headings and mail link are readable;
- contact notice wraps without layout shift;
- keyboard focus reaches the privacy link;
- no checkbox/banner was added;
- a normal contact submission still succeeds;
- footer links reach the localized privacy pages.

- [ ] **Step 5: Commit documentation and any verification fixes**

```powershell
git add docs/compliance/kvkk-operations.md
git add -u
git commit -m "Document KVKK operations"
```

- [ ] **Step 6: External activation gate**

Ask the user for the exact Gmail destination they found. After explicit authorization, create the Cloudflare Email Routing address `kvkk@adakansoftware.com`, send one inbound verification message, and confirm delivery before publishing the new legal page. This external action is not performed by the code plan itself.


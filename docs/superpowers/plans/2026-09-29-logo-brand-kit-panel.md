# Logo Brand Kit Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the generic circular “A” on the logo page with a polished, responsive presentation of the real Adakan Software brand asset.

**Architecture:** Add one focused server component that renders the brand application panel from the existing `/favicon-v3.svg` artwork, then compose it into `LogoPageContent`. Keep the panel static and theme-aware so no client state, runtime animation, or new dependency is needed.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Tailwind CSS, Node test runner

## Global Constraints

- Use the existing Adakan Software artwork; do not invent a new symbol or alter its colors.
- Avoid gradients, decorative grids, oversized circles, and ornamental animation.
- Support light and dark themes and stack cleanly on small screens.
- Add no client-side state, animation library, or new dependency.

---

### Task 1: Replace the Generic Logo Graphic

**Files:**
- Create: `components/logo-brand-kit-panel.tsx`
- Modify: `components/page-routes.tsx:1-30,270-288`
- Test: `lib/logo-theme.test.mjs`

**Interfaces:**
- Consumes: existing static asset `/favicon-v3.svg` and the page locale passed to `LogoPageContent`.
- Produces: `LogoBrandKitPanel({ locale }: { locale: Locale }): JSX.Element`.

- [x] **Step 1: Write the failing structural test**

```js
test("logo page replaces the generic A graphic with a real brand kit panel", () => {
  const page = readFileSync("components/page-routes.tsx", "utf8")
  const panel = readFileSync("components/logo-brand-kit-panel.tsx", "utf8")

  assert.doesNotMatch(page, /font-aquire[\s\S]*?>A<\/span>/)
  assert.match(page, /<LogoBrandKitPanel locale=\{locale\} \/>/)
  assert.match(panel, /src="\/favicon-v3\.svg"/)
  assert.match(panel, /dark:bg-/)
})
```

- [x] **Step 2: Run the focused test and confirm it fails**

Run: `node --test lib/logo-theme.test.mjs`

Expected: FAIL because `components/logo-brand-kit-panel.tsx` does not exist.

- [x] **Step 3: Implement the static brand kit panel**

Create `LogoBrandKitPanel` with:

- a neutral outer frame;
- a primary lockup containing the genuine mark and the text `Adakan Software`;
- one dark mark tile and one light mark tile;
- compact `SVG`, `PNG`, `Icon`, and `Açık / Koyu` format labels localized for Turkish and English;
- real `Image` alternative text;
- responsive grid classes and no animation.

Import the component in `components/page-routes.tsx` and replace the old `aspect-square`, `grid-pattern`, circular wrapper, and `font-aquire` “A” block with:

```tsx
<LogoBrandKitPanel locale={locale} />
```

- [x] **Step 4: Run focused and full validation**

Run: `node --test lib/logo-theme.test.mjs`

Expected: all logo theme tests pass.

Run: `npm test`

Expected: all tests pass.

Run: `npm run lint`

Expected: exit code 0.

Run: `npx tsc --noEmit`

Expected: exit code 0.

Run: `npm run build`

Expected: production build completes successfully.

- [x] **Step 5: Inspect the rendered page**

Run: `npm run dev`

Check `/logo` at desktop and mobile widths in light and dark themes. Confirm that the genuine logo is legible, the panel does not overflow, and the old circular “A” is absent.

- [x] **Step 6: Commit the implementation**

```bash
git add components/logo-brand-kit-panel.tsx components/page-routes.tsx lib/logo-theme.test.mjs docs/superpowers/plans/2026-09-29-logo-brand-kit-panel.md
git commit -m "Refine logo brand kit presentation"
```

### Task 2: Keep Local Visual Verification Runnable

**Files:**
- Create: `scripts/run-next-with-dev-env.mjs`
- Modify: `package.json`
- Test: `lib/environment-hygiene.test.mjs`

**Interfaces:**
- Consumes: optional ignored `.dev.vars` file and arguments intended for the Next.js CLI.
- Produces: a child Next.js process that inherits local variables without propagating Node's `--env-file` flag through `NODE_OPTIONS`.

- [x] **Step 1: Cover the local Next.js wrapper structurally**

Verify that `dev` and `start` use `scripts/run-next-with-dev-env.mjs`, and that the wrapper loads `.dev.vars` before spawning Next.js without a shell.

- [x] **Step 2: Run the focused environment test**

Run: `node --test lib/environment-hygiene.test.mjs`

Expected: PASS.

- [x] **Step 3: Start the development server**

Run: `npm run dev -- --port 3000`

Expected: Next.js becomes ready without a `NODE_OPTIONS` error.

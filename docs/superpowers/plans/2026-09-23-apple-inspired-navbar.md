# Apple-inspired Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the public navigation hierarchy and keep the full `Adakan Software` brand readable on desktop and mobile.

**Architecture:** Preserve the existing client-side navbar and shared global stylesheet. Adjust the wordmark markup, responsive action placement, and navbar-specific CSS without adding dependencies or changing the site's information architecture.

**Tech Stack:** Next.js 16, React 19, TypeScript, global CSS, `next/image`, `next/link`.

## Global Constraints

- The visible brand name is exactly `Adakan Software`.
- The full brand remains visible at all supported viewport widths.
- The existing blue accent and light theme remain the only public-site palette.
- Reduced-motion preferences disable navbar animation.

---

### Task 1: Strengthen the brand and responsive navigation

**Files:**
- Modify: `components/navbar.tsx`
- Modify: `components/footer.tsx`
- Modify: `app/studio.css`

**Interfaces:**
- Consumes: `withLocale(path, locale)` and the existing public route links.
- Produces: the existing `Navbar` and `Footer` component signatures without API changes.

- [x] **Step 1: Confirm the current failure**

Inspect the 640 px media query and confirm that `.studio-brand-secondary` hides the second word.

- [x] **Step 2: Update the visible brand**

Render `Adakan Software`, increase the intrinsic logo dimensions to 40 by 40, and add the localized contact link to the mobile navigation.

- [x] **Step 3: Apply the responsive visual treatment**

Add the quiet translucent header, updated brand scale, blue desktop contact pill, full mobile wordmark, responsive narrow-screen sizing, and reduced-motion rules.

- [x] **Step 4: Verify**

Run `npm run lint` and `npm run build`. Inspect the home page at desktop and mobile widths and confirm the full wordmark remains visible.

- [x] **Step 5: Commit**

Run `git add components/navbar.tsx components/footer.tsx app/studio.css docs/superpowers/specs/2026-09-23-apple-inspired-navbar-design.md docs/superpowers/plans/2026-09-23-apple-inspired-navbar.md` and commit the verified change.

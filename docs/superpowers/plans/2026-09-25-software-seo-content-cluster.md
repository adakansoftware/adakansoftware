# Software SEO Content Cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a bilingual, indexable software knowledge hub with localized URLs, strong internal linking, and valid Article structured data.

**Architecture:** Keep localized article content in one typed data module, render it through shared index/article server components, and expose it through Turkish and English dynamic routes. Extend the existing metadata, public-route, sitemap, and JSON-LD helpers rather than creating parallel SEO systems.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Node test runner.

## Global Constraints

- Preserve the current simple visual language and theme behavior.
- Do not add dependencies.
- Do not invent customer outcomes, rankings, prices, testimonials, or author biographies.
- Use 2026-09-25 as the honest publication and modification date for this content release.
- Keep changes local; do not push until the user explicitly requests it.

---

### Task 1: Typed bilingual article content

**Files:**
- Create: `lib/blog-posts.ts`
- Create: `lib/blog-posts.test.mjs`

**Interfaces:**
- Produces: `blogPostKeys`, `getBlogPosts(locale)`, `getBlogPostBySlug(slug, locale)`, and `getBlogPostPaths()`.

- [x] Write tests that require four articles, unique localized slugs and titles, at least four substantial sections, three FAQs, valid release dates, and a related `/services/` route.
- [x] Run `node --experimental-strip-types lib/blog-posts.test.mjs` and confirm it fails because the module is missing.
- [x] Add the typed content module with four practical guides in Turkish and English.
- [x] Run the focused test and confirm it passes.

### Task 2: Localized metadata and public URL inventory

**Files:**
- Modify: `lib/metadata.ts`
- Modify: `lib/public-routes.ts`
- Modify: `lib/metadata.test.mjs`
- Modify: `lib/seo-routes.test.mjs`
- Modify: `lib/public-routes.test.mjs`

**Interfaces:**
- `createPageMetadata` consumes optional `localizedPaths: Record<Locale, string>`.
- `PublicRoute` consumes optional `localizedPaths` and `lastModified`.

- [x] Add failing tests for different Turkish and English article paths, reciprocal hreflang, blog indexability, article sitemap URLs, and honest `lastModified` values.
- [x] Run the three focused test files and confirm the new assertions fail.
- [x] Extend metadata and public-route helpers, register the blog index and article routes, and include useful pages in `llms.txt`.
- [x] Run the focused tests and confirm they pass.

### Task 3: Article structured data

**Files:**
- Modify: `lib/structured-data.ts`
- Modify: `lib/structured-data.test.mjs`
- Create: `components/blog-article-json-ld.tsx`

**Interfaces:**
- Produces: `createArticleSchema`, plus existing breadcrumb and FAQ schemas serialized as one graph.

- [x] Add a failing test for Article headline, canonical URL, language, dates, organization author/publisher, and main entity link.
- [x] Run the focused test and confirm failure.
- [x] Implement the pure Article schema builder and safe rendering component.
- [x] Run the focused test and confirm it passes.

### Task 4: Blog index and article routes

**Files:**
- Modify: `components/static-page-routes.tsx`
- Create: `components/blog-article-page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Create: `app/[locale]/blog/[slug]/page.tsx`
- Modify: `lib/static-page-content.ts`
- Create: `lib/blog-routes.test.mjs`

**Interfaces:**
- Dynamic routes use `generateStaticParams`, `dynamicParams = false`, and `createPageMetadata` with localized paths.

- [x] Add failing route-source tests requiring static params, not-found handling, localized metadata, article cards, and removal of placeholder copy.
- [x] Run the focused test and confirm failure.
- [x] Build the index cards, readable article page, Turkish route, and prefixed English route using existing components and styles.
- [x] Run focused tests and confirm they pass.

### Task 5: Verification

**Files:**
- Modify only files needed to correct discovered defects.

**Interfaces:**
- Produces a deployable build with no open temporary ports.

- [x] Run every `lib/**/*.test.mjs` file sequentially and require zero failures.
- [x] Run `npm run lint`.
- [x] Run `npx tsc --noEmit`.
- [x] Run `npm run build`.
- [x] Start the production server on a temporary port and inspect canonical, hreflang, Article, FAQ, breadcrumb, sitemap, robots, and `llms.txt` output.
- [x] Stop the temporary server and verify its port is closed.
- [x] Run `git diff --check` and inspect the final diff without pushing.

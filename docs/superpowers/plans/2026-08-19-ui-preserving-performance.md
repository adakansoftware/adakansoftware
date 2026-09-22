# UI-Preserving Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce initial and deferred image transfer while preserving every current UI element and animation exactly.

**Architecture:** Retain the existing App Router and all Framer Motion client components unchanged. Optimize only static source images, their delivery configuration, and image component size hints; keep the same image artwork, aspect ratios, placement, and class names.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, `next/image`, Sharp image processing, Node test runner.

## Global Constraints

- Do not modify any `framer-motion` import, `motion.*` element, motion hook, animation prop, animation CSS class, timer, scroll handler, or pointer handler.
- Do not change layout, typography, colors, spacing, copy, image aspect ratios, or interaction behavior.
- Preserve all existing routes and public image paths used by `lib/site-data.ts`.
- Retain the original PNG assets; add optimized derivatives rather than replacing or deleting source artwork.
- Run `npm run lint`, `npm run build`, and `npm run test:smoke` before handoff.

---

## File Structure

- Create: `scripts/optimize-public-images.mjs` — deterministic, checked-in image derivative generator.
- Create: `public/projects/optimized/*.avif` and `public/projects/optimized/*.webp` — compressed derivatives preserving source image dimensions and artwork.
- Create: `lib/project-image-assets.ts` — single mapping from original public path to its optimized derivative URLs and intrinsic dimensions.
- Create: `lib/project-image-assets.test.mjs` — verifies every declared optimized asset exists and keeps the source aspect ratio.
- Modify: `components/projects-section.tsx` — consume optimized project asset mapping without changing motion or visual classes.
- Modify: `components/project-listing-cards.tsx` — consume optimized project asset mapping without changing motion or visual classes.
- Modify: `components/page-routes.tsx` — consume optimized project asset mapping for its existing project image.
- Modify: `components/logo-works-section.tsx` and `components/logo-showcase.tsx` — consume optimized logo asset mapping without changing animation code or classes.
- Modify: `next.config.mjs` — configure immutable cache headers only for versioned optimized image derivatives.

### Task 1: Generate and verify static image derivatives

**Files:**
- Create: `scripts/optimize-public-images.mjs`
- Create: `public/projects/optimized/sallihogullari-hafriyat-cover.avif`
- Create: `public/projects/optimized/sallihogullari-hafriyat-cover.webp`
- Create: `public/projects/optimized/salihogullari-hafriyat-logo.avif`
- Create: `public/projects/optimized/salihogullari-hafriyat-logo.webp`
- Create: `public/projects/optimized/adakan-software-logo.avif`
- Create: `public/projects/optimized/adakan-software-logo.webp`
- Create: `public/projects/optimized/adakan-hafriyat-insaat-logo.avif`
- Create: `public/projects/optimized/adakan-hafriyat-insaat-logo.webp`
- Create: `lib/project-image-assets.test.mjs`

**Interfaces:**
- Produces: exact derivative files named above, with identical pixel dimensions and aspect ratios to their corresponding source PNGs.

- [ ] **Step 1: Write the failing asset-integrity test**

```js
import assert from "node:assert/strict"
import { access, stat } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import sharp from "sharp"

const optimizedFiles = [
  "sallihogullari-hafriyat-cover.avif",
  "sallihogullari-hafriyat-cover.webp",
  "salihogullari-hafriyat-logo.avif",
  "salihogullari-hafriyat-logo.webp",
  "adakan-software-logo.avif",
  "adakan-software-logo.webp",
  "adakan-hafriyat-insaat-logo.avif",
  "adakan-hafriyat-insaat-logo.webp",
]

test("optimized project derivatives exist, are non-empty, and retain source dimensions", async () => {
  for (const filename of optimizedFiles) {
    const target = path.join(process.cwd(), "public", "projects", "optimized", filename)
    await access(target)
    assert.ok((await stat(target)).size > 0, `${filename} must not be empty`)
    const sourceName = filename.replace(/\.(avif|webp)$/, ".png")
    const source = path.join(process.cwd(), "public", "projects", sourceName)
    const [sourceMetadata, optimizedMetadata] = await Promise.all([sharp(source).metadata(), sharp(target).metadata()])
    assert.equal(optimizedMetadata.width, sourceMetadata.width, `${filename} width must match source`)
    assert.equal(optimizedMetadata.height, sourceMetadata.height, `${filename} height must match source`)
  }
})
```

- [ ] **Step 2: Run the test to verify it fails because derivatives do not exist**

Run: `node --test lib/project-image-assets.test.mjs`

Expected: FAIL with an `ENOENT` error under `public/projects/optimized`.

- [ ] **Step 3: Implement a deterministic derivative generator**

```js
import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = process.cwd()
const sourceDir = path.join(root, "public", "projects")
const outputDir = path.join(sourceDir, "optimized")
const images = [
  "sallihogullari-hafriyat-cover",
  "salihogullari-hafriyat-logo",
  "adakan-software-logo",
  "adakan-hafriyat-insaat-logo",
]

await mkdir(outputDir, { recursive: true })

for (const basename of images) {
  const source = path.join(sourceDir, `${basename}.png`)
  await sharp(source).rotate().avif({ quality: 52, effort: 6 }).toFile(path.join(outputDir, `${basename}.avif`))
  await sharp(source).rotate().webp({ quality: 72, effort: 6 }).toFile(path.join(outputDir, `${basename}.webp`))
}
```

- [ ] **Step 4: Generate the derivatives and verify the asset test passes**

Run: `node scripts/optimize-public-images.mjs && node --test lib/project-image-assets.test.mjs`

Expected: PASS with the eight derivatives present and non-empty.

- [ ] **Step 5: Record compressed-size evidence**

Run: `Get-ChildItem public/projects/*.png,public/projects/optimized/* | Select-Object Name,Length`

Expected: every derivative is materially smaller than its PNG source; record the before/after byte sizes in the handoff.

### Task 2: Route existing image rendering to optimized sources

**Files:**
- Create: `lib/project-image-assets.ts`
- Modify: `components/projects-section.tsx`
- Modify: `components/project-listing-cards.tsx`
- Modify: `components/page-routes.tsx`
- Modify: `components/logo-works-section.tsx`
- Modify: `components/logo-showcase.tsx`
- Test: `lib/project-image-assets.test.mjs`

**Interfaces:**
- Produces: `getOptimizedProjectImage(source: string): string`.
- Produces: `getOptimizedLogoImage(source: string): string`.
- Consumes: existing `coverImage` and `logoImage` source strings without changing `lib/site-data.ts`.

- [ ] **Step 1: Extend the failing test with the expected mappings**

```js
import { getOptimizedLogoImage, getOptimizedProjectImage } from "./project-image-assets.ts"

test("maps existing public project images to AVIF derivatives", () => {
  assert.equal(
    getOptimizedProjectImage("/projects/sallihogullari-hafriyat-cover.png"),
    "/projects/optimized/sallihogullari-hafriyat-cover.avif",
  )
  assert.equal(
    getOptimizedLogoImage("/projects/adakan-software-logo.png"),
    "/projects/optimized/adakan-software-logo.avif",
  )
})
```

- [ ] **Step 2: Run the test to verify it fails because the asset module is absent**

Run: `node --experimental-strip-types --test lib/project-image-assets.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/project-image-assets`.

- [ ] **Step 3: Implement the explicit source-to-derivative mapping**

```ts
const projectImages = {
  "/projects/sallihogullari-hafriyat-cover.png": "/projects/optimized/sallihogullari-hafriyat-cover.avif",
} as const

const logoImages = {
  "/projects/salihogullari-hafriyat-logo.png": "/projects/optimized/salihogullari-hafriyat-logo.avif",
  "/projects/adakan-software-logo.png": "/projects/optimized/adakan-software-logo.avif",
  "/projects/adakan-hafriyat-insaat-logo.png": "/projects/optimized/adakan-hafriyat-insaat-logo.avif",
} as const

export function getOptimizedProjectImage(source: string) {
  return projectImages[source as keyof typeof projectImages] ?? source
}

export function getOptimizedLogoImage(source: string) {
  return logoImages[source as keyof typeof logoImages] ?? source
}
```

- [ ] **Step 4: Update only the `src` values at image call sites**

Replace each current `src={project.coverImage}`, `src={demo.coverImage}`, and `src={work.logoImage}` with the corresponding mapping helper call. Preserve every existing `Image` prop, wrapper element, class name, and all Framer Motion code byte-for-byte.

- [ ] **Step 5: Run the mapping and lint checks**

Run: `node --experimental-strip-types --test lib/project-image-assets.test.mjs && npm run lint`

Expected: mapping test PASS; ESLint exits 0.

### Task 3: Cache immutable optimized assets and verify production output

**Files:**
- Modify: `next.config.mjs`
- Modify: `scripts/test-smoke-routes.mjs`

**Interfaces:**
- Produces: `Cache-Control: public, max-age=31536000, immutable` for `/projects/optimized/:path*` only.
- Preserves: existing application-wide security headers.

- [ ] **Step 1: Add the failing cache-header assertion to the smoke route script**

```js
const imageResponse = await fetch(`${baseUrl}/projects/optimized/sallihogullari-hafriyat-cover.avif`)
assert.equal(imageResponse.status, 200)
assert.equal(
  imageResponse.headers.get("cache-control"),
  "public, max-age=31536000, immutable",
)
```

- [ ] **Step 2: Run the smoke script to confirm the header assertion fails**

Run: `npm run test:smoke`

Expected: asset response succeeds but the cache-control assertion fails or is absent.

- [ ] **Step 3: Add a scoped image-cache header rule before the general header rule**

```js
{
  source: "/projects/optimized/:path*",
  headers: [
    {
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    },
  ],
},
```

- [ ] **Step 4: Run the full production verification suite**

Run: `npm run lint; npm run build; npm run test:smoke`

Expected: lint exits 0, the production build completes, and smoke tests pass including the optimized-asset cache header assertion.

- [ ] **Step 5: Compare the primary routes visually with the pre-change baseline**

Run: use the local smoke server to open `/`, `/projects`, and `/logo` at 1440px and 390px viewport widths; scroll each page top-to-bottom and trigger each existing hover interaction.

Expected: image artwork, crop, layout, and every existing motion effect match the pre-change baseline.

### Task 4: Handoff with evidence

**Files:**
- Inspect: all files changed by Tasks 1–3

**Interfaces:**
- Produces: a handoff containing exact image byte reductions, cache behavior, build/lint/smoke output, and the changed-file list.

- [ ] **Step 1: Inspect the final diff for forbidden files**

Run: `git diff --name-only`

Expected: no animation-only component (`animated-background.tsx`, `cursor-glow.tsx`, `scroll-progress.tsx`, `hero-section.tsx`, `testimonials-section.tsx`, or motion code unrelated to image `src`) appears in the diff.

- [ ] **Step 2: Commit the isolated optimization**

```bash
git add docs/superpowers/specs/2026-08-19-ui-preserving-performance-design.md docs/superpowers/plans/2026-08-19-ui-preserving-performance.md scripts/optimize-public-images.mjs scripts/test-smoke-routes.mjs public/projects/optimized lib/project-image-assets.ts lib/project-image-assets.test.mjs components/projects-section.tsx components/project-listing-cards.tsx components/page-routes.tsx components/logo-works-section.tsx components/logo-showcase.tsx next.config.mjs
git commit -m "perf: optimize static project assets without UI changes"
```

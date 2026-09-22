# UI-Preserving Performance Design

## Goal

Improve loading and runtime performance without changing any existing visible UI or animation behavior.

## Non-negotiable constraints

- Do not modify, remove, reduce, delay, or otherwise alter any animation.
- Do not change animation timing, easing, trigger conditions, transition state, or interaction behavior.
- Do not change layout, typography, colors, spacing, copy, or component hierarchy as experienced by visitors.
- Preserve the existing Next.js App Router architecture and all routes.

## Observed opportunities

- `public/projects/sallihogullari-hafriyat-cover.png` is approximately 2.4 MB.
- Three project logo images are approximately 367–567 KB each.
- The site already uses `next/image`, AVIF/WebP output formats, and client-side animated components. Animation code is explicitly out of scope.

## Chosen approach

Use asset and delivery optimization only:

1. Generate modern, smaller variants of the large static project images while retaining the exact visual artwork and aspect ratios.
2. Update image usage to request dimensions that correspond to rendered sizes, preserving image framing and layout.
3. Keep LCP/above-the-fold assets prioritized and use native lazy loading for below-the-fold static imagery.
4. Code-split only non-animated, non-critical client features when this can be done without changing their rendering or animation lifecycle.
5. Validate with production build, lint, route smoke tests, and an image-size comparison. Run a local performance audit when the production server is available.

## Explicit exclusions

- No changes to Framer Motion imports, motion components, hooks, effects, CSS animations, scroll effects, pointer effects, or timers used for animations.
- No animation-reduced variants beyond the site's existing accessibility behavior.
- No visual redesign or UI cleanup.

## Acceptance criteria

- Every existing animation and visible UI behaves identically.
- Large project assets transfer substantially less data at their displayed dimensions.
- Build, lint, and smoke checks complete successfully.
- The final summary identifies every modified asset/code path and the fresh verification evidence.

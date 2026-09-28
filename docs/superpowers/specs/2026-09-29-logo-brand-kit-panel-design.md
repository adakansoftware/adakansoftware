# Logo Brand Kit Panel Design

## Goal

Replace the generic circular “A” graphic on the logo page with a credible presentation of Adakan Software's real brand system. The result should feel restrained, premium, and useful in both light and dark themes.

## Layout

- Keep the existing section heading and supporting copy on the left.
- Replace the square circle graphic on the right with one composed brand application panel.
- Use the existing Adakan Software artwork; do not invent a new symbol or alter its colors.
- Present a primary logo surface, a compact icon surface, and small format labels that communicate practical delivery formats.
- Use restrained borders, neutral surfaces, consistent radii, and generous spacing. Avoid gradients, decorative grids, oversized circles, and ornamental animation.
- Stack the copy and panel on small screens without horizontal overflow.

## Theme Behavior

- The main logo remains legible on both themes through separate neutral presentation surfaces.
- Light mode uses warm white and soft gray surfaces.
- Dark mode uses charcoal and off-white surfaces so black logo details remain visible.
- Brand colors remain unchanged.

## Accessibility and Performance

- Give logo imagery descriptive alternative text.
- Keep all explanatory text as real HTML.
- Reuse existing optimized assets and Next.js image handling.
- Add no client-side state, animation library, or new dependency.

## Verification

- Add a structural test that rejects the old generic `font-aquire` “A” treatment and verifies the real Adakan asset is used.
- Run the focused test, full test suite, lint, TypeScript, and production build.
- Check the logo page at desktop and mobile sizes in both themes.

# Apple-inspired Navbar Design

## Goal

Make the public site feel quieter and more premium while making the full `Adakan Software` name easy to read at every viewport size.

## Design direction

- Use the existing white, cool-gray, and blue palette.
- Keep the visual treatment restrained: one translucent header surface, a hairline divider, and no heavy shadows.
- Write the brand as `Adakan Software` with both words capitalized.
- Increase the desktop brand to a 40 px mark and 21 px wordmark.
- Keep the full brand visible on mobile with a 32 px mark and 17 px wordmark.
- Move the contact action into the mobile menu so the full wordmark has enough room.
- Use short 180 ms transitions and respect reduced-motion preferences.

## Responsive behavior

The desktop navigation remains on one line. Below 900 px, the primary links and contact action live in the menu while the language switch stays visible. At very narrow widths, the brand scales down slightly without hiding either word.

## Accessibility and performance

The current semantic links, menu labels, focus treatment, and Escape-key behavior remain intact. The local logo continues to use `next/image` with intrinsic dimensions and is prioritized because it appears above the fold.

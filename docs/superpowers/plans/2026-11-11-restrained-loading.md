# Restrained loading screen

Goal: Replace the floating glass tile with a restrained brand composition.

Design: Plain theme-aware surface; unchanged PNG logo alongside Adakan Software typography; one thin indeterminate progress line and the existing localized status label. No glow, bouncing, spinner, fabricated percentage, or minimum loading duration. Preserve live status announcements and reduced-motion support.

Implementation:
- [x] Replace the shared PageLoading markup, preserving its label API and both route boundaries.
- [x] Replace halo styles with responsive layout and one slow progress animation.
- [x] Run existing loading tests, ESLint and TypeScript checks. All passed. Rendered the actual component with compiled project CSS in headless Edge at 1440x900 and 390x844, in light and dark themes. Verified image loading, no horizontal overflow, no page errors and reduced-motion animation suppression. This checks the isolated component, not a live route transition.



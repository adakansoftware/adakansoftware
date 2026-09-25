# Software SEO Content Cluster Design

## Goal

Turn the placeholder blog into an indexable Turkish and English software knowledge hub that supports Adakan Software's service pages with useful, search-intent-driven content.

## Scope

- Publish four evergreen guides covering custom software, corporate websites, Next.js SEO/performance, and the difference between websites and web applications.
- Give every language version a natural localized slug, unique title, description, headings, FAQs, publication date, and related service link.
- Replace the placeholder blog view with a restrained article index that uses the site's existing visual language.
- Add Article, FAQ, and breadcrumb structured data based only on visible article content.
- Add the blog index and every localized article URL to the sitemap and `llms.txt` inventory.
- Keep all existing service, project, demo, theme, and logo behavior unchanged.

## Content and Trust Rules

- Do not invent customer outcomes, rankings, testimonials, prices, certifications, or author biographies.
- Use Adakan Software as the organizational author and publisher.
- Prefer practical explanations, decision criteria, checklists, and trade-offs over keyword repetition.
- Link each guide to the closest matching service page and link the blog index from the existing footer.
- Use publication and modification dates that match the date the content is added: 2026-09-25.

## Architecture

`lib/blog-posts.ts` is the single source for localized article data and slug mapping. Two dynamic Next.js routes render Turkish and English articles through one server component. Metadata accepts explicit localized alternate paths so Turkish and English articles can use different slugs while maintaining reciprocal canonical and hreflang links.

The public route registry gains optional localized paths and publication dates. Sitemap generation remains centralized and emits both language versions. Structured-data builders remain pure and testable; the rendering component serializes their output safely with the existing JSON-LD serializer.

## Interface

The blog index reuses the current page header, cards, CTA, spacing, colors, and theme behavior. Article pages use one readable column, a compact metadata row, section headings, FAQ details, related-service link, and CTA. No new visual system or dependency is introduced.

## Validation

- Content tests enforce unique localized slugs, substantial article bodies, valid dates, FAQs, and related service links.
- Metadata tests enforce localized canonicals and reciprocal hreflang, including `x-default`.
- Sitemap tests enforce blog index and localized article URLs.
- Structured-data tests enforce Article publisher, dates, language, and visible FAQ parity.
- ESLint, TypeScript, all tests, production build, and rendered production HTML must pass.


# Web Quality Audit — 25 September 2026

This audit records the production-mode Lighthouse measurements taken locally for the home page after the SEO and content work. The numbers are laboratory measurements; Search Console and Chrome UX Report data should be used for real-user validation after enough traffic is available.

## Results

| Metric | Before | After |
| --- | ---: | ---: |
| Performance | 91 | 97 |
| Accessibility | 96 | 100 |
| Best Practices | 96 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 1.8 s | 1.1 s |
| Largest Contentful Paint | 3.3 s | 2.5 s |
| Speed Index | 1.8 s | 1.1 s |
| Total Blocking Time | 20 ms | 30 ms |
| Cumulative Layout Shift | 0 | 0 |
| Transfer size | 394 KiB | 258 KiB |

## Changes behind the improvement

- Replaced the downloaded Inter webfont with the native system font stack, removing two font downloads from the critical path.
- Removed the Vercel Analytics client from this deployment because its script returned 404 outside Vercel and added no usable measurement data.
- Corrected brand-link accessible naming so the visible text and screen-reader name match.
- Raised light and dark theme link contrast to WCAG AA-safe values.
- Increased footer wordmark contrast while preserving the existing visual hierarchy.

## Remaining observations

- The largest JavaScript chunk is the shared React DOM runtime. Lighthouse estimates part of it as unused during the initial route, but it is framework code shared across navigation and interaction. Replacing or manually splitting it would add risk without a measured user benefit.
- The back/forward cache warning comes from the local Next.js production server's `Cache-Control: no-store` response. It is not a page implementation defect and should be rechecked against the deployed CDN response.
- Search Console URL Inspection, sitemap submission, Core Web Vitals field data, branded query impressions, and crawl statistics require property access and real traffic. They cannot be established by source-code changes alone.

## Rendered SEO crawl

A production-mode crawl checked all 50 indexable sitemap URLs in both Turkish and English. Every page returned HTTP 200, a unique title, a description of at least 70 characters, exactly one H1, reciprocal Turkish and English alternates, and JSON-LD. The crawl also found no orphan sitemap pages and no empty or generic internal-link labels. The one detected mismatch between the home-page sitemap URL and its rendered canonical was normalized in the route inventory.

## Production follow-up

1. Verify `https://adakansoftware.com/sitemap.xml` and representative canonical URLs in Google Search Console.
2. Request indexing only for the home page and the strongest service, location, guide, and case-study pages; allow internal links and the sitemap to expose the rest naturally.
3. Review Core Web Vitals field data after the 28-day collection window has enough samples.
4. Track branded and non-branded queries separately, especially software company, web design, custom software, e-commerce, and Istanbul intent clusters.
5. Re-run Lighthouse against the public domain after deployment and compare CDN caching, compression, and third-party requests with this baseline.

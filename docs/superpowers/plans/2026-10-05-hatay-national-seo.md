# Hatay Merkezli Türkiye Geneli SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adakan Software'ı Hatay merkezli ve Türkiye genelinde uzaktan hizmet veren bir yazılım şirketi olarak dürüstçe konumlandırmak; mevcut arayüzü değiştirmeden ulusal ve yerel arama rotalarını güçlendirmek.

**Architecture:** Mevcut İstanbul landing-page veri modeli üç pazar anahtarını (`turkey`, `hatay`, `istanbul`) destekleyen tek bir içerik kaynağına dönüştürülecek. Sayfa bileşeni aynı JSX ve CSS sınıflarını koruyacak; rota dosyaları yalnızca doğru içerik, metadata, canonical ve hreflang değerlerini bağlayacak. Genel marka metinleri ve Organization JSON-LD Hatay/Türkiye konumlandırmasına geçirilecek, eski İstanbul URL'leri ise Hatay merkezli ekibin İstanbul'a uzaktan hizmet verdiğini açıkça anlatacak.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 5.7, Node test runner, Next Metadata API, JSON-LD, sitemap/hreflang üretimi.

## Global Constraints

- Mevcut UI bileşenleri yeniden tasarlanmayacaktır.
- Renkler, tipografi, grid, animasyon ve spacing değerleri değişmeyecektir.
- Ana sayfada yalnızca istenen intro satırı kaldırılacaktır.
- Footer'da yalnızca konum ve ulusal SEO bağlantısı metni değişecektir.
- Yeni sayfalar mevcut sayfa kabuğunu birebir kullanacaktır.
- Ana marka anlatısı “Hatay merkezli, Türkiye genelindeki işletmelere uzaktan hizmet veren yazılım şirketi” olacaktır.
- İstanbul rotaları korunacak; İstanbul merkezli olunduğu veya doğrulanmamış yüz yüze hizmet verildiği iddia edilmeyecektir.
- Sıralama garantisi, uydurma değerlendirme, müşteri sayısı veya doğrulanmamış fiziksel ofis bilgisi eklenmeyecektir.
- Teknik `Europe/Istanbul` saat dilimi değeri konum iddiası olmadığı için değiştirilmeyecektir.
- Değişen pazarlama rotalarının `lastModified` değeri `2026-10-05` olacaktır.

---

## File Structure

- `components/studio-home.tsx`: Ana sayfadaki görünür konum intro satırını kaldırır; mevcut hero başlığı ve sınıfları korur.
- `components/footer.tsx`: Hatay konumunu ve Türkiye landing-page bağlantısını gösterir.
- `lib/site-config.ts`: Site genelindeki doğrulanmış konum ve kök metadata metinlerinin kaynağıdır.
- `lib/shell-content.ts`: Footer açıklamasını Hatay merkezli/Türkiye geneli anlatıya geçirir.
- `lib/route-metadata-content.ts`: Genel rota metadata metinlerini ve üç pazar metadata anahtarını tanımlar.
- `lib/service-pages.ts`: Genel hizmet sayfalarındaki İstanbul merkezli iddiaları temizler.
- `lib/structured-data.ts`: Organization şemasında Hatay adres yerelliğini ve ulusal hizmet anlatısını üretir.
- `app/og/route.tsx`: Open Graph görsel etiketlerinde Hatay/Türkiye anlatısını kullanır.
- `lib/location-positioning.test.mjs`: Görünür ana sayfa, footer, genel metadata ve schema konum regresyonlarını önler.
- `lib/local-service-page.ts`: Türkiye, Hatay ve İstanbul sayfalarının iki dilli özgün içerik kaynağıdır.
- `components/local-software-page.tsx`: Seçilen pazar içeriğini mevcut sayfa kabuğunda render eder ve doğru JSON-LD üretir.
- `app/turkiye-yazilim-sirketi/page.tsx`: Türkçe ulusal rota.
- `app/[locale]/turkey-software-company/page.tsx`: İngilizce ulusal rota.
- `app/hatay-yazilim-sirketi/page.tsx`: Türkçe Hatay rotası.
- `app/[locale]/hatay-software-company/page.tsx`: İngilizce Hatay rotası.
- `app/istanbul-yazilim-sirketi/page.tsx`: Türkçe İstanbul rotasını genelleştirilmiş bileşene bağlar.
- `app/[locale]/istanbul-software-company/page.tsx`: İngilizce İstanbul rotasını genelleştirilmiş bileşene bağlar.
- `lib/localized-route-map.ts`: Yeni Türkçe/İngilizce rota çiftlerini dil değiştirme sistemine ekler.
- `lib/public-routes.ts`: Yeni rotaları sitemap ve llms dizinine ekler.
- `lib/local-service-page.test.mjs`: Üç pazarın içerik kalitesini, özgünlüğünü ve dürüst iddialarını denetler.
- `lib/public-routes.test.mjs`: Public route sırasını ve benzersiz canonical URL'leri denetler.
- `lib/metadata.test.mjs`: Pazar rota metadata'sını doğru içerik kaynağından üretir.
- `lib/seo-routes.test.mjs`: Sitemap, canonical ve karşılıklı hreflang değerlerini denetler.
- `lib/structured-data.test.mjs`: Organization konumunun Hatay olduğunu denetler.

---

### Task 1: Genel marka konumunu Hatay ve Türkiye geneline geçir

**Files:**
- Create: `lib/location-positioning.test.mjs`
- Modify: `components/studio-home.tsx`
- Modify: `components/footer.tsx`
- Modify: `lib/site-config.ts`
- Modify: `lib/shell-content.ts`
- Modify: `lib/route-metadata-content.ts`
- Modify: `lib/service-pages.ts`
- Modify: `lib/structured-data.ts`
- Modify: `lib/structured-data.test.mjs`
- Modify: `app/og/route.tsx`

**Interfaces:**
- Consumes: `siteConfig.location`, `rootMetadataCopy`, `routeMetadataContent`, `createOrganizationSchema(locale)` and existing localized footer content.
- Produces: General pages that identify the business as Hatay-based and serving Turkey nationwide, with no general Istanbul-based claim.

- [ ] **Step 1: Write source and schema regression tests that fail on the current Istanbul positioning**

Create `lib/location-positioning.test.mjs` with explicit source-boundary assertions:

```js
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { siteConfig } from "./site-config.ts"
import { routeMetadataContent } from "./route-metadata-content.ts"
import { createOrganizationSchema } from "./structured-data.ts"

const read = path => readFileSync(path, "utf8")

test("homepage and footer use the approved Hatay and national positioning", () => {
  const home = read("components/studio-home.tsx")
  const footer = read("components/footer.tsx")

  assert.doesNotMatch(home, /İstanbul merkezli yazılım ve tasarım stüdyosu|Istanbul software and design studio/)
  assert.doesNotMatch(home, /studio-eyebrow/)
  assert.deepEqual(siteConfig.location, { tr: "Hatay, Türkiye", en: "Hatay, Türkiye" })
  assert.match(footer, /turkiye-yazilim-sirketi/)
  assert.match(footer, /Türkiye Yazılım Şirketi/)
})

test("general metadata and organization schema make no Istanbul-based claim", () => {
  const generalRouteKeys = ["home", "about", "approach", "contact", "services"]
  const generalCopy = JSON.stringify({
    routes: Object.fromEntries(generalRouteKeys.map(key => [key, routeMetadataContent[key]])),
    root: siteConfig,
  })
  assert.doesNotMatch(generalCopy, /İstanbul merkezli|Istanbul-based|Istanbul software company/i)
  assert.match(routeMetadataContent.home.tr.description, /Hatay/)
  assert.match(routeMetadataContent.home.tr.description, /Türkiye/)

  const tr = createOrganizationSchema("tr")
  const en = createOrganizationSchema("en")
  assert.equal(tr.address.addressLocality, "Hatay")
  assert.equal(en.address.addressLocality, "Hatay")
})
```

Update the existing address assertion in `lib/structured-data.test.mjs` from `İstanbul` to `Hatay` and assert the description contains the nationwide service message.

- [ ] **Step 2: Run the focused tests and confirm the current implementation fails**

Run:

```powershell
node --experimental-strip-types --test --test-isolation=none lib/location-positioning.test.mjs lib/structured-data.test.mjs
```

Expected: FAIL because the homepage eyebrow, Istanbul location, Istanbul metadata, and Istanbul Organization locality still exist.

- [ ] **Step 3: Remove only the homepage intro line and update visible footer values**

In `components/studio-home.tsx`, remove the `intro` field from both locale objects and delete only this JSX node:

```tsx
<p className="studio-eyebrow">{copy.intro}</p>
```

Keep the existing hero `<h1>`, container, animation, classes, and spacing declarations unchanged.

In `lib/site-config.ts`, set:

```ts
location: {
  tr: "Hatay, Türkiye",
  en: "Hatay, Türkiye",
},
```

In `components/footer.tsx`, replace the local landing link with:

```tsx
const nationalSoftwareHref = locale === "tr" ? "/turkiye-yazilim-sirketi" : "/en/turkey-software-company"
```

and render labels `Türkiye Yazılım Şirketi` / `Turkey Software Company` without changing the surrounding `<nav>` structure or classes.

- [ ] **Step 4: Update general metadata, schema, shell and OG copy without keyword stuffing**

Use these exact positioning rules across `lib/site-config.ts`, `lib/shell-content.ts`, `lib/route-metadata-content.ts`, `lib/service-pages.ts`, `lib/structured-data.ts`, and `app/og/route.tsx`:

```ts
const positioning = {
  tr: "Hatay merkezli, Türkiye genelindeki işletmelere uzaktan hizmet veren yazılım şirketi",
  en: "A Hatay-based software company serving businesses across Turkey remotely",
}
```

Apply natural variants rather than repeating the sentence verbatim:

- Home/root description: custom software, corporate websites, Next.js, UI/UX and brand identity; Hatay-based; nationwide remote delivery.
- About/footer description: strategy, UI/UX, software and brand work delivered by one Hatay-based team for businesses across Turkey.
- Contact keywords: remove `web tasarım ajansı İstanbul` / `Istanbul web design agency`; add `Hatay yazılım şirketi` and `Turkey software company` only where language-appropriate.
- General service descriptions and keyword arrays: remove Istanbul terms; use national intent such as `Türkiye yazılım şirketi`, `özel yazılım geliştirme`, `software company Turkey`.
- OG about labels: `Hatay Merkezli Yazılım ve Tasarım Stüdyosu` and `Hatay-Based Software and Design Studio`.
- Organization `addressLocality`: `Hatay` in both languages; `addressRegion`: `Hatay`; `addressCountry`: `TR`.

Do not change `Europe/Istanbul` timezone strings because they are technical timezone identifiers.

- [ ] **Step 5: Run focused tests and inspect the remaining Istanbul references**

Run:

```powershell
node --experimental-strip-types --test --test-isolation=none lib/location-positioning.test.mjs lib/structured-data.test.mjs
rg -n "İstanbul merkezli|Istanbul-based|Istanbul software company" components lib app --glob "!lib/local-service-page.ts" --glob "!app/istanbul-yazilim-sirketi/**" --glob "!app/[locale]/istanbul-software-company/**"
```

Expected: tests PASS. The search has no general-brand matches; Istanbul-specific search intent will be handled only in Task 2.

- [ ] **Step 6: Commit the general positioning change**

```powershell
git add components/studio-home.tsx components/footer.tsx lib/site-config.ts lib/shell-content.ts lib/route-metadata-content.ts lib/service-pages.ts lib/structured-data.ts lib/structured-data.test.mjs lib/location-positioning.test.mjs app/og/route.tsx
git commit -m "feat: position Adakan Software in Hatay nationwide"
```

---

### Task 2: Yerel landing-page altyapısını Türkiye, Hatay ve İstanbul için genelleştir

**Files:**
- Modify: `lib/local-service-page.ts`
- Modify: `lib/local-service-page.test.mjs`
- Modify: `components/local-software-page.tsx`

**Interfaces:**
- Consumes: `Locale`, existing service route hrefs, `createPageMetadata`, and existing JSON-LD builders.
- Produces: `SoftwareMarketKey`, `SoftwareMarketPage`, `softwareMarketRoutes`, and `getSoftwareMarketPage(market, locale)` for all route files and metadata tests.

- [ ] **Step 1: Replace the single-city test with failing three-market contract tests**

Update `lib/local-service-page.test.mjs` to import the new interface and enforce substance, unique intent, and truthful claims:

```js
import assert from "node:assert/strict"
import test from "node:test"

import { getSoftwareMarketPage, softwareMarketRoutes } from "./local-service-page.ts"

const markets = ["turkey", "hatay", "istanbul"]

test("software market pages provide substantial and distinct localized content", () => {
  for (const locale of ["tr", "en"]) {
    const descriptions = new Set()
    for (const market of markets) {
      const page = getSoftwareMarketPage(market, locale)
      assert.equal(page.path, softwareMarketRoutes[market].localizedPaths[locale])
      assert.ok(page.sections.length >= 4)
      assert.ok(page.services.length >= 6)
      assert.ok(page.process.length >= 4)
      assert.ok(page.faqs.length >= 4)
      assert.ok(page.relatedLinks.some(item => item.href === "/projects"))
      assert.ok(page.relatedLinks.some(item => item.href === "/contact"))
      assert.doesNotMatch(JSON.stringify(page), /en iyi|lider|bir numara|#1|garantili sıralama/i)
      descriptions.add(page.seo.description)
    }
    assert.equal(descriptions.size, markets.length)
  }
})

test("location claims remain honest", () => {
  const istanbul = JSON.stringify({ tr: getSoftwareMarketPage("istanbul", "tr"), en: getSoftwareMarketPage("istanbul", "en") })
  assert.doesNotMatch(istanbul, /İstanbul merkezli|Istanbul-based|built in Istanbul|yüz yüze keşif|in-person discovery/i)
  assert.match(istanbul, /Hatay/)
  assert.match(istanbul, /uzaktan|remote/i)
  assert.match(getSoftwareMarketPage("hatay", "tr").seo.title, /Hatay/)
  assert.match(getSoftwareMarketPage("turkey", "tr").seo.title, /Türkiye/)
  assert.match(getSoftwareMarketPage("turkey", "en").seo.title, /Turkey/)
})
```

- [ ] **Step 2: Run the focused test and confirm the new API is missing**

Run:

```powershell
node --experimental-strip-types --test lib/local-service-page.test.mjs
```

Expected: FAIL because `getSoftwareMarketPage` and `softwareMarketRoutes` are not exported.

- [ ] **Step 3: Define the market route and page contracts**

In `lib/local-service-page.ts`, replace `LocalSoftwarePage` and the single `pages` record with these exported contracts:

```ts
import type { Locale } from "./i18n.ts"
import type { RouteMetadataKey } from "./route-metadata-content.ts"

export type SoftwareMarketKey = "turkey" | "hatay" | "istanbul"

export type SoftwareMarketPage = {
  path: string
  faqTitle: string
  seo: { title: string; description: string; keywords: string[] }
  title: string
  accent: string
  description: string
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>
  services: Array<{ title: string; description: string; href: string }>
  process: Array<{ title: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
  relatedLinks: Array<{ label: string; href: string }>
}

export const softwareMarketRoutes: Record<SoftwareMarketKey, {
  path: string
  localizedPaths: Record<Locale, string>
  metadataKey: RouteMetadataKey
}> = {
  turkey: {
    path: "/turkiye-yazilim-sirketi",
    localizedPaths: { tr: "/turkiye-yazilim-sirketi", en: "/turkey-software-company" },
    metadataKey: "turkeySoftwareCompany",
  },
  hatay: {
    path: "/hatay-yazilim-sirketi",
    localizedPaths: { tr: "/hatay-yazilim-sirketi", en: "/hatay-software-company" },
    metadataKey: "hataySoftwareCompany",
  },
  istanbul: {
    path: "/istanbul-yazilim-sirketi",
    localizedPaths: { tr: "/istanbul-yazilim-sirketi", en: "/istanbul-software-company" },
    metadataKey: "istanbulSoftwareCompany",
  },
}

export function getSoftwareMarketPage(market: SoftwareMarketKey, locale: Locale): SoftwareMarketPage {
  return pages[market][locale]
}
```

Add `turkeySoftwareCompany` and `hataySoftwareCompany` to `RouteMetadataKey` and to `routeMetadataContent`; use the same SEO values exposed by the corresponding market pages so fallback metadata remains consistent.

- [ ] **Step 4: Add complete, unique content for all three markets**

Keep the existing six service cards and four process steps as shared localized constants. Supply four unique sections and four FAQs for each market using these exact content themes:

```ts
const contentThemes = {
  turkey: {
    tr: ["Türkiye genelinde uzaktan yazılım geliştirme", "İhtiyaca göre kapsam ve ilk sürüm", "Teknik kalite ve SEO temeli", "Şeffaf teslim ve hesap sahipliği"],
    en: ["Remote software delivery across Turkey", "Scope and first release around the real need", "Engineering quality and technical SEO", "Transparent delivery and account ownership"],
  },
  hatay: {
    tr: ["Hatay'daki işletmeler için dijital ürünler", "Yerel ihtiyacı uzaktan ve yazılı süreçle çözmek", "Hızlı, erişilebilir ve güvenli altyapı", "Yayın sonrası sürdürülebilir bakım"],
    en: ["Digital products for businesses in Hatay", "Solving local needs through a documented remote process", "Fast, accessible and secure foundations", "Sustainable post-launch maintenance"],
  },
  istanbul: {
    tr: ["İstanbul'daki işletmelere Hatay'dan uzaktan hizmet", "Gerçek ihtiyaca göre kapsam", "Teknik kalite ve arama görünürlüğü", "Yazılı ve izlenebilir proje süreci"],
    en: ["Remote delivery from Hatay for Istanbul businesses", "Scope built around the real need", "Engineering quality and search visibility", "A documented and traceable project process"],
  },
}
```

Each section must contain two concrete paragraphs. Each market must include buyer questions about pricing/scope, remote collaboration, technical SEO, and post-launch support, phrased for that market. Related links must include `/projects`, `/contact`, the national route, and the other location route where relevant. Ensure the Istanbul copy explicitly says the team is based in Hatay and serves Istanbul remotely.

- [ ] **Step 5: Parameterize the existing page component without changing its UI**

Change the component signature and data lookup in `components/local-software-page.tsx`:

```tsx
import { getSoftwareMarketPage, softwareMarketRoutes, type SoftwareMarketKey } from "@/lib/local-service-page"

export function LocalSoftwarePage({ locale, market }: { locale: Locale; market: SoftwareMarketKey }) {
  const page = getSoftwareMarketPage(market, locale)
  const route = softwareMarketRoutes[market]
  const canonicalPath = locale === "tr" ? route.localizedPaths.tr : `/en${route.localizedPaths.en}`
  const url = new URL(canonicalPath, siteConfig.url).href
  // existing service schema construction remains unchanged
  const schemas = [
    createWebPageSchema({ route: { path: route.path, metadataKey: route.metadataKey }, locale, url, content: page.seo, mainEntityId: service["@id"] }),
    service,
    createBreadcrumbSchema({ locale, url, pageName: page.seo.title }),
    createFaqSchema({ url, faqs: page.faqs }),
  ]
```

Replace only the hardcoded FAQ heading with `{page.faqTitle}`. Preserve every existing wrapper, Tailwind class, card layout, CTA, icon and render order.

- [ ] **Step 6: Run the market content tests**

Run:

```powershell
node --experimental-strip-types --test lib/local-service-page.test.mjs
npx tsc --noEmit
```

Expected: PASS with no type errors.

- [ ] **Step 7: Commit the generalized content model**

```powershell
git add lib/local-service-page.ts lib/local-service-page.test.mjs components/local-software-page.tsx lib/route-metadata-content.ts
git commit -m "feat: add national and local software market content"
```

---

### Task 3: Türkiye ve Hatay rotalarını canonical, hreflang ve sitemap ile yayınla

**Files:**
- Create: `app/turkiye-yazilim-sirketi/page.tsx`
- Create: `app/[locale]/turkey-software-company/page.tsx`
- Create: `app/hatay-yazilim-sirketi/page.tsx`
- Create: `app/[locale]/hatay-software-company/page.tsx`
- Modify: `app/istanbul-yazilim-sirketi/page.tsx`
- Modify: `app/[locale]/istanbul-software-company/page.tsx`
- Modify: `lib/localized-route-map.ts`
- Modify: `lib/public-routes.ts`
- Modify: `lib/public-routes.test.mjs`
- Modify: `lib/metadata.test.mjs`
- Modify: `lib/seo-routes.test.mjs`

**Interfaces:**
- Consumes: `getSoftwareMarketPage(market, locale)`, `softwareMarketRoutes[market]`, `LocalSoftwarePage({ locale, market })`, `createPageMetadata`, and `getPrefixedRouteLocale`.
- Produces: Six live localized routes with unique canonical URLs and reciprocal TR/EN hreflang links.

- [ ] **Step 1: Read the installed Next.js 16.3 metadata and dynamic-route guides before editing route files**

Run:

```powershell
rg -n "generateMetadata|dynamic route|params: Promise" node_modules/next/dist/docs --glob "*.md" --glob "*.mdx"
```

Read the matching App Router metadata and dynamic segment documents. Preserve the installed-version convention where localized route `params` is a `Promise`.

- [ ] **Step 2: Add failing public-route and sitemap assertions**

In `lib/public-routes.test.mjs`, place the new route paths before the retained Istanbul route:

```js
"/turkiye-yazilim-sirketi",
"/hatay-yazilim-sirketi",
"/istanbul-yazilim-sirketi",
```

In `lib/seo-routes.test.mjs`, replace the single Istanbul assertion test with:

```js
test("sitemap publishes national and local software pages with reciprocal alternates", () => {
  const entries = buildSitemapEntries(publicRoutes, baseUrl)
  const pairs = [
    ["/turkiye-yazilim-sirketi", "/en/turkey-software-company"],
    ["/hatay-yazilim-sirketi", "/en/hatay-software-company"],
    ["/istanbul-yazilim-sirketi", "/en/istanbul-software-company"],
  ]

  for (const [trPath, enPath] of pairs) {
    const tr = entries.find(entry => entry.url === `${baseUrl}${trPath}`)
    const en = entries.find(entry => entry.url === `${baseUrl}${enPath}`)
    assert.equal(tr.alternates.languages.en, en.url)
    assert.equal(en.alternates.languages.tr, tr.url)
    assert.equal(tr.lastModified, "2026-10-05")
  }
})
```

Update the sitemap root expectation from `2026-09-25` to `2026-10-05`, and change the llms test location argument from `Istanbul, Turkey` to `Hatay, Türkiye`.

- [ ] **Step 3: Run route tests and confirm missing routes fail**

Run:

```powershell
node --experimental-strip-types --test --test-isolation=none lib/public-routes.test.mjs lib/seo-routes.test.mjs lib/metadata.test.mjs
```

Expected: FAIL because the Turkey and Hatay routes are not registered and metadata lookup only understands the Istanbul page.

- [ ] **Step 4: Register localized route pairs and sitemap entries**

Add these pairs to `lib/localized-route-map.ts`:

```ts
{ tr: "/turkiye-yazilim-sirketi", en: "/turkey-software-company" },
{ tr: "/hatay-yazilim-sirketi", en: "/hatay-software-company" },
{ tr: "/istanbul-yazilim-sirketi", en: "/istanbul-software-company" },
```

Set `siteContentRevision` in `lib/public-routes.ts` to `2026-10-05` and register:

```ts
{ path: "/turkiye-yazilim-sirketi", localizedPaths: { tr: "/turkiye-yazilim-sirketi", en: "/turkey-software-company" }, metadataKey: "turkeySoftwareCompany", llms: true, lastModified: siteContentRevision },
{ path: "/hatay-yazilim-sirketi", localizedPaths: { tr: "/hatay-yazilim-sirketi", en: "/hatay-software-company" }, metadataKey: "hataySoftwareCompany", llms: true, lastModified: siteContentRevision },
{ path: "/istanbul-yazilim-sirketi", localizedPaths: { tr: "/istanbul-yazilim-sirketi", en: "/istanbul-software-company" }, metadataKey: "istanbulSoftwareCompany", llms: true, lastModified: siteContentRevision },
```

- [ ] **Step 5: Create the four new route modules and update the two existing modules**

Use this exact Turkish route pattern for Turkey, changing only the `market` literal for Hatay:

```tsx
import { LocalSoftwarePage } from "@/components/local-software-page"
import { getSoftwareMarketPage, softwareMarketRoutes } from "@/lib/local-service-page"
import { createPageMetadata } from "@/lib/metadata"

const market = "turkey" as const
const route = softwareMarketRoutes[market]
const page = getSoftwareMarketPage(market, "tr")

export const metadata = createPageMetadata({
  locale: "tr",
  path: route.path,
  localizedPaths: route.localizedPaths,
  title: page.seo.title,
  description: page.seo.description,
  keywords: page.seo.keywords,
})

export default function TurkeySoftwareCompanyPage() {
  return <LocalSoftwarePage locale="tr" market={market} />
}
```

Use this exact localized pattern for the English route, changing only `market` and component name for Hatay and Istanbul:

```tsx
import { LocalSoftwarePage } from "@/components/local-software-page"
import { getSoftwareMarketPage, softwareMarketRoutes } from "@/lib/local-service-page"
import { getPrefixedRouteLocale } from "@/lib/locale-route"
import { createPageMetadata } from "@/lib/metadata"

const market = "turkey" as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getPrefixedRouteLocale(params)
  const route = softwareMarketRoutes[market]
  const page = getSoftwareMarketPage(market, locale)
  return createPageMetadata({ locale, path: route.path, localizedPaths: route.localizedPaths, title: page.seo.title, description: page.seo.description, keywords: page.seo.keywords })
}

export default async function TurkeySoftwareCompanyLocalizedPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getPrefixedRouteLocale(params)
  return <LocalSoftwarePage locale={locale} market={market} />
}
```

Update both Istanbul modules to pass `market="istanbul"` and to use `softwareMarketRoutes.istanbul` for metadata.

- [ ] **Step 6: Make metadata tests resolve every market route from its metadata key**

In `lib/metadata.test.mjs`, replace the Istanbul-only lookup with an explicit map:

```js
const marketByMetadataKey = {
  turkeySoftwareCompany: "turkey",
  hataySoftwareCompany: "hatay",
  istanbulSoftwareCompany: "istanbul",
}

const market = marketByMetadataKey[route.metadataKey]
const localPage = market ? getSoftwareMarketPage(market, locale) : undefined
```

Keep the existing title length, canonical, Open Graph URL, robot and hreflang assertions unchanged.

- [ ] **Step 7: Run focused SEO and type checks**

Run:

```powershell
node --experimental-strip-types --test --test-isolation=none lib/public-routes.test.mjs lib/seo-routes.test.mjs lib/metadata.test.mjs lib/local-service-page.test.mjs
npx tsc --noEmit
```

Expected: all tests PASS and TypeScript reports no errors.

- [ ] **Step 8: Commit route publication**

```powershell
git add app/turkiye-yazilim-sirketi/page.tsx app/[locale]/turkey-software-company/page.tsx app/hatay-yazilim-sirketi/page.tsx app/[locale]/hatay-software-company/page.tsx app/istanbul-yazilim-sirketi/page.tsx app/[locale]/istanbul-software-company/page.tsx lib/localized-route-map.ts lib/public-routes.ts lib/public-routes.test.mjs lib/metadata.test.mjs lib/seo-routes.test.mjs
git commit -m "feat: publish Turkey and Hatay software landing pages"
```

---

### Task 4: Tam doğrulama ve UI regresyon kontrolü

**Files:**
- Modify only if a verification failure reveals a defect in files already listed in Tasks 1-3.

**Interfaces:**
- Consumes: All updated pages, metadata, sitemap, JSON-LD and unchanged UI shell.
- Produces: A production-buildable site with verified routes and no unintended visual change.

- [ ] **Step 1: Run the complete automated test suite**

Run:

```powershell
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Expected: every command exits with code 0. Fix only concrete failures tied to this change, then rerun the failed command and the full test suite.

- [ ] **Step 2: Run application smoke tests**

Run:

```powershell
npm run test:smoke
```

Expected: all configured public routes, including the new Turkey and Hatay URLs, return successful responses.

- [ ] **Step 3: Inspect generated SEO endpoints and page source**

With the local production server running, verify:

```powershell
curl.exe -s http://127.0.0.1:3000/sitemap.xml
curl.exe -s http://127.0.0.1:3000/turkiye-yazilim-sirketi
curl.exe -s http://127.0.0.1:3000/en/turkey-software-company
curl.exe -s http://127.0.0.1:3000/hatay-yazilim-sirketi
curl.exe -s http://127.0.0.1:3000/en/hatay-software-company
curl.exe -s http://127.0.0.1:3000/istanbul-yazilim-sirketi
```

Expected:

- Sitemap contains all six market URLs and reciprocal language alternates.
- Each page has one unique title, one canonical URL and the correct localized alternate.
- JSON-LD parses and uses the same canonical page URL.
- İstanbul page says the team is based in Hatay and serves İstanbul remotely.
- No page promises rankings, fabricated office presence or unverified customer metrics.

- [ ] **Step 4: Perform desktop and mobile visual regression checks**

Open `/`, `/turkiye-yazilim-sirketi`, `/hatay-yazilim-sirketi`, `/istanbul-yazilim-sirketi` and their English equivalents at desktop and mobile widths. Confirm:

- The homepage eyebrow line is gone while the hero title, laptop animation, spacing system and CTA remain intact.
- Footer layout is unchanged and displays `Hatay, Türkiye` plus the national landing-page link.
- All market pages reuse the same existing header, card grid, content width, process cards, FAQ and CTA styling.
- There are no new overflow, layout-shift, light/dark theme or navigation issues.

- [ ] **Step 5: Review the final diff for UI scope and stale location claims**

Run:

```powershell
git diff --check
git diff --stat HEAD~3..HEAD
rg -n "İstanbul merkezli|Istanbul-based|built in Istanbul|yüz yüze keşif|in-person discovery" components lib app
```

Expected: `git diff --check` is clean. Remaining Istanbul text appears only as truthful location-targeted search content, never as the company's base or as an in-person claim. No CSS file, animation component, design token or unrelated UI component appears in the diff.

- [ ] **Step 6: Commit any verification-only corrections**

If verification required code corrections, commit only those corrections:

```powershell
git add components app lib
git commit -m "fix: complete Hatay national SEO verification"
```

If no corrections were needed, do not create an empty commit.

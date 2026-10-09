/* global AbortSignal, console, fetch, process, setTimeout */

const origin = (process.env.LIVE_SITE_ORIGIN ?? "https://adakansoftware.com").replace(/\/$/, "")
const attempts = Number(process.env.LIVE_VERIFY_ATTEMPTS ?? 4)
const retryDelayMs = Number(process.env.LIVE_VERIFY_RETRY_DELAY_MS ?? 2_000)

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function fetchWithRetry(url) {
  let lastError

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "adakan-live-deploy-verifier/1.0" },
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
      })

      if (response.ok) return response
      lastError = new Error(`${url} returned ${response.status}`)
    } catch (error) {
      lastError = error
    }

    if (attempt < attempts) await sleep(retryDelayMs * attempt)
  }

  throw lastError
}

const healthResponse = await fetchWithRetry(`${origin}/api/health`)
const health = await healthResponse.json()
if (health.ok !== true || health.status !== "ok") {
  throw new Error(`${origin}/api/health returned an unhealthy payload`)
}

const sitemapResponse = await fetchWithRetry(`${origin}/sitemap.xml`)
const sitemap = await sitemapResponse.text()
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])

if (urls.length === 0) throw new Error("The production sitemap did not contain any URLs")

for (const url of urls) {
  const response = await fetchWithRetry(url)
  const contentType = response.headers.get("content-type") ?? ""
  if (!contentType.includes("text/html")) {
    throw new Error(`${url} returned an unexpected content type: ${contentType || "missing"}`)
  }

  const html = await response.text()
  if (!html.includes("</html>")) throw new Error(`${url} did not return a complete HTML document`)
}

console.log(`Live verification passed for ${urls.length} sitemap routes and ${origin}/api/health`)

/* global Response */
import manifest from '../.free-worker/asset-manifest.json'
import { createAssetHandler } from './router.ts'
import { handleApiRequest } from './api.ts'
import { runScheduledContactReplay } from '../lib/server/scheduled-contact-replay.mjs'

const fetchAsset = createAssetHandler(manifest, handleApiRequest)
export default {
  async fetch(request, environment) {
    try { return await fetchAsset(request, environment) }
    catch { return new Response('Service temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }) }
  },
  async scheduled(_controller, environment) {
    return runScheduledContactReplay(environment, handleApiRequest)
  },
}

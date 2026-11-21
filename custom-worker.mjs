import handler from "./.open-next/worker.js"
import { runScheduledContactReplay } from "./lib/server/scheduled-contact-replay.mjs"

export default {
  fetch: handler.fetch,
  async scheduled(_controller, environment, context) {
    return runScheduledContactReplay(environment, (request) => handler.fetch(request, environment, context))
  },
}

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js"

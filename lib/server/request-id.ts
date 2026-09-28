import { randomUUID } from "node:crypto"

const SAFE_REQUEST_ID = /^[A-Za-z0-9._:-]{1,120}$/u

export function createRequestId(request: Request) {
  const incomingId = request.headers.get("x-request-id")?.trim()
  return incomingId && SAFE_REQUEST_ID.test(incomingId) ? incomingId : randomUUID()
}

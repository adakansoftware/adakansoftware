export function getPublicHealthPayload(ready: boolean) {
  return {
    ok: ready,
    status: ready ? "ok" : "degraded",
  } as const
}


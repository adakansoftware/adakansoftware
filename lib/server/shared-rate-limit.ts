import { createHmac } from "node:crypto"

import { getNeonSql } from "../neon.ts"
import { hasMinimumSecretLength } from "./secret-policy.ts"

type Query = (query: string, parameters: unknown[]) => Promise<Record<string, unknown>[]>

type SharedRateLimitEnvironment = {
  NODE_ENV?: string
  DATABASE_URL?: string
  ADMIN_SESSION_SECRET?: string
}

const consumeQuery = `
  insert into security_rate_limits (scope, identifier_hash, window_started_at, request_count)
  values ($1, $2, to_timestamp($3 / 1000.0), 1)
  on conflict (scope, identifier_hash) do update set
    request_count = case
      when security_rate_limits.window_started_at <= to_timestamp($4 / 1000.0) then 1
      else security_rate_limits.request_count + 1
    end,
    window_started_at = case
      when security_rate_limits.window_started_at <= to_timestamp($4 / 1000.0) then to_timestamp($3 / 1000.0)
      else security_rate_limits.window_started_at
    end
  returning request_count, window_started_at
`

function identifierHash(secret: string, scope: string, identifier: string) {
  return createHmac("sha256", secret).update(`${scope}\n${identifier}`).digest("hex")
}

function rowCount(row: Record<string, unknown> | undefined) {
  const value = typeof row?.request_count === "number"
    ? row.request_count
    : Number.parseInt(String(row?.request_count ?? "0"), 10)
  return Number.isFinite(value) ? value : 0
}

function rowWindowStart(row: Record<string, unknown> | undefined, fallback: number) {
  const value = row?.window_started_at
  const parsed = value instanceof Date ? value.getTime() : Date.parse(String(value ?? ""))
  return Number.isFinite(parsed) ? parsed : fallback
}

export function hasSharedRateLimitConfiguration(environment: SharedRateLimitEnvironment = process.env) {
  return environment.NODE_ENV === "production"
    && Boolean(environment.DATABASE_URL?.trim())
    && hasMinimumSecretLength(environment.ADMIN_SESSION_SECRET)
}

export function createSharedRateLimitStore({ query, secret }: { query: Query; secret: string }) {
  if (!hasMinimumSecretLength(secret)) {
    throw new Error("A strong rate-limit signing secret is required")
  }

  const key = (scope: string, identifier: string) => identifierHash(secret, scope, identifier)

  return {
    async consume(scope: string, identifier: string, windowMs: number, maxRequests: number, now = Date.now()) {
      const rows = await query(consumeQuery, [scope, key(scope, identifier), now, now - windowMs])
      const count = rowCount(rows[0])
      const windowStartedAt = rowWindowStart(rows[0], now)
      return {
        limited: count > maxRequests,
        retryAfterSeconds: Math.max(1, Math.ceil((windowStartedAt + windowMs - now) / 1000)),
      }
    },

    async isLimited(scope: string, identifier: string, windowMs: number, maxRequests: number, now = Date.now()) {
      const rows = await query(
        `select request_count, window_started_at
         from security_rate_limits
         where scope = $1 and identifier_hash = $2
           and window_started_at > to_timestamp($3 / 1000.0)`,
        [scope, key(scope, identifier), now - windowMs],
      )
      return rowCount(rows[0]) >= maxRequests
    },

    async clear(scope: string, identifier: string) {
      await query(
        "delete from security_rate_limits where scope = $1 and identifier_hash = $2",
        [scope, key(scope, identifier)],
      )
    },
  }
}

export function getSharedRateLimitStore() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? ""
  const sql = getNeonSql()
  return createSharedRateLimitStore({
    secret,
    query: (query, parameters) => sql.query(query, parameters) as Promise<Record<string, unknown>[]>,
  })
}

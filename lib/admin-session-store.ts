import { createHash } from "node:crypto"

import { getNeonSql } from "./neon.ts"

type Query = (query: string, parameters: unknown[]) => Promise<Record<string, unknown>[]>

function sessionIdHash(sessionId: string) {
  return createHash("sha256").update(sessionId).digest("hex")
}

export function createAdminSessionStore(query: Query) {
  return {
    async create(sessionId: string, email: string, expiresAt: number) {
      await query(
        `with expired as (
           delete from admin_sessions where expires_at <= now()
         )
         insert into admin_sessions (session_id_hash, email, expires_at)
         values ($1, $2, to_timestamp($3 / 1000.0))`,
        [sessionIdHash(sessionId), email, expiresAt],
      )
    },

    async isActive(sessionId: string, now: number) {
      const rows = await query(
        `select exists(
           select 1 from admin_sessions
           where session_id_hash = $1 and revoked_at is null
             and expires_at > to_timestamp($2 / 1000.0)
         ) as active`,
        [sessionIdHash(sessionId), now],
      )
      return rows[0]?.active === true
    },

    async revoke(sessionId: string) {
      await query(
        "update admin_sessions set revoked_at = now() where session_id_hash = $1 and revoked_at is null",
        [sessionIdHash(sessionId)],
      )
    },
  }
}

export function getAdminSessionStore() {
  const sql = getNeonSql()
  return createAdminSessionStore(
    (query, parameters) => sql.query(query, parameters) as Promise<Record<string, unknown>[]>,
  )
}

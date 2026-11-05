import { randomUUID } from "node:crypto"

export const CONTACT_RETENTION_MONTHS = 24 as const

type QueryValue = string | number | boolean | null

export type ContactRetentionSql = {
  query(statement: string, values?: QueryValue[]): Promise<Record<string, unknown>[]>
}

export type ContactRetentionPreview = {
  eligibleCount: number
  heldCount: number
  oldestEligibleAt: string | null
}

export type ContactRetentionResult = ContactRetentionPreview & {
  runId: string
  deletedCount: number
  executedAt: string
}

function toCount(value: unknown) {
  const count = typeof value === "number" ? value : Number(value)
  return Number.isFinite(count) && count >= 0 ? Math.trunc(count) : 0
}

function toIsoTimestamp(value: unknown) {
  if (value === null || value === undefined) return null
  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export async function previewExpiredContactRequests(
  sql: ContactRetentionSql,
  now = new Date(),
): Promise<ContactRetentionPreview> {
  const rows = await sql.query(
    `select
       count(*) filter (where retention_hold = false)::integer as eligible_count,
       count(*) filter (where retention_hold = true)::integer as held_count,
       min(retention_until) filter (where retention_hold = false) as oldest_eligible_at
     from contact_requests
     where retention_until <= $1`,
    [now.toISOString()],
  )
  const row = rows[0] ?? {}
  return {
    eligibleCount: toCount(row.eligible_count),
    heldCount: toCount(row.held_count),
    oldestEligibleAt: toIsoTimestamp(row.oldest_eligible_at),
  }
}

export async function eraseExpiredContactRequests(
  sql: ContactRetentionSql,
  now = new Date(),
  actor = "kvkk-cleanup-cli",
): Promise<ContactRetentionResult> {
  const runId = randomUUID()
  const executedAt = now.toISOString()
  const rows = await sql.query(
    `with due as (
       select
         count(*) filter (where retention_hold = false)::integer as eligible_count,
         count(*) filter (where retention_hold = true)::integer as held_count,
         min(retention_until) filter (where retention_hold = false) as oldest_eligible_at
       from contact_requests
       where retention_until <= $1
     ), deleted as (
       delete from contact_requests
       where retention_until <= $1 and retention_hold = false
       returning 1
     ), deletion_count as (
       select count(*)::integer as deleted_count from deleted
     ), audit as (
       insert into contact_deletion_audits
         (run_id, actor, reason, deleted_count, executed_at, expires_at)
       select $2::uuid, $3, 'retention_expired', deletion_count.deleted_count, $1, $1::timestamptz + interval '3 years'
       from deletion_count
       returning run_id, deleted_count, executed_at
     )
     select due.eligible_count, due.held_count, due.oldest_eligible_at,
            audit.run_id, audit.deleted_count, audit.executed_at
     from due cross join audit`,
    [executedAt, runId, actor],
  )
  const row = rows[0]
  if (!row) throw new Error("Contact retention cleanup returned no result")

  return {
    eligibleCount: toCount(row.eligible_count),
    heldCount: toCount(row.held_count),
    oldestEligibleAt: toIsoTimestamp(row.oldest_eligible_at),
    runId: String(row.run_id ?? runId),
    deletedCount: toCount(row.deleted_count),
    executedAt: toIsoTimestamp(row.executed_at) ?? executedAt,
  }
}

import assert from "node:assert/strict"
import test from "node:test"

import { createAdminSessionStore } from "./admin-session-store.ts"

test("stores only a one-way hash of an admin session identifier", async () => {
  const calls = []
  const store = createAdminSessionStore(async (query, parameters) => {
    calls.push({ query, parameters })
    return []
  })

  await store.create("visible-session-id", "admin@example.com", 10_000)

  assert.equal(calls[0].parameters.includes("visible-session-id"), false)
  assert.match(calls[0].parameters[0], /^[a-f0-9]{64}$/u)
})

test("checks and revokes sessions by their one-way identifier hash", async () => {
  const calls = []
  const store = createAdminSessionStore(async (query, parameters) => {
    calls.push({ query, parameters })
    return query.includes("select exists") ? [{ active: true }] : []
  })

  assert.equal(await store.isActive("session-id", 5_000), true)
  await store.revoke("session-id")

  assert.equal(calls[0].parameters[0], calls[1].parameters[0])
  assert.equal(calls.some(({ parameters }) => parameters.includes("session-id")), false)
})

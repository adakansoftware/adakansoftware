/* global process */
import assert from "node:assert/strict"
import test from "node:test"

import {
  getContactRuntimeConfigurationIssues,
  getContactRuntimeMode,
  isContactDeliveryPipelineConfigured,
  isContactRuntimeConfigurationValid,
} from "./contact-runtime-config.ts"

const strongSecret = "a".repeat(32)

function withEnvironment(values, callback) {
  const names = [
    "ADMIN_SESSION_SECRET",
    "CONTACT_ADMIN_SIGNING_SECRET",
    "CONTACT_STATE_BACKEND",
    "DATABASE_URL",
    "REDIS_URL",
    "RESEND_API_KEY",
    "RESEND_FROM_DOMAIN",
  ]
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]))

  for (const name of names) delete process.env[name]
  Object.assign(process.env, values)

  try {
    return callback()
  } finally {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name]
      else process.env[name] = previous[name]
    }
  }
}

test("accepts the durable database inbox as a healthy production contact mode", () => {
  withEnvironment({
    DATABASE_URL: "postgresql://database.neon.tech/adakan",
    ADMIN_SESSION_SECRET: strongSecret,
  }, () => {
    assert.equal(getContactRuntimeMode("production"), "database")
    assert.equal(isContactRuntimeConfigurationValid("production"), true)
    assert.equal(isContactDeliveryPipelineConfigured("production"), false)
    assert.deepEqual(getContactRuntimeConfigurationIssues("production"), [])
  })
})

test("accepts the email outbox only when its distributed state is complete", () => {
  withEnvironment({
    DATABASE_URL: "postgresql://database.neon.tech/adakan",
    RESEND_API_KEY: ["re", "_fixture-key"].join(""),
    RESEND_FROM_DOMAIN: "adakansoftware.com",
    CONTACT_ADMIN_SIGNING_SECRET: strongSecret,
    CONTACT_STATE_BACKEND: "redis",
    REDIS_URL: "rediss://redis.upstash.io/0",
  }, () => {
    assert.equal(getContactRuntimeMode("production"), "email")
    assert.equal(isContactDeliveryPipelineConfigured("production"), true)
    assert.equal(isContactRuntimeConfigurationValid("production"), true)
  })
})

test("rejects an email outbox that cannot persist inquiries to the database", () => {
  withEnvironment({
    RESEND_API_KEY: ["re", "_fixture-key"].join(""),
    RESEND_FROM_DOMAIN: "adakansoftware.com",
    CONTACT_ADMIN_SIGNING_SECRET: strongSecret,
    CONTACT_STATE_BACKEND: "redis",
    REDIS_URL: "rediss://redis.upstash.io/0",
  }, () => {
    assert.equal(getContactRuntimeMode("production"), "invalid")
    assert.equal(isContactDeliveryPipelineConfigured("production"), false)
  })
})

test("rejects production contact handling when neither durable mode is configured", () => {
  withEnvironment({}, () => {
    assert.equal(getContactRuntimeMode("production"), "invalid")
    assert.equal(isContactRuntimeConfigurationValid("production"), false)
    assert.ok(getContactRuntimeConfigurationIssues("production").length > 0)
  })
})

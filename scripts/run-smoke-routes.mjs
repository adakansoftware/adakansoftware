/* global URL, fetch, process, setTimeout */

import { spawn } from "node:child_process"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { once } from "node:events"
import { fileURLToPath } from "node:url"

import { createSmokeEnvironment } from "./smoke-environment.mjs"

const port = process.env.SMOKE_PORT ?? "3101"
const baseUrl = `http://127.0.0.1:${port}`
const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url))
const serverMode = process.argv.includes("--production") || process.env.SMOKE_SERVER_MODE === "production" ? "start" : "dev"
const testScript = process.argv.slice(2).find((argument) => !argument.startsWith("--")) ?? process.env.SMOKE_TEST_SCRIPT ?? "./test-smoke-routes.mjs"
// Validate opt-in before allocating resources or starting a server.
createSmokeEnvironment(process.env, "", serverMode)
const stateDirectory = await mkdtemp(join(tmpdir(), "adakan-smoke-"))
const environment = createSmokeEnvironment(process.env, stateDirectory, serverMode)

const server = spawn(process.execPath, [nextBin, serverMode, "--hostname", "127.0.0.1", "--port", port], {
  env: environment,
  stdio: "inherit",
})

async function waitForServer() {
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Smoke server exited with code ${server.exitCode}`)
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        headers: serverMode === "start" ? { "x-forwarded-proto": "https" } : undefined,
      })
      if (response.ok) return
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(`Smoke server did not become ready at ${baseUrl}`)
}

try {
  await waitForServer()
  const test = spawn(process.execPath, [fileURLToPath(new URL(testScript, import.meta.url))], {
    env: { ...environment, SMOKE_BASE_URL: baseUrl },
    stdio: "inherit",
  })
  const [exitCode] = await once(test, "exit")
  process.exitCode = exitCode ?? 1
} finally {
  if (server.exitCode === null && server.signalCode === null) {
    const closed = once(server, "close")
    server.kill("SIGTERM")
    await closed
  }
  // Only remove the unique directory created by mkdtemp above.
  await rm(stateDirectory, { recursive: true, force: true, maxRetries: 3 })
}

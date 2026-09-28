import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import process, { loadEnvFile } from "node:process"
import { fileURLToPath, URL } from "node:url"

const devEnvPath = fileURLToPath(new URL("../.dev.vars", import.meta.url))
if (existsSync(devEnvPath)) loadEnvFile(".dev.vars")

const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url))
const child = spawn(process.execPath, [nextBin, ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit",
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal))
}

child.on("error", (error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`)
  process.exitCode = 1
})

child.on("exit", (code) => {
  process.exitCode = code ?? 1
})

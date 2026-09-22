/* global process, URL */
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL("../../", import.meta.url))

// Load the real route/service code with only external I/O replaced by each test.
// Each loader has isolated module state and an explicit environment, never .env.local.
export function loadTypescript({ overrides = {}, env = {}, cwd = root } = {}) {
  const cache = new Map()
  function load(filename) {
    const file = resolve(root, filename)
    if (cache.has(file)) return cache.get(file).exports
    const loadedModule = { exports: {} }
    cache.set(file, loadedModule)
    const source = ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
      fileName: file,
    }).outputText
    function localRequire(name) {
      if (Object.hasOwn(overrides, name)) return overrides[name]
      if (name.startsWith("@/")) return load(`${name.slice(2)}.ts`)
      if (name.startsWith(".")) return load(resolve(dirname(file), name.endsWith(".ts") ? name : `${name}.ts`))
      return require(name)
    }
    new Function("require", "module", "exports", "process", source)(
      localRequire, loadedModule, loadedModule.exports,
      { env: { NODE_ENV: "development", ...env }, cwd: () => cwd, platform: process.platform },
    )
    return loadedModule.exports
  }
  return load
}

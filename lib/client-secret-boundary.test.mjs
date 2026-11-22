import assert from "node:assert/strict"
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { dirname, join, resolve, relative } from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"
import ts from "typescript"

const root = fileURLToPath(new globalThis.URL("../", import.meta.url))
const allowed = new Set(["NODE_ENV", "NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_WHATSAPP_NUMBER", "NEXT_PUBLIC_TURNSTILE_SITE_KEY"])

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? files(path) : /\.[jt]sx?$/.test(path) ? [path] : []
  })
}

function modulePath(from, specifier) {
  const base = specifier.startsWith("@/") ? resolve(root, specifier.slice(2))
    : specifier.startsWith(".") ? resolve(dirname(from), specifier) : null
  if (!base) return null
  return [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, join(base, "index.ts"), join(base, "index.tsx")]
    .find((path) => /\.[jt]sx?$/.test(path) && existsSync(path))
}

test("client import graphs cannot read server environment secrets", () => {
  const sources = new Map()
  const source = (path) => {
    if (!sources.has(path)) sources.set(path, ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true))
    return sources.get(path)
  }
  const entries = ["app", "components", "hooks", "lib"].flatMap((path) => files(join(root, path)))
    .filter((path) => source(path).statements.some((statement) => ts.isExpressionStatement(statement)
      && ts.isStringLiteral(statement.expression) && statement.expression.text === "use client"))
  assert.ok(entries.length > 0)
  const visited = new Set()
  const violations = []
  function visit(path) {
    if (visited.has(path)) return
    visited.add(path)
    function walk(node) {
      if (ts.isPropertyAccessExpression(node) && node.getText() === "process.env"
        && !((ts.isPropertyAccessExpression(node.parent) || ts.isElementAccessExpression(node.parent))
          && node.parent.expression === node)) {
        violations.push(`${relative(root, path)}: whole environment access`)
      }
      if ((ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node))
        && node.expression.getText() === "process.env") {
        const name = ts.isPropertyAccessExpression(node) ? node.name.text
          : ts.isStringLiteral(node.argumentExpression) ? node.argumentExpression.text : "dynamic access"
        if (!allowed.has(name)) violations.push(`${relative(root, path)}: ${name}`)
      }
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        const typeOnly = node.isTypeOnly || node.importClause?.isTypeOnly
        if (!typeOnly && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
          const dependency = modulePath(path, node.moduleSpecifier.text)
          if (dependency) visit(dependency)
        }
      }
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
        && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
        const dependency = modulePath(path, node.arguments[0].text)
        if (dependency) visit(dependency)
      }
      ts.forEachChild(node, walk)
    }
    walk(source(path))
  }
  for (const entry of entries) visit(entry)
  assert.deepEqual(violations, [], "Server secrets are reachable from a client component")
})

/* global process, Request, setTimeout */
import assert from "node:assert/strict";
import { test } from "node:test";
import { build } from "esbuild";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const bundle = await build({
  stdin: { contents: `export * from './worker/api.ts'; export * from './worker/runtime/headers.ts'; export * from './worker/runtime/server.ts'; export * from './worker/runtime/dispatch.ts';`, resolveDir: process.cwd(), loader: "ts" },
  bundle: true, write: false, platform: "node", format: "cjs", packages: "external",
  alias: { "@": process.cwd(), "next/headers": resolve("worker/runtime/headers.ts"), "next/server": resolve("worker/runtime/server.ts"), "next/cache": resolve("worker/runtime/cache.ts") },
});
const testModule = { exports: {} };
new Function("require", "module", "exports", bundle.outputFiles[0].text)(createRequire(import.meta.url), testModule, testModule.exports);
const runtime = testModule.exports;

test("parallel requests keep cookie and header contexts isolated", async () => {
  await Promise.all(Array.from({ length: 30 }, (_, index) => runtime.withRequestContext(new Request("https://example.com", { headers: { cookie: `session=${index}`, "x-test": String(index) } }), async () => {
    await new Promise(resolve => setTimeout(resolve, index % 3));
    assert.equal((await runtime.cookies()).get("session").value, String(index));
    assert.equal((await runtime.headers()).get("x-test"), String(index));
  })));
  await assert.rejects(runtime.cookies(), /request context/i);
});

test("cookie adapter preserves encoded values and tolerates malformed unrelated cookies", async () => {
  await runtime.withRequestContext(new Request("https://example.com", { headers: { cookie: "broken=%zz; token=abc%3Ddef" } }), async () => {
    assert.equal((await runtime.cookies()).get("token").value, "abc=def");
  });
});

test("response cookie serialization preserves session security and multiple cookies", () => {
  const response = runtime.NextResponse.json({ ok: true });
  response.cookies.set("__Host-admin", "value=", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 28800 });
  response.cookies.set("other", "second");
  const cookies = response.headers.getSetCookie();
  assert.equal(cookies.length, 2);
  assert.match(cookies[0], /^__Host-admin=value%3D;/);
  for (const flag of ["HttpOnly", "Secure", "SameSite=Strict", "Path=/", "Max-Age=28800"]) assert.ok(cookies[0].includes(flag));
  response.cookies.delete("__Host-admin");
  assert.match(response.headers.getSetCookie()[0], /Expires=Thu, 01 Jan 1970/);
});

test("existing private routes reject anonymous requests", async () => {
  for (const path of ["/api/admin/session", "/api/admin/content", "/api/admin/contact-requests", "/api/contact/state", "/api/contact/replay/cron"]) {
    const response = await runtime.handleApiRequest(new Request(`https://example.com${path}`));
    assert.equal(response.status, 401, path);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("router handles methods, HEAD, unknown APIs and public paths", async () => {
  assert.equal(await runtime.handleApiRequest(new Request("https://example.com/en")), null);
  assert.equal((await runtime.handleApiRequest(new Request("https://example.com/api/missing"))).status, 404);
  const denied = await runtime.handleApiRequest(new Request("https://example.com/api/admin/login", { method: "GET" }));
  assert.equal(denied.status, 405);
  assert.equal(denied.headers.get("allow"), "OPTIONS, POST");
  const head = await runtime.handleApiRequest(new Request("https://example.com/api/admin/session", { method: "HEAD" }));
  assert.equal(head.status, 401);
  assert.equal(await head.text(), "");
  const options = await runtime.handleApiRequest(new Request("https://example.com/api/admin/login", { method: "OPTIONS" }));
  assert.equal(options.status, 204);
});

test("unexpected handler errors return generic uncached responses", async () => {
  const response = await runtime.dispatchRoute(new Request("https://example.com/api/test"), { GET() { throw new Error("secret-value-in-error"); } });
  assert.equal(response.status, 500);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal((await response.text()).includes("secret-value"), false);
});


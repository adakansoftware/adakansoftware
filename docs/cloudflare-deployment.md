# Cloudflare deployment

The Worker name is `adakansoftware`. This is separate from the public domain
`adakansoftware.com`. The `WORKER_SELF_REFERENCE` service must use the same name.

The previous build auto-generated a service reference to
`adakan-software-website` while deploying `adakansoftwarewebsite`, which caused
Cloudflare error 10143. The configuration is now committed rather than generated
during deployment.

## Workers Builds settings

- Connect this repository to the Worker named `adakansoftware`.
- Build command: leave empty; Wrangler runs the configured OpenNext build.
- Deploy command: `npx wrangler deploy`.
- If the panel requires a build command, `npm run build` is safe but repeats the Next.js build.
- Do not override the Worker name with `--name adakansoftwarewebsite`.
- Keep the custom domain `adakansoftware.com` attached to the intended Worker.

For a local build-and-deploy, use `npm run deploy`; Wrangler runs the configured
OpenNext build first. `npm run preview:cloudflare` runs a local Workers preview.

The R2 bucket name is deliberately preserved from the existing deployment log:
`adakan-software-website-opennext-cache`. R2 names do not need to match Worker
names. Configure application secrets in Cloudflare, never in `wrangler.jsonc`.
The contact API requires its production shared state backend and credentials;
a successful Worker build does not validate external database or email services.

Reference: https://opennext.js.org/cloudflare/get-started

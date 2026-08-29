# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (runs SSR code inside the Workers runtime; reads credentials from `.dev.vars`)
- `npm run build` — production build to `dist/`
- `npm run preview` — build then serve locally via `wrangler dev` (also reads `.dev.vars`)
- `npm run deploy` — build then `wrangler deploy` to Cloudflare Workers

There are no tests or linters configured.

## Architecture

Single-page Astro site (SSR, `output: 'server'`, `@astrojs/cloudflare` adapter) deployed to Cloudflare Workers, serving one protected HTML document behind HTTP Basic Auth.

- `src/content/SCLARC_Report_Writing_Course.html` — the entire site content, a self-contained HTML document. It is imported as a raw string, **not** rendered as an Astro template: its CSS braces would break Astro's expression parser, and placing it in `public/` would serve it as a static asset without running middleware, bypassing auth.
- `src/pages/index.ts` — the only route; an endpoint returning the raw HTML with `Content-Type: text/html`.
- `src/middleware.ts` — enforces Basic Auth on every request. Credentials are read via `import { env } from 'cloudflare:workers'` (Astro v6+ removed `locals.runtime.env`). Do **not** fall back to `import.meta.env` for secrets — those get inlined into the bundle at build time. Comparison is timing-safe. Missing credentials → 500, wrong/absent auth → 401 with `WWW-Authenticate`.
- `session: false` in `astro.config.mjs` — without it the adapter auto-requires a `SESSION` KV namespace binding at deploy time.

## Credentials

`BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD`:

- Locally: `.dev.vars` (gitignored; template in `.dev.vars.example`).
- Production: Secrets on the Worker (Cloudflare dashboard → the Worker → Settings → Variables and Secrets, type "Secret"), or `npx wrangler secret put <NAME>`.

## Deployment

Cloudflare Workers Builds (git-connected): build command `npm run build`, deploy command `npx wrangler deploy`. The adapter's Vite plugin writes the real worker config to `dist/server/wrangler.json` and a redirect in `.wrangler/deploy/config.json`, so plain `wrangler deploy` from the repo root picks it up; the root `wrangler.jsonc` intentionally has no `main`.

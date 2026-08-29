# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (runs SSR code inside the Workers runtime; reads credentials from `.dev.vars`)
- `npm run build` — production build to `dist/`
- `npm run preview` — build then serve locally via `wrangler dev` (also reads `.dev.vars`)
- `npm run deploy` — build then `wrangler deploy` to Cloudflare Workers

There are no tests or linters configured.

## Architecture

Astro site (SSR, `output: 'server'`, `@astrojs/cloudflare` adapter) deployed to Cloudflare Workers, serving self-contained HTML course documents behind HTTP Basic Auth.

- `src/content/*.html` — the course content, self-contained HTML documents. Each is imported as a raw string, **not** rendered as an Astro template: their CSS braces would break Astro's expression parser, and placing them in `public/` would serve them as static assets without running middleware, bypassing auth.
- `src/pages/psych-writing.ts` — serves `SCLARC_Report_Writing_Course.html` (psych report writing training).
- `src/pages/onboarding.ts` — serves `CoCo_Onboarding_Course.html` (doctoral practicum onboarding training).
- `src/pages/index.ts` — landing page with links to both courses (inline HTML string, no content file).
- All routes are endpoints returning raw HTML with `Content-Type: text/html`.
- `src/middleware.ts` — enforces Basic Auth on every request. Credentials are read via `import { env } from 'cloudflare:workers'` (Astro v6+ removed `locals.runtime.env`). Do **not** fall back to `import.meta.env` for secrets — those get inlined into the bundle at build time. Comparison is timing-safe. Missing credentials → 500, wrong/absent auth → 401 with `WWW-Authenticate`.
- `session: false` in `astro.config.mjs` — without it the adapter auto-requires a `SESSION` KV namespace binding at deploy time.

## Credentials

`BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD`:

- Locally: `.dev.vars` (gitignored; template in `.dev.vars.example`).
- Production: Secrets on the Worker (Cloudflare dashboard → the Worker → Settings → Variables and Secrets), or `npx wrangler secret put <NAME>`.
- Both must be type **Secret**, not Text: `wrangler deploy` treats its config as the source of truth for plain-text vars and wipes dashboard-set Text variables on every deploy; encrypted Secrets survive. If the site returns 500 "Server misconfigured", a deploy has likely wiped a Text-typed variable.

## Deployment

Production is `https://cocotraining.org`, a Workers custom domain on the `cocotraining` Worker (zone `cocotraining.org`). The domain is managed in the Cloudflare dashboard (Worker → Domains), not in `wrangler.jsonc`, and persists across deploys. The `workers.dev` URLs are disabled.

Deploys are automatic: Cloudflare Workers Builds (git-connected to `curtgadget/cocotraining`) runs on every push to `main` — build command `npm run build`, deploy command `npx wrangler deploy`. The adapter's Vite plugin writes the real worker config to `dist/server/wrangler.json` and a redirect in `.wrangler/deploy/config.json`, so plain `wrangler deploy` from the repo root picks it up; the root `wrangler.jsonc` intentionally has no `main`.

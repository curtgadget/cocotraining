# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (reads credentials from `.env`)
- `npm run build` — production build to `dist/`
- `npm start` — run the built server (`node ./dist/server/entry.mjs`); requires `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` in the environment (not auto-loaded from `.env`)

There are no tests or linters configured.

## Architecture

Single-page Astro site (SSR, `output: 'server'`, Node standalone adapter) that serves one protected HTML document behind HTTP Basic Auth.

- `src/content/SCLARC_Report_Writing_Course.html` — the entire site content, a self-contained HTML document. It is imported as a raw string, **not** rendered as an Astro template: its CSS braces would break Astro's expression parser, and placing it in `public/` would bypass auth (the Node adapter serves `public/` assets without running middleware).
- `src/pages/index.ts` — the only route; an endpoint returning the raw HTML with `Content-Type: text/html`.
- `src/middleware.ts` — enforces Basic Auth on every request. Credentials come from `process.env` first, then `import.meta.env` (dev fallback). Comparison is timing-safe. Missing credentials → 500, wrong/absent auth → 401 with `WWW-Authenticate`.

`.env` holds real credentials and is gitignored; `.env.example` documents the required variables.

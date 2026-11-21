# Deployment

The app is a fully static SPA — any static host works. Cloudflare Pages is the primary target.

**Live deployment:** https://slash-platinum-demo.pages.dev (project `slash-platinum-demo`, branch `main`, production environment)

## Cloudflare Pages (Direct Upload)

```bash
# 1. build
pnpm build

# 2. auth
export CLOUDFLARE_API_TOKEN="<your token>"
export CLOUDFLARE_ACCOUNT_ID="<account id>"

# 3. deploy
wrangler pages deploy dist --project-name=slash-platinum-demo --branch=main
```

The project URL follows the pattern `https://<project-name>.pages.dev`.

### First-time project creation

Projects can be created through the API or the dashboard. Via API:

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"slash-platinum-demo","production_branch":"main"}'
```

## Routing & caching

Two files in `public/` are copied verbatim into the build output and are honoured by Pages:

`public/_redirects`
```
/*  /index.html  200
```
Required — the app uses history-based routing, so `/platinum/cards` must serve the SPA shell instead of 404ing.

`public/_headers`
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/build/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

`/build/*` holds the fonts, `/assets/*` the hashed JS/CSS — both are content-addressed, so they are safe to cache forever.

## Other hosts

| Host | Notes |
| --- | --- |
| Netlify | `dist` as publish dir; add a `/* /index.html 200` redirect in `_redirects` |
| Vercel | `outputDirectory: dist`; SPA rewrite via `vercel.json` `rewrites` |
| GitHub Pages | `dist` to `gh-pages`; `base` must be set in `vite.config.ts` for sub-path hosting |
| Nginx | `try_files $uri $uri/ /index.html;` plus the `_headers` equivalents as `add_header` rules |

## Local preview of the production build

```bash
pnpm build
pnpm preview      # http://localhost:4173/platinum
```

## Notes

- The build output is ~12 MB, of which 4.7 MB is the font set (29 `.ttf` files) and ~1.1 MB is the token CSS. Fonts are served from `/build/fonts` and `/assets/fonts` to match the paths baked into the reused stylesheet — moving them means editing the `@font-face` URLs in `src/styles/slash.css`.
- No environment variables are required at runtime: the app ships with a seeded demo persona and stores state in `localStorage`.
- If a bundler native module fails to load on macOS with a hardened-runtime Node build, re-sign it:
  ```bash
  codesign --force -s - node_modules/.pnpm/@rollup+rollup-darwin-arm64@*/node_modules/@rollup/rollup-darwin-arm64/rollup.darwin-arm64.node
  ```
  `pnpm dev` is unaffected.

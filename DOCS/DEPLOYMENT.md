# Deploying MathPivot to practice.mathpivot.com

Single-domain deployment: all courses (Calculus, Math 1 EOC, Math 3 EOC, Math 6–8 EOG)
are served from one app; users switch courses via the in-app course picker.

## Architecture

- One Node process serves everything: the Hono/tRPC API (`/api/trpc/*`) and the
  built frontend static files with SPA fallback (`api/boot.ts` + `api/lib/vite.ts`).
- `pnpm build` produces:
  - `dist/public/` — Vite frontend bundle
  - `dist/boot.js` — esbuild-bundled production server
- `pnpm start` runs `NODE_ENV=production node dist/boot.js` on `PORT` (default 3000).
  (That script syntax is bash; on Windows use `set NODE_ENV=production&& node dist/boot.js`
  or cross-env. Linux hosts are unaffected.)

## Required environment variables

See [.env.example](../.env.example). In production the server refuses to boot without:

| Variable | Source |
|---|---|
| `DATABASE_URL` | Neon dashboard → Connection string (pooled) |
| `CLERK_SECRET_KEY` | Clerk dashboard → API keys |
| `CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API keys |
| `VITE_CLERK_PUBLISHABLE_KEY` | Same value; baked into the frontend **at build time** |

`STRIPE_*` and `APP_URL` are reserved placeholders — optional, nothing reads them yet.

## Hosting options

Any Node 20+ host that can run a long-lived process works.

### Option A — Render / Railway / Fly.io (simplest)

1. Connect the GitHub repo `emkwambe/practice-mathpivot`.
2. Build command: `pnpm install && pnpm build`
3. Start command: `pnpm start`
4. Set the env vars above in the host's dashboard.
5. The host assigns a TLS-terminating URL; point DNS at it (below).

### Option B — VPS (full control)

```bash
git clone https://github.com/emkwambe/practice-mathpivot.git
cd practice-mathpivot
corepack enable && pnpm install
cp .env.example .env   # fill in real values
pnpm build
NODE_ENV=production PORT=3000 node dist/boot.js   # or: pnpm start
```

Keep it alive with systemd or pm2 (`pm2 start dist/boot.js --name mathpivot --env production`).
Put Caddy or nginx in front for TLS on 443 → localhost:3000.

Caddy example:

```
practice.mathpivot.com {
    reverse_proxy 127.0.0.1:3000
}
```

## DNS

In the mathpivot.com DNS zone (wherever the domain is registered):

| Type | Name | Value |
|---|---|---|
| CNAME | `practice` | your host's assigned hostname (e.g. `your-app.onrender.com`) |

If the host requires an apex/ALIAS instead, follow their custom-domain instructions —
they will give you the exact record to create.

## Clerk configuration for the new domain

1. Clerk dashboard → your application → **Domains**: add `practice.mathpivot.com`.
2. If using a **production** Clerk instance (recommended for a live site), switch all
   three keys from `*_test_*` to the live `pk_live_…` / `sk_live_…` values.
3. Add `https://practice.mathpivot.com` to allowed redirect URLs if sign-in flows
   redirect after auth.

## Database

1. Neon: create the production database, copy the pooled connection string into `DATABASE_URL`.
2. Apply schema: `pnpm db:push` (or `pnpm db:migrate` if using generated migrations).
3. Auth-gated endpoints read the Clerk user id from the `x-clerk-user-id` header
   (`api/context.ts`) — practice/generation endpoints are public and work without login.

## Pre-deploy checklist

- [ ] `pnpm run check` — typecheck passes
- [ ] `pnpm verify:full` — all generators produce correct answers (also runs in CI on every push via `.github/workflows/verify.yml`)
- [ ] `pnpm build` succeeds
- [ ] Smoke test: `PORT=3100 NODE_ENV=production node dist/boot.js`, open
      `http://localhost:3100/`, generate a worksheet, print-preview it
- [ ] Env vars set on the host; **rebuild after changing `VITE_*` vars**
- [ ] DNS CNAME `practice` → host; TLS certificate issued
- [ ] Clerk domain + live keys configured
- [ ] `https://practice.mathpivot.com/api/trpc` reachable (404 JSON on unknown route is expected)

## Notes

- Port conflicts: the dev server takes port 3000 by default; use `PORT` to move the
  production server.
- The app is a pure SPA + JSON API — no server-side rendering, no special CDN needs.
  Optionally put Cloudflare in front for caching of `dist/public` assets.

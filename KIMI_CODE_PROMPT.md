# Kimi Code — MathPivot Setup & Deployment Prompt

## CONTEXT

You are working on **MathPivot Calculus Practice**, a fullstack math education web application. The project has been built and is stored in a ZIP file. Your job is to extract it, establish a local preview, fix any issues, and prepare it for deployment to Vercel.

## PROJECT OVERVIEW

**Name:** MathPivot Calculus Practice  
**Stack:** React 19 + Vite + Tailwind CSS + shadcn/ui + KaTeX + math.js  
**Backend:** Hono + tRPC 11.x + Drizzle ORM  
**Database:** Neon PostgreSQL  
**Auth:** Clerk (OAuth + Email)  
**Payments:** Stripe (schema ready, routes need wiring)  
**Deployment Target:** Vercel  

**Current Status:** TypeScript compiles cleanly (`npm run check` passes with 0 errors). Build succeeds. Database schema is defined but not yet pushed to Neon.

---

## PHASE 1: EXTRACT & SETUP

### Step 1: Extract the ZIP

The ZIP file `mathpivot-calculus-practice.zip` should be in your working directory. Extract it:

```bash
unzip mathpivot-calculus-practice.zip -d mathpivot/
cd mathpivot
```

If the ZIP is elsewhere, locate it first with `find`.

### Step 2: Verify Project Structure

After extraction, confirm these directories exist:

```
mathpivot/
├── src/                    # Frontend React code
├── api/                    # Backend tRPC routers
├── db/                     # Database schema
├── contracts/              # Shared types
├── package.json            # Dependencies
├── vite.config.ts          # Vite config
├── drizzle.config.ts       # Drizzle config
└── tsconfig.json           # TypeScript config
```

If any are missing, report immediately.

### Step 3: Install Dependencies

```bash
npm install
```

**CRITICAL:** If `npm install` fails or produces ERESOLVE errors, do NOT modify `package.json`. Instead:
1. Delete `node_modules/` and `package-lock.json`
2. Run `npm install --legacy-peer-deps`
3. If still failing, run `npm install --force`

**Expected packages to verify after install:**
- `drizzle-orm` (PostgreSQL support)
- `@neondatabase/serverless`
- `mathjs`
- `@clerk/clerk-react`
- `@clerk/backend`
- `@trpc/client`, `@trpc/server`, `@trpc/react-query`
- `hono`
- `katex`, `react-katex`
- `framer-motion`

---

## PHASE 2: ENVIRONMENT CONFIGURATION

### Step 4: Create .env File

Create `.env` in the project root with this exact template:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=<your-database-url-here>

# Auth (Clerk) — Get from https://dashboard.clerk.com
CLERK_SECRET_KEY=<your-clerk-secret-key-here>
CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key-here>
VITE_CLERK_PUBLISHABLE_KEY=<your-vite-clerk-publishable-key-here>

# Payments (Stripe) — Optional for local dev, required for production
STRIPE_SECRET_KEY=<your-stripe-secret-key-here>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret-here>

# App
APP_URL=http://localhost:3000
NODE_ENV=development
```

**For local preview ONLY:** You can use placeholder values for Clerk and Stripe keys. The app will start but auth features will show Clerk's development mode UI.

**If you have real keys:** Paste them in. Otherwise, proceed with placeholders.

### Step 5: Verify TypeScript

```bash
npm run check
```

**Expected result:** `0 errors`

**If errors exist:**
1. Read each error carefully
2. Common fixes:
   - Module not found → Run `npm install` again
   - Type mismatch in answerChecker.ts → Ensure `mathjs` is installed
   - Drizzle ORM type errors → Ensure `@neondatabase/serverless` is installed
3. Do NOT downgrade TypeScript or modify tsconfig strict settings
4. Fix source files, not configuration

### Step 6: Build the Project

```bash
npm run build
```

**Expected result:** Build completes with `dist/` folder containing `index.html` and `assets/`.

**If build fails:**
1. Check `npm run check` first — build won't pass if types are broken
2. Common Vite build issues:
   - `Cannot find module '@db/schema'` → Check `tsconfig.json` includes `"@db/*"` path alias
   - `Cannot find module 'db/*'` → Check `vite.config.ts` has `"db"` resolve alias
3. Fix the source issue, do not modify `build` script in `package.json`

---

## PHASE 3: LOCAL PREVIEW

### Step 7: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
➜  press h + enter to show help
```

### Step 8: Verify the App Works

Open `http://localhost:3000` in a browser (or use curl/headless browser to verify).

**Verify these pages load without errors:**
1. **Home page** (`/`) — Should show MathPivot landing page with gold (#C9A86C) accents
2. **Practice page** (`/practice`) — Should show subject selection (Integration, Differentiation, Limits)
3. **Generator page** (`/generator`) — Should show problem generator form
4. **Learn page** (`/learn`) — Should show technique selection
5. **Worksheets page** (`/worksheets`) — Should show worksheet config

**Verify functionality:**
- Click "Practice" → Select "Integration" → Select "U-Substitution" → Start Session
- A problem should appear with LaTeX rendering
- Type an answer in the input box → Press Enter or click Submit
- The answer checker should respond (correct/incorrect)

**If problems don't load:** Check browser console for errors. Common issues:
- `math.js` not loaded → Reinstall: `npm install mathjs`
- KaTeX not rendering → Check `katex` CSS is imported in `index.html` or `main.tsx`

---

## PHASE 4: DATABASE SETUP (Optional for Local)

### Step 9: Configure Neon Database (If Keys Available)

If you have a `DATABASE_URL` from Neon:

```bash
npm run db:push
```

**Expected:** Tables `users`, `progress`, `subscriptions` are created.

**If no DATABASE_URL:** Skip this step. The app works without DB for frontend preview. Progress tracking will fail gracefully (no crash).

### Step 10: Test tRPC API

With the dev server running, test the API:

```bash
curl http://localhost:3000/api/trpc/ping
```

**Expected:** `{"result":{"data":{"ok":true,"ts":...}}}`

**If API fails:**
1. Check server logs — Hono should be running on port 3000 alongside Vite
2. Verify `api/boot.ts` exists and exports a Hono app
3. Check `vite.config.ts` has the `api/` plugin or server middleware configured

---

## PHASE 5: STRIPE INTEGRATION (Optional)

### Step 11: Wire Stripe Router (If Requested)

The Stripe payment routes are documented in `DOCS/STRIPE_SETUP.md` but NOT yet implemented in the API. To add them:

1. Install Stripe SDK:
   ```bash
   npm install stripe
   ```

2. Create `api/stripe-router.ts` using the implementation in `DOCS/STRIPE_SETUP.md`

3. Add to `api/router.ts`:
   ```typescript
   import { stripeRouter } from "./stripe-router";
   // ...
   stripe: stripeRouter,
   ```

4. Create `api/webhooks/stripe.ts` for webhook handling

5. Add Stripe env vars to `.env`

**If not requested, skip this step.** The app works without payments for preview.

---

## PHASE 6: PRE-DEPLOYMENT CHECKLIST

### Step 12: Production Build Verification

```bash
npm run build
```

Confirm:
- [ ] No build errors
- [ ] `dist/` folder exists with `index.html`
- [ ] `dist/assets/` contains JS and CSS bundles
- [ ] Total bundle size < 2 MB (check `dist/assets/*.js`)

### Step 13: Environment Variables for Production

Prepare these for Vercel dashboard:

```bash
DATABASE_URL=postgresql://... (Neon connection string)
CLERK_SECRET_KEY=sk_live_... or sk_test_...
CLERK_PUBLISHABLE_KEY=pk_live_... or pk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_... or pk_test_...
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret-here>
APP_URL=https://practice.mathpivot.com
NODE_ENV=production
```

### Step 14: Vercel Configuration

Ensure `vercel.json` exists (create if missing):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/boot.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/index.html"
    }
  ]
}
```

**Note:** If the project uses Vite's SSR or Hono middleware mode, the routing may differ. Check `vite.config.ts` for `server.middlewareMode` or `api/boot.ts` for export patterns.

---

## KNOWN ISSUES & QUICK FIXES

### Issue 1: `drizzle-orm/pg-core` not found

**Fix:** Ensure `drizzle-orm` is fully installed:
```bash
npm ls drizzle-orm
# If missing or old version:
npm install drizzle-orm@latest
```

### Issue 2: `mathjs` type errors

**Fix:** Add `// @ts-ignore` above the import OR install types:
```bash
npm install --save-dev @types/mathjs
```

If types still fail, the project already has the checker working — ensure you're not re-declaring types.

### Issue 3: Clerk auth fails locally

**Fix:** With placeholder keys, Clerk shows a development mode sign-in. This is expected. For real auth, use actual Clerk keys and add `http://localhost:3000` to Clerk Dashboard → Configure → URLs → Allowed origins.

### Issue 4: CSS not loading (white page)

**Fix:** Check `src/index.css` exists and is imported in `src/main.tsx`. Tailwind directives should be present:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue 5: KaTeX fonts not rendering

**Fix:** KaTeX CSS should be imported. Check `index.html` or `main.tsx` for:
```typescript
import 'katex/dist/katex.min.css';
```

---

## FILES TO NEVER MODIFY

Unless explicitly instructed:

- `package.json` build script — Never change
- `vite.config.ts` core config — Only add aliases, never remove
- `tsconfig.json` strict mode — Keep enabled
- `drizzle.config.ts` dialect — Keep as "postgresql"

---

## SUCCESS CRITERIA

Report back when:

1. ✅ `npm run check` passes with 0 errors
2. ✅ `npm run build` succeeds
3. ✅ `npm run dev` starts server on localhost:3000
4. ✅ Home page loads in browser
5. ✅ Practice mode generates and checks answers
6. ✅ (Optional) Database schema pushed to Neon
7. ✅ (Optional) Stripe routes wired and tested

Include:
- Screenshot or confirmation of running app
- Any errors encountered and how you fixed them
- Bundle size from build output
- Ready-for-deployment confirmation

---

## EXPANSION NOTES (For Future Sessions)

If asked to add new content, the pattern is:

1. **Add problems** to `src/lib/problemGenerator.ts` — Follow existing subject/technique/difficulty pattern
2. **Add Learn content** to `src/pages/Learn.tsx` — Add technique card and theory section
3. **Update types** in `src/lib/problemGenerator.ts` — Add new Technique IDs
4. **No backend changes needed** for new math topics — the generic progress tracker handles any subject/technique string

Refer to `DOCS/EXPANSION_PLAN.md` for the full roadmap.

# MathPivot — Quick Start Prompt

Extract `mathpivot-calculus-practice.zip` into this folder, then run these commands in order. Stop and report if any step fails.

```bash
cd mathpivot
npm install
```

Create `.env`:
```bash
APP_URL=http://localhost:3000
NODE_ENV=development
VITE_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
```

Verify and start:
```bash
npm run check
npm run dev
```

**Expected:** Server starts on `http://localhost:3000` with 0 TypeScript errors.

**Verify in browser:**
1. Home page loads with gold (#C9A86C) accents
2. `/practice` → Integration → U-Substitution → problem renders with LaTeX
3. Type `x^2` in answer box → submit works

**If `npm install` fails:** Delete `node_modules/` and `package-lock.json`, then `npm install --legacy-peer-deps`.

**If `npm run check` fails:** Read errors. Most likely missing `mathjs` or `drizzle-orm` — reinstall them.

**If dev server won't start:** Check port 3000 isn't in use (`lsof -i :3000`).

Report back: Does the app run? Any errors? Screenshot the home page if possible.

# Deployment Guide

## Prerequisites

- Node.js 20+
- A Vercel account (free)
- A Neon account (free tier)
- A Clerk account (free tier)
- A Stripe account (free to start)
- Your domain: `mathpivot.com` (or subdomain `practice.mathpivot.com`)

---

## Step 1: Clone & Install

```bash
git clone <your-repo-url> mathpivot
cd mathpivot
npm install
```

---

## Step 2: Set Up Neon PostgreSQL

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string:
   ```
   postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```
4. Save it as `DATABASE_URL` in your `.env` file

---

## Step 3: Set Up Clerk Auth

1. Go to [clerk.com](https://clerk.com) and create an application
2. In **Configure → API Keys**, copy:
   - `Publishable key` (starts with `pk_test_` or `pk_live_`)
   - `Secret key` (starts with `sk_test_` or `sk_live_`)
3. Add to `.env`:
   ```
   CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
4. In **Configure → Sessions**, enable:
   - JWT session tokens
   - Custom claims (for user ID)
5. Add your domain to **Configure → URLs → Allowed origins**:
   ```
   https://practice.mathpivot.com
   http://localhost:3000
   ```

---

## Step 4: Set Up Stripe

1. Go to [stripe.com](https://stripe.com) and create an account
2. In **Products → Add product**, create:
   - **Calculus Practice Monthly** — $12.00, Recurring, Monthly
   - **Calculus Complete Pack** — $19.00, One-time
3. Copy the Price IDs (they start with `price_`)
4. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_MONTHLY=price_...
   STRIPE_PRICE_CALCULUS_PACK=price_...
   ```
5. Set up webhook endpoint:
   - URL: `https://practice.mathpivot.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

---

## Step 5: Configure Environment Variables

Create `.env` file in project root:

```bash
# Database
DATABASE_URL=postgresql://...

# Auth (Clerk)
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_CALCULUS_PACK=price_...

# App
APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Step 6: Push Database Schema

```bash
npm run db:push
```

This creates the tables in your Neon database.

---

## Step 7: Run Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

Test:
1. Sign up with Google or email
2. Go to Practice → try a few problems
3. Check that progress is saved (check Network tab for tRPC calls)
4. Generate a worksheet and print it

---

## Step 8: Deploy to Vercel

### Option A: Git Integration (Recommended)

1. Push code to GitHub/GitLab
2. In Vercel dashboard, click **Add New Project**
3. Import your repository
4. Configure:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add all environment variables from `.env`
6. Click **Deploy**

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Step 9: Connect Custom Domain

1. In Vercel dashboard, go to **Project Settings → Domains**
2. Add `practice.mathpivot.com`
3. Follow DNS instructions:
   - Add CNAME record: `practice` → `cname.vercel-dns.com`
4. Wait for SSL certificate (auto-provisioned)

---

## Step 10: Verify Production

1. Visit `https://practice.mathpivot.com`
2. Sign up / sign in
3. Complete a practice session
4. Check database for saved progress:
   ```sql
   SELECT * FROM users;
   SELECT * FROM progress;
   ```
5. Test Stripe checkout (use test card `4242 4242 4242 4242`)

---

## Troubleshooting

### Build fails on Vercel
```bash
# Check for TypeScript errors locally
npm run check

# Ensure all env vars are set in Vercel dashboard
```

### Database connection fails
```bash
# Test connection
npx drizzle-kit studio

# Check DATABASE_URL format (must include ?sslmode=require)
```

### Clerk auth not working
```bash
# Check browser console for errors
# Verify VITE_CLERK_PUBLISHABLE_KEY is set
# Check Clerk dashboard for allowed origins
```

### Stripe webhook not received
```bash
# Use Stripe CLI for local testing
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database schema pushed
- [ ] Clerk allowed origins include production domain
- [ ] Stripe webhooks configured for production URL
- [ ] Custom domain connected with SSL
- [ ] Google Analytics or PostHog tracking installed
- [ ] Sentry error tracking installed
- [ ] Privacy policy page created
- [ ] Terms of service page created
- [ ] Refund policy defined
- [ ] Support email configured

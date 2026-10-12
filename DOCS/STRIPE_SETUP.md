# Stripe Payment Integration Guide

## Overview

MathPivot uses Stripe for payments. Two product types:

| Product | Type | Price | Use Case |
|---------|------|-------|----------|
| Calculus Practice Monthly | Subscription | $12/mo | Full access to all calculus topics |
| Calculus Complete Pack | One-time | $19 | Lifetime access to all calculus topics |

Future products (Math 1/3 EOC Prep) follow the same pattern.

---

## Stripe Dashboard Setup

### 1. Create Products

Go to **Products → Add product**

**Product 1: Calculus Practice Monthly**
- Name: Calculus Practice — Monthly
- Description: Unlimited access to all calculus practice problems, worksheets, and progress tracking.
- Pricing model: Standard pricing
- Price: $12.00
- Billing period: Monthly
- Click **Save product**

**Product 2: Calculus Complete Pack**
- Name: Calculus Practice — Complete Pack
- Description: Lifetime access to all calculus practice problems and worksheets. One-time purchase.
- Pricing model: Standard pricing
- Price: $19.00
- Click **Save product**

### 2. Copy Price IDs

After creating each product, you'll see a Price ID (starts with `price_`).

Copy these to your environment variables:
```bash
STRIPE_PRICE_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_CALCULUS_PACK=price_xxxxxxxxxxxxx
```

### 3. Configure Webhooks

Go to **Developers → Webhooks → Add endpoint**

**Endpoint URL:** `https://practice.mathpivot.com/api/webhooks/stripe`

**Events to listen for:**
- `checkout.session.completed` — User completed payment
- `invoice.payment_succeeded` — Subscription renewed
- `customer.subscription.deleted` — Subscription cancelled
- `invoice.payment_failed` — Payment failed

Click **Add endpoint**.

Copy the **Signing secret** (starts with `whsec_`) to your env:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

## Backend Implementation

### File: `api/stripe-router.ts`

```typescript
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { env } from "./lib/env";
import Stripe from "stripe";
import { getDb } from "./queries/connection";
import { subscriptionsTable } from "@db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2024-06-20" });

export const stripeRouter = createRouter({
  // Create checkout session
  createCheckout: publicQuery.mutation(async ({ ctx, input }) => {
    const { priceId, userId, email } = input as {
      priceId: string;
      userId: string;
      email: string;
    };

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: priceId === env.stripePriceMonthly ? "subscription" : "payment",
      success_url: `${env.appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.appUrl}/payment/cancel`,
      metadata: {
        userId,
      },
    });

    return { url: session.url };
  }),

  // Create customer portal session
  createPortal: publicQuery.mutation(async ({ input }) => {
    const { customerId } = input as { customerId: string };

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.appUrl}/settings`,
    });

    return { url: session.url };
  }),

  // Webhook handler (called by Stripe)
  webhook: publicQuery.mutation(async ({ input }) => {
    const { signature, payload } = input as {
      signature: string;
      payload: string;
    };

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.stripeWebhookSecret
    );

    const db = getDb();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          await db.insert(subscriptionsTable).values({
            userId,
            product: session.mode === "subscription" ? "monthly" : "pack",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            status: "active",
            currentPeriodEnd: session.mode === "subscription"
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              : null,
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          await db
            .update(subscriptionsTable)
            .set({
              status: "active",
              currentPeriodEnd: new Date(
                (invoice.lines.data[0]?.period?.end || Date.now() / 1000) * 1000
              ),
            })
            .where(eq(subscriptionsTable.stripeSubscriptionId, subscriptionId));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await db
          .update(subscriptionsTable)
          .set({ status: "cancelled" })
          .where(
            eq(subscriptionsTable.stripeSubscriptionId, subscription.id)
          );
        break;
      }
    }

    return { received: true };
  }),

  // Check subscription status
  getSubscription: publicQuery.query(async ({ input }) => {
    const { userId } = input as { userId: string };
    const db = getDb();

    const sub = await db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.userId, userId),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });

    if (!sub) return { active: false };

    const isActive =
      sub.status === "active" &&
      (sub.currentPeriodEnd ? sub.currentPeriodEnd > new Date() : true);

    return {
      active: isActive,
      product: sub.product,
      currentPeriodEnd: sub.currentPeriodEnd,
    };
  }),
});
```

### File: `api/webhooks/stripe.ts` (Hono route handler)

```typescript
import { Hono } from "hono";
import Stripe from "stripe";
import { env } from "../../lib/env";
import { getDb } from "../../queries/connection";
import { subscriptionsTable } from "@db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2024-06-20" });
const app = new Hono();

app.post("/", async (c) => {
  const payload = await c.req.text();
  const signature = c.req.header("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.stripeWebhookSecret
    );
  } catch (err: any) {
    return c.json({ error: `Webhook Error: ${err.message}` }, 400);
  }

  const db = getDb();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        await db.insert(subscriptionsTable).values({
          userId,
          product: session.mode === "subscription" ? "monthly" : "pack",
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          status: "active",
          currentPeriodEnd:
            session.mode === "subscription"
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              : null,
        });
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;

      if (subscriptionId) {
        await db
          .update(subscriptionsTable)
          .set({
            status: "active",
            currentPeriodEnd: new Date(
              (invoice.lines.data[0]?.period?.end || Date.now() / 1000) * 1000
            ),
          })
          .where(
            eq(subscriptionsTable.stripeSubscriptionId, subscriptionId)
          );
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await db
        .update(subscriptionsTable)
        .set({ status: "cancelled" })
        .where(
          eq(subscriptionsTable.stripeSubscriptionId, subscription.id)
        );
      break;
    }
  }

  return c.json({ received: true });
});

export default app;
```

---

## Frontend Integration

### Payment Button Component

```tsx
// src/components/PaymentButton.tsx
import { useAuth } from "@clerk/clerk-react";
import { trpc } from "@/providers/trpc";

export function PaymentButton({
  priceId,
  children,
}: {
  priceId: string;
  children: React.ReactNode;
}) {
  const { userId, user } = useAuth();
  const createCheckout = trpc.stripe.createCheckout.useMutation();

  const handleClick = async () => {
    if (!userId || !user?.primaryEmailAddress?.emailAddress) return;

    const { url } = await createCheckout.mutateAsync({
      priceId,
      userId,
      email: user.primaryEmailAddress.emailAddress,
    });

    if (url) window.location.href = url;
  };

  return (
    <button
      onClick={handleClick}
      className="bg-[#C9A86C] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#D4B87A] transition-colors"
    >
      {children}
    </button>
  );
}
```

### Usage in Pricing Page

```tsx
// src/pages/Pricing.tsx
import { PaymentButton } from "@/components/PaymentButton";

export default function Pricing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Monthly */}
      <div className="border border-[#1F1F1F] rounded-xl p-6">
        <h3>Monthly</h3>
        <p className="text-3xl font-bold">$12<span className="text-sm">/mo</span></p>
        <ul>...</ul>
        <PaymentButton priceId={import.meta.env.VITE_STRIPE_PRICE_MONTHLY}>
          Subscribe
        </PaymentButton>
      </div>

      {/* One-time */}
      <div className="border border-[#C9A86C] rounded-xl p-6">
        <h3>Complete Pack</h3>
        <p className="text-3xl font-bold">$19</p>
        <ul>...</ul>
        <PaymentButton priceId={import.meta.env.VITE_STRIPE_PRICE_CALCULUS_PACK}>
          Buy Now
        </PaymentButton>
      </div>
    </div>
  );
}
```

---

## Subscription Gate Middleware

Protect paid routes by checking subscription status:

```tsx
// src/components/SubscriptionGate.tsx
import { useAuth } from "@clerk/clerk-react";
import { trpc } from "@/providers/trpc";
import { Link } from "react-router";

export function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const { data: sub } = trpc.stripe.getSubscription.useQuery(
    { userId: userId || "" },
    { enabled: !!userId }
  );

  if (!sub?.active) {
    return (
      <div className="text-center py-20">
        <h2>Premium Content</h2>
        <p>Subscribe to access all practice problems.</p>
        <Link to="/pricing" className="text-[#C9A86C]">
          View Pricing
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## Testing

### Test Card Numbers

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 9995` | Payment declined |
| `4000 2500 0000 3155` | Requires 3D Secure |

Use any future expiry date and any 3-digit CVC.

### Test Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed
```

---

## Going Live

1. Switch Stripe to **Live mode**
2. Create live products (same as test)
3. Update env vars with live keys:
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_MONTHLY=price_live_...
   STRIPE_PRICE_CALCULUS_PACK=price_live_...
   ```
4. Update webhook endpoint URL to production
5. Test one real payment with your own card
6. Enable Stripe Tax (if selling internationally)

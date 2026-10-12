# API Documentation

## Base URL

```
Development: http://localhost:3000/api/trpc
Production:  https://practice.mathpivot.com/api/trpc
```

## Authentication

All authenticated requests include the Clerk user ID in the `x-clerk-user-id` header. The tRPC client automatically injects this from the Clerk session.

---

## Routers

### `auth.*` — Authentication

#### `auth.me`

Get the current user's profile from the database.

```typescript
// Input: none (uses context userId)
// Output: User | null
const { data: user } = trpc.auth.me.useQuery();
```

**Response:**
```json
{
  "id": 1,
  "clerkId": "user_xxxxxxxx",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "role": "user",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

#### `auth.createUser`

Create or update a user in the database (called after Clerk signup).

```typescript
const mutation = trpc.auth.createUser.useMutation();
mutation.mutate({
  clerkId: "user_xxxxxxxx",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://...",
});
```

#### `auth.logout`

Server-side logout (mainly for analytics).

```typescript
trpc.auth.logout.useMutation();
```

---

### `math.*` — Math Progress

#### `math.saveProgress`

Save practice session progress.

```typescript
const mutation = trpc.math.saveProgress.useMutation();
mutation.mutate({
  userId: "user_xxxxxxxx",
  subject: "integration",
  technique: "u-substitution",
  difficulty: "medium",
  correct: 5,
  total: 7,
  streak: 3,
});
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Clerk user ID |
| `subject` | string | `integration`, `differentiation`, `limits` |
| `technique` | string | Technique ID (e.g., `u-substitution`) |
| `difficulty` | string | `easy`, `medium`, `hard` |
| `correct` | number | Correct answers |
| `total` | number | Total attempted |
| `streak` | number | Current streak |

#### `math.getProgress`

Get all progress for a user.

```typescript
const { data: progress } = trpc.math.getProgress.useQuery({
  userId: "user_xxxxxxxx",
});
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": "user_xxxxxxxx",
    "subject": "integration",
    "technique": "u-substitution",
    "difficulty": "medium",
    "correct": 5,
    "total": 7,
    "streak": 3,
    "lastPracticed": "2026-01-15T10:30:00Z"
  }
]
```

---

### `stripe.*` — Payments

#### `stripe.createCheckout`

Create a Stripe Checkout session.

```typescript
const mutation = trpc.stripe.createCheckout.useMutation();
const { url } = await mutation.mutateAsync({
  priceId: "price_xxxxxxxx",
  userId: "user_xxxxxxxx",
  email: "john@example.com",
});
// Redirect to url
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `priceId` | string | Stripe Price ID |
| `userId` | string | Clerk user ID |
| `email` | string | Customer email |

**Returns:** `{ url: string }` — Redirect user to this URL

#### `stripe.getSubscription`

Check if a user has an active subscription.

```typescript
const { data } = trpc.stripe.getSubscription.useQuery({
  userId: "user_xxxxxxxx",
});
```

**Response:**
```json
{
  "active": true,
  "product": "monthly",
  "currentPeriodEnd": "2026-02-15T00:00:00Z"
}
```

#### `stripe.createPortal`

Create a Stripe Customer Portal session for subscription management.

```typescript
const { data } = await trpc.stripe.createPortal.mutateAsync({
  customerId: "cus_xxxxxxxx",
});
// Redirect to data.url
```

---

### `ping`

Health check endpoint.

```typescript
const { data } = trpc.ping.useQuery();
// { ok: true, ts: 1704067200000 }
```

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `UNAUTHORIZED` | 401 | User not authenticated |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid input |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## Client Usage

### React Hook Example

```tsx
import { trpc } from "@/providers/trpc";

function PracticeStats() {
  const { userId } = useAuth();
  
  const { data: progress, isLoading } = trpc.math.getProgress.useQuery(
    { userId: userId || "" },
    { enabled: !!userId }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {progress?.map((p) => (
        <div key={p.id}>
          {p.subject} — {p.technique}: {p.correct}/{p.total}
        </div>
      ))}
    </div>
  );
}
```

### Mutation Example

```tsx
function SaveProgressButton({ sessionData }: { sessionData: SessionData }) {
  const { userId } = useAuth();
  const saveProgress = trpc.math.saveProgress.useMutation();

  const handleSave = () => {
    if (!userId) return;
    saveProgress.mutate({
      userId,
      subject: sessionData.subject,
      technique: sessionData.technique,
      difficulty: sessionData.difficulty,
      correct: sessionData.correct,
      total: sessionData.total,
      streak: sessionData.streak,
    });
  };

  return <button onClick={handleSave}>Save Progress</button>;
}
```

---

## Type Safety

All API calls are fully typed. Types are inferred from the backend router definition:

```typescript
// types are automatically generated from backend
import type { AppRouter } from "../../api/router";

// Input types
import type { inferRouterInputs } from "@trpc/server";
type Inputs = inferRouterInputs<AppRouter>;

// Output types
import type { inferRouterOutputs } from "@trpc/server";
type Outputs = inferRouterOutputs<AppRouter>;
```

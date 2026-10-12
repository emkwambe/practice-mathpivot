# MathPivot — Technical Requirements Document (TRD)

**Version:** 2.0  
**Date:** 2026-09-19  
**Status:** Draft — Aligned with PRD v2.0  
**Tech Lead:** Kimi  
**Stack:** React 19 + Vite + Tailwind CSS + shadcn/ui + Hono + tRPC 11.x + Drizzle ORM + Neon PostgreSQL + Clerk + Stripe

---

## 1. Architecture Overview

### 1.1 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Browser   │  │    PWA      │  │    TikTok (webview)     │ │
│  │  (Desktop)  │  │  (Mobile)   │  │     (embedded)          │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                      │               │
│         └────────────────┴──────────────────────┘               │
│                          │                                      │
│                   HTTPS / Vercel Edge                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                           │
│                          │                                       │
│  ┌───────────────────────┴───────────────────────┐              │
│  │              HONO + TRPC API                    │              │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │              │
│  │  │  Auth   │ │  Math   │ │ Stripe  │         │              │
│  │  │ Router  │ │ Router  │ │ Router  │         │              │
│  │  └────┬────┘ └────┬────┘ └────┬────┘         │              │
│  │       └───────────┴───────────┘              │              │
│  │                   │                           │              │
│  │            ┌──────┴──────┐                   │              │
│  │            │  Drizzle ORM │                   │              │
│  │            │   (Type-safe)│                   │              │
│  │            └──────┬──────┘                   │              │
│  └───────────────────┼──────────────────────────┘              │
│                      │                                           │
│              ┌───────┴───────┐                                  │
│              │  @neondatabase/ │                                  │
│              │   serverless    │                                  │
│              └───────┬───────┘                                  │
└──────────────────────┼──────────────────────────────────────────┘
                       │
              ┌────────┴────────┐
              │  NEON POSTGRES  │
              │   (Serverless)  │
              │  ┌───────────┐  │
              │  │  Primary  │  │
              │  │  (US East)│  │
              │  └───────────┘  │
              └─────────────────┘

EXTERNAL SERVICES:
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│  Clerk  │  │ Stripe  │  │  KaTeX  │  │ math.js │
│  (Auth) │  │(Payments│  │(Render) │  │ (Check) │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
```

### 1.2 Technology Choices & Rationale

| Layer | Choice | Alternatives | Why This One |
|-------|--------|--------------|--------------|
| **Frontend Framework** | React 19 | Vue, Svelte, Solid | Ecosystem, team familiarity, concurrent features |
| **Build Tool** | Vite 5 | Webpack, Turbopack | Fast HMR, native ESM, proven stability |
| **Styling** | Tailwind CSS 3 | CSS Modules, Styled Components | Utility-first, design system consistency, small bundle |
| **Components** | shadcn/ui | Material UI, Chakra, Ant | Copy-paste customization, Radix primitives, no vendor lock-in |
| **Math Rendering** | KaTeX | MathJax | 10x faster, smaller bundle, no reflow flash |
| **Animations** | Framer Motion | GSAP, CSS transitions | React-native, declarative, performance-optimized |
| **API Framework** | Hono | Express, Fastify | Edge-compatible, TypeScript-native, minimal overhead |
| **API Protocol** | tRPC 11.x | REST, GraphQL | End-to-end type safety, zero boilerplate, automatic caching |
| **ORM** | Drizzle ORM | Prisma, TypeORM | SQL-like syntax, no query engine, minimal overhead |
| **Database** | Neon PostgreSQL | Supabase, PlanetScale, RDS | Serverless, connectionless, Vercel-native, cost-effective |
| **Auth** | Clerk | Auth0, Firebase Auth, NextAuth | Best React DX, built-in UI components, session management |
| **Payments** | Stripe | Paddle, LemonSqueezy | Mature API, excellent React SDK, global coverage |
| **Math Engine** | math.js | SymPy (WASM), Algebrite | JavaScript-native, small bundle, sufficient for test-point evaluation |
| **Hosting** | Vercel | Netlify, Cloudflare Pages | Edge network, preview deployments, analytics, Hono support |

### 1.3 Non-Negotiable Constraints

1. **TypeScript strict mode** — No `any` types in production code
2. **Zero LaTeX input required** — Students never type LaTeX; plain text only
3. **Edge-compatible** — All API routes must run on Vercel Edge (no Node-only APIs)
4. **Mobile-first responsive** — All features work on 375px width
5. **No vendor lock-in** — All core logic is portable; services are swappable

---

## 2. Database Architecture

### 2.1 Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────────┐
│    users     │       │   progress   │       │  subscriptions   │
├──────────────┤       ├──────────────┤       ├──────────────────┤
│ id           │◄──────┤ user_id      │       │ id               │
│ clerk_id     │       │ subject      │       │ user_id          │◄──┐
│ name         │       │ technique    │       │ product          │   │
│ email        │       │ difficulty   │       │ stripe_customer  │   │
│ avatar       │       │ correct      │       │ stripe_sub       │   │
│ role         │       │ total        │       │ status           │   │
│ created_at   │       │ streak       │       │ current_period   │   │
│ updated_at   │       │ last_practiced│      │ created_at       │   │
└──────────────┘       └──────────────┘       └──────────────────┘   │
                                                                     │
┌──────────────┐       ┌──────────────┐       ┌──────────────────┐  │
│   classes    │       │  assignments │       │ class_enrollments│  │
├──────────────┤       ├──────────────┤       ├──────────────────┤  │
│ id           │◄──────┤ class_id     │       │ id               │  │
│ name         │       │ subject      │       │ class_id         │──┘
│ code         │       │ technique    │       │ student_user_id  │◄─┐
│ teacher_id   │◄──────┤ difficulty   │       │ joined_at        │  │
│ subject      │       │ problem_count│       └──────────────────┘  │
│ created_at   │       │ due_date     │                             │
└──────────────┘       │ created_at   │                             │
                       └──────────────┘                             │
                                                                    │
┌──────────────────────┐                                            │
│ assignment_progress  │◄───────────────────────────────────────────┘
├──────────────────────┤
│ id                   │
│ assignment_id        │
│ student_user_id      │
│ problems_completed   │
│ correct_count        │
│ time_spent_seconds   │
│ completed_at         │
└──────────────────────┘
```

### 2.2 Schema Definitions (Drizzle ORM)

#### Users Table
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: varchar("role", { length: 50 }).notNull().default("student"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }).defaultNow(),
});
```

**Indexes:** `clerk_id` (unique), `email` (for lookups), `role` (for admin queries)

#### Progress Table
```typescript
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  technique: varchar("technique", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  correct: integer("correct").notNull().default(0),
  total: integer("total").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastPracticed: timestamp("last_practiced", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
```

**Indexes:** `user_id`, `(user_id, subject, technique, difficulty)` (unique composite for upserts)

**Constraints:** `check (correct <= total)`, `check (streak >= 0)`

#### Subscriptions Table
```typescript
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  product: varchar("product", { length: 100 }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("inactive"),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
```

**Indexes:** `user_id`, `stripe_subscription_id` (unique)

**Status values:** `inactive`, `active`, `cancelled`, `past_due`

#### Classes Table (Teacher Feature)
```typescript
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  teacherId: varchar("teacher_id", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
```

**Indexes:** `code` (unique), `teacher_id`

**Code generation:** 6-digit numeric, collision-resistant (regenerate on conflict)

#### Class Enrollments Table
```typescript
export const classEnrollments = pgTable("class_enrollments", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull(),
  studentUserId: varchar("student_user_id", { length: 255 }).notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
});
```

**Indexes:** `(class_id, student_user_id)` (unique composite)

#### Assignments Table
```typescript
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  technique: varchar("technique", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  problemCount: integer("problem_count").notNull().default(10),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
```

**Indexes:** `class_id`, `due_date`

#### Assignment Progress Table
```typescript
export const assignmentProgress = pgTable("assignment_progress", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(),
  studentUserId: varchar("student_user_id", { length: 255 }).notNull(),
  problemsCompleted: integer("problems_completed").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  timeSpentSeconds: integer("time_spent_seconds").notNull().default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
```

**Indexes:** `(assignment_id, student_user_id)` (unique composite)

### 2.3 Row-Level Security (RLS) Strategy

Neon supports PostgreSQL RLS. Applied policies:

```sql
-- Users can only read their own progress
CREATE POLICY progress_user_isolation ON progress
  FOR ALL
  USING (user_id = current_setting('app.current_user_id', true));

-- Teachers can read their class data
CREATE POLICY class_teacher_isolation ON classes
  FOR ALL
  USING (teacher_id = current_setting('app.current_user_id', true));

-- Students can read assignments for their enrolled classes
CREATE POLICY assignment_student_read ON assignments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_enrollments
      WHERE class_id = assignments.class_id
      AND student_user_id = current_setting('app.current_user_id', true)
    )
  );
```

**Note:** RLS is enforced at the database level. Application layer also validates access for defense in depth.

### 2.4 Migration Strategy

| Command | Use Case |
|---------|----------|
| `npm run db:push` | Development — sync schema without migrations |
| `npm run db:generate` | Generate migration SQL files |
| `npm run db:migrate` | Production — apply pending migrations |

**Production rule:** Never use `db:push` in production. Always generate and review migrations.

---

## 3. API Design (tRPC)

### 3.1 Router Structure

```typescript
// api/router.ts
export const appRouter = router({
  auth: authRouter,        // User management
  math: mathRouter,        // Progress tracking
  stripe: stripeRouter,    // Payments
  teacher: teacherRouter,  // Class & assignment management
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
});
```

### 3.2 Procedure Types

```typescript
// Middleware hierarchy
publicQuery      // No auth required (health check, webhooks)
  └─ authedQuery // Requires valid Clerk session
      └─ adminQuery // Requires role === "admin"
      └─ teacherQuery // Requires active teacher subscription
      └─ studentQuery // Requires active student subscription
```

### 3.3 Auth Router

| Endpoint | Input | Output | Auth |
|----------|-------|--------|------|
| `auth.me` | — | User | authed |
| `auth.createUser` | `{ clerkId, name, email, avatar }` | User | public |
| `auth.updateProfile` | `{ name?, avatar? }` | User | authed |
| `auth.logout` | — | `{ success: true }` | authed |

### 3.4 Math Router

| Endpoint | Input | Output | Auth |
|----------|-------|--------|------|
| `math.saveProgress` | `{ subject, technique, difficulty, correct, total, streak }` | Progress | authed |
| `math.getProgress` | — | Progress[] | authed |
| `math.getProgressBySubject` | `{ subject }` | Progress[] | authed |
| `math.getStreak` | — | `{ currentStreak, longestStreak }` | authed |
| `math.getWeakAreas` | — | `{ subject, technique, accuracy }[]` | authed |

### 3.5 Stripe Router

| Endpoint | Input | Output | Auth |
|----------|-------|--------|------|
| `stripe.createCheckout` | `{ priceId, userId, email }` | `{ url: string }` | authed |
| `stripe.createPortal` | `{ customerId }` | `{ url: string }` | authed |
| `stripe.getSubscription` | — | `{ active, product, currentPeriodEnd }` | authed |
| `stripe.webhook` | `{ signature, payload }` | `{ received: true }` | public |

### 3.6 Teacher Router

| Endpoint | Input | Output | Auth |
|----------|-------|--------|------|
| `teacher.createClass` | `{ name, subject? }` | `{ id, name, code }` | teacherQuery |
| `teacher.getClasses` | — | Class[] | teacherQuery |
| `teacher.getClassAnalytics` | `{ classId }` | `{ students, avgScore, weakAreas }` | teacherQuery |
| `teacher.createAssignment` | `{ classId, subject, technique, difficulty, problemCount, dueDate? }` | Assignment | teacherQuery |
| `teacher.getAssignments` | `{ classId }` | Assignment[] | teacherQuery |
| `teacher.exportCSV` | `{ classId, assignmentId? }` | `{ csv: string }` | teacherQuery |
| `teacher.joinClass` | `{ code }` | `{ classId, name }` | authed |
| `teacher.getAssignmentsForStudent` | — | Assignment[] | authed |
| `teacher.submitAssignment` | `{ assignmentId, problemsCompleted, correctCount, timeSpent }` | AssignmentProgress | authed |

### 3.7 Error Handling

```typescript
// Standard error shape
{
  "error": {
    "json": {
      "message": "User not authenticated",
      "code": "UNAUTHORIZED",
      "data": {
        "httpStatus": 401,
        "path": "math.saveProgress"
      }
    }
  }
}
```

**Error codes:**
| Code | HTTP | When |
|------|------|------|
| `BAD_REQUEST` | 400 | Invalid input (Zod validation fails) |
| `UNAUTHORIZED` | 401 | No valid Clerk session |
| `FORBIDDEN` | 403 | Valid session but insufficient permissions |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Unique constraint violation |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## 4. Authentication Flow

### 4.1 Sign Up (Student)

```
User clicks "Sign Up"
    ↓
Clerk SignUp component renders (Google or Email)
    ↓
User completes OAuth / Email verification
    ↓
Clerk creates user, issues JWT session token
    ↓
Frontend calls auth.createUser mutation
    ↓
Backend creates user record in Neon (clerk_id, name, email, avatar)
    ↓
User redirected to onboarding or practice page
```

### 4.2 Sign In

```
User clicks "Sign In"
    ↓
Clerk SignIn component renders
    ↓
User authenticates
    ↓
Clerk issues JWT, stores in httpOnly cookie
    ↓
Frontend includes JWT in tRPC Authorization header
    ↓
Backend verifies JWT with Clerk SDK
    ↓
Extract userId from JWT, attach to tRPC context
    ↓
User accesses authenticated routes
```

### 4.3 Token Refresh

- Clerk handles automatic token refresh (no custom logic needed)
- Access tokens valid for 1 minute (Clerk default)
- Refresh tokens valid for session duration

### 4.4 Webhook: User Created/Updated

```
Clerk sends webhook to /api/webhooks/clerk
    ↓
Verify webhook signature (Clerk webhook secret)
    ↓
Event type: user.created
    ↓
Create user in Neon database
    ↓
Event type: user.updated
    ↓
Update user in Neon database
    ↓
Event type: user.deleted
    ↓
Soft-delete or anonymize user data (GDPR compliance)
```

### 4.5 Role-Based Access Control (RBAC)

```typescript
// Role hierarchy
enum Role {
  STUDENT = "student",    // Free tier
  STUDENT_PRO = "student_pro", // Paid student
  TEACHER = "teacher",    // Paid teacher
  ADMIN = "admin",        // Platform admin
}

// Permission matrix
const permissions = {
  "practice:unlimited": ["student_pro", "teacher"],
  "teacher:dashboard": ["teacher"],
  "teacher:create-class": ["teacher"],
  "admin:view-all": ["admin"],
};
```

---

## 5. Payment Flow (Stripe)

### 5.1 Student Subscription ($8/mo)

```
User clicks "Subscribe - $8/month"
    ↓
Frontend calls stripe.createCheckout({ priceId: "price_monthly", userId, email })
    ↓
Backend creates Stripe Checkout Session
    ↓
Returns checkout URL
    ↓
Redirect to Stripe-hosted checkout page
    ↓
User enters payment info → Stripe processes
    ↓
Stripe redirects to /payment/success?session_id=xxx
    ↓
Webhook: checkout.session.completed
    ↓
Backend creates subscription record (status: "active")
    ↓
User redirected to dashboard with full access
```

### 5.2 Student Pro Subscription ($15/mo)

Same flow with `priceId: "price_pro_monthly"`.

### 5.3 Teacher Subscription ($29/mo)

Same flow with `priceId: "price_teacher_monthly"`.

### 5.4 Annual Upgrade

```
User on Student tier ($8/mo = $96/yr)
    ↓
Clicks "Upgrade to Annual - Save 17%"
    ↓
Stripe prorates remaining monthly → annual
    ↓
Webhook: customer.subscription.updated
    ↓
Update subscription record with new price and period
```

### 5.5 Cancellation

```
User clicks "Cancel Subscription"
    ↓
Frontend calls stripe.createPortal({ customerId })
    ↓
Redirect to Stripe Customer Portal
    ↓
User cancels in Stripe UI
    ↓
Webhook: customer.subscription.deleted
    ↓
Backend updates subscription status to "cancelled"
    ↓
User retains access until period end
```

### 5.6 Webhook Security

```typescript
// Verify webhook signature
const event = stripe.webhooks.constructEvent(
  payload,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);

// Idempotency: Check if event already processed
const existing = await db.query.webhookEvents.findFirst({
  where: eq(webhookEvents.stripeEventId, event.id)
});
if (existing) return { received: true }; // Already processed

// Process event
// ...

// Record event ID for idempotency
await db.insert(webhookEvents).values({
  stripeEventId: event.id,
  type: event.type,
  processedAt: new Date(),
});
```

---

## 6. Answer Checker Architecture

### 6.1 Hybrid Evaluation Pipeline

```
User Input: "(x+1)^2"
    ↓
┌─────────────────────────────────────────┐
│ 1. TEXT NORMALIZATION                   │
│    - lowercase                           │
│    - trim whitespace                     │
│    - expand synonyms                     │
│    Result: "(x+1)^2"                    │
└─────────────────────────────────────────┘
    ↓ (if text match fails)
┌─────────────────────────────────────────┐
│ 2. NUMERICAL PARSE                      │
│    - detect fractions: "3/2" → 1.5      │
│    - detect decimals: "1.50" → 1.5      │
│    - compare within epsilon (1e-9)      │
│    Result: N/A (contains variable)      │
└─────────────────────────────────────────┘
    ↓ (if numerical fails)
┌─────────────────────────────────────────┐
│ 3. SYMBOLIC TEST-POINT EVALUATION       │
│    - Parse both expressions with math.js │
│    - Evaluate at 8 test points:         │
│      x ∈ {0.1, 0.5, 1, 2, 3.14,        │
│            -0.5, -1, 5}                 │
│    - Compare results within epsilon     │
│    Result: MATCH (all 8 points agree)   │
└─────────────────────────────────────────┘
    ↓
Return: { correct: true, type: "symbolic", normalizedUser: "(x+1)^2" }
```

### 6.2 Test Point Selection

```typescript
const TEST_POINTS = [
  0.1,   // Near zero
  0.5,   // Simple fraction
  1,     // Identity
  2,     // Small integer
  Math.PI, // Irrational
  -0.5,  // Negative fraction
  -1,    // Negative integer
  5,     // Larger integer
];

// For multivariable: cartesian product of test points
// For trig functions: include π/2, π, 3π/2, 2π
```

### 6.3 Performance

- **Client-side execution:** No API call needed for answer check
- **Bundle size:** math.js tree-shaken to ~150KB
- **Execution time:** <50ms for single-variable expressions
- **Fallback:** If math.js parse fails, fall back to text comparison

### 6.4 Known Limitations

| Limitation | Mitigation |
|-----------|-----------|
| Equivalent expressions with singularities (e.g., `x/x` vs `1`) | Skip test points near singularities |
| Piecewise definitions | Not supported; use categorical answers |
| Complex numbers | Not supported; restrict to real domain |
| Trig identities at specific points | Use more test points including π multiples |

---

## 7. Frontend Architecture

### 7.1 State Management

| State Type | Solution | Example |
|-----------|----------|---------|
| Server state | tRPC + React Query | User progress, subscription status |
| Form state | React Hook Form | Practice setup, worksheet config |
| UI state | React useState | Modal open/close, selected tab |
| Global UI | URL params | Current subject, technique filter |

**No Redux/Zustand needed.** tRPC's React Query integration handles caching, deduping, and background refetching.

### 7.2 Component Hierarchy

```
App
├── Layout (Navbar + Footer)
│   ├── ClerkProvider
│   │   ├── TRPCProvider
│   │   │   ├── Routes
│   │   │   │   ├── / (Landing)
│   │   │   │   ├── /practice
│   │   │   │   │   └── PracticePage
│   │   │   │   │       ├── SubjectSelector
│   │   │   │   │       ├── TechniqueSelector
│   │   │   │   │       ├── DifficultySelector
│   │   │   │   │       └── ActiveSession
│   │   │   │   │           ├── ProblemDisplay (KaTeX)
│   │   │   │   │           ├── AnswerInput (plain text)
│   │   │   │   │           ├── HintSystem
│   │   │   │   │           └── ResultsScreen
│   │   │   │   ├── /generator
│   │   │   │   ├── /worksheets
│   │   │   │   ├── /learn
│   │   │   │   ├── /teacher
│   │   │   │   │   └── TeacherDashboard
│   │   │   │   │       ├── ClassManager
│   │   │   │   │       ├── AssignmentBuilder
│   │   │   │   │       └── AnalyticsPanel
│   │   │   │   ├── /pricing
│   │   │   │   └── /settings
```

### 7.3 Route Guards

```typescript
// Auth guard — redirect to login
function RequireAuth({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <Loading />;
  if (!isSignedIn) return <Navigate to="/login" />;
  return children;
}

// Subscription guard — redirect to pricing
function RequireSubscription({ children }: { children: ReactNode }) {
  const { data: sub } = trpc.stripe.getSubscription.useQuery();
  if (!sub?.active) return <Navigate to="/pricing" />;
  return children;
}

// Teacher guard — redirect to upgrade
function RequireTeacher({ children }: { children: ReactNode }) {
  const { data: sub } = trpc.stripe.getSubscription.useQuery();
  if (sub?.product !== "teacher") return <Navigate to="/pricing" />;
  return children;
}
```

### 7.4 KaTeX Integration

```typescript
// MathDisplay.tsx — server-side render for SEO, client-side hydration
import katex from "katex";

export function MathDisplay({ latex }: { latex: string }) {
  const html = useMemo(
    () => katex.renderToString(latex, { throwOnError: false }),
    [latex]
  );

  return (
    <span
      className="math-display"
      dangerouslySetInnerHTML={{ __html: html }}
      aria-label={`Mathematical expression: ${latex}`}
    />
  );
}
```

**SSR:** KaTeX runs on server for initial render (no flash of unrendered math).  
**Accessibility:** `aria-label` provides screen reader description.  
**Performance:** Memoized to prevent re-render on unrelated state changes.

### 7.5 PWA Configuration

```json
// vite.config.ts
{
  "plugins": [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MathPivot",
        short_name: "MathPivot",
        description: "Math practice that works",
        theme_color: "#C9A86C",
        background_color: "#000000",
        icons: [
          { src: "/icon-192.png", sizes: "192x192" },
          { src: "/icon-512.png", sizes: "512x512" }
        ]
      }
    })
  ]
}
```

---

## 8. Deployment Architecture

### 8.1 Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/trpc/(.*)",
      "dest": "/api/boot.ts"
    },
    {
      "src": "/api/webhooks/(.*)",
      "dest": "/api/boot.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 8.2 Environment Variables (Production)

```bash
# Database
DATABASE_URL=postgresql://...

# Auth
CLERK_SECRET_KEY=sk_live_...
CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_live_...
STRIPE_PRICE_PRO_MONTHLY=price_live_...
STRIPE_PRICE_TEACHER_MONTHLY=price_live_...
STRIPE_PRICE_YEARLY=price_live_...
STRIPE_PRICE_PRO_YEARLY=price_live_...
STRIPE_PRICE_TEACHER_YEARLY=price_live_...

# App
APP_URL=https://practice.mathpivot.com
NODE_ENV=production

# Monitoring (optional)
SENTRY_DSN=https://...
POSTHOG_KEY=ph_...
```

### 8.3 CI/CD Pipeline

```
Git Push to main
    ↓
Vercel triggers build
    ↓
TypeScript check (npm run check)
    ↓
Build (npm run build)
    ↓
Deploy to production
    ↓
Post-deploy health check (curl /api/trpc/ping)
    ↓
Slack notification (success/failure)
```

**Branch protection:**
- `main` branch requires PR + review
- Preview deployments for all PRs
- Automated tests run on PR (future: add Vitest)

### 8.4 Monitoring & Alerting

| Tool | Purpose | Free Tier Limit |
|------|---------|----------------|
| Vercel Analytics | Core Web Vitals, traffic | 1M events/month |
| Vercel Logs | Server logs, errors | 7 days retention |
| Sentry | Error tracking, stack traces | 5K errors/month |
| PostHog | Product analytics, funnels | 1M events/month |

**Alert thresholds:**
- Error rate >0.5% for 5 minutes
- P95 response time >500ms for 10 minutes
- Failed builds
- Database connection errors

---

## 9. Security Requirements

### 9.1 Authentication Security

- **JWT stored in httpOnly cookie** — No localStorage (XSS protection)
- **CSRF protection** — Clerk handles this automatically
- **Session expiry** — 7 days idle timeout
- **Concurrent session limit** — 3 sessions per user
- **Suspicious activity detection** — Email alert on new device/login location

### 9.2 API Security

- **Rate limiting:** 100 requests/minute per IP, 10 auth attempts/minute
- **Input validation:** Zod schemas on all tRPC inputs
- **SQL injection:** Impossible (Drizzle parameterized queries)
- **XSS prevention:** React auto-escapes, CSP headers
- **CORS:** Whitelist `practice.mathpivot.com` and `localhost:3000`

### 9.3 Payment Security

- **PCI compliance:** Stripe handles all card data (SAQ A)
- **Webhook verification:** HMAC signature check on all Stripe webhooks
- **Idempotency:** Record processed webhook event IDs to prevent double-processing
- **Price validation:** Server-side price lookup, never trust client-side price

### 9.4 Data Security

- **Encryption at rest:** Neon encrypts all data (AES-256)
- **Encryption in transit:** TLS 1.3 for all connections
- **PII handling:** Minimal collection (name, email, avatar URL only)
- **Data retention:** User data deleted 30 days after account deletion
- **Backups:** Neon automated daily backups, 7-day retention

### 9.5 Compliance Checklist

| Regulation | Requirement | Implementation |
|-----------|-------------|----------------|
| **COPPA** | Parental consent for under-13 | Age gate on signup; no data collection if <13 |
| **FERPA** | Educational records privacy | Teacher data isolated; no third-party sharing |
| **GDPR** | EU user rights | Export data button; delete account button; privacy policy |
| **CCPA** | California disclosures | Privacy policy lists all collected data |
| **PCI DSS** | Card data security | Stripe handles all card data; never touch PAN |

---

## 10. Performance & Scaling

### 10.1 Current Capacity (Free Tier)

| Resource | Limit | MathPivot Usage | Headroom |
|----------|-------|-----------------|----------|
| Vercel bandwidth | 100GB/mo | ~5GB/mo (est. 10K users) | 20x |
| Neon storage | 10GB | ~50MB (start) | 200x |
| Neon compute | 500 CU-hrs/mo | ~10 CU-hrs/mo | 50x |
| Clerk MAU | 10,000 | ~500 (Month 6 est.) | 20x |

### 10.2 Scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| Vercel bandwidth | >80GB/mo | Upgrade to Pro ($20/mo) |
| Neon storage | >8GB | Upgrade to Launch ($19/mo) |
| Neon compute | >400 CU-hrs | Add read replicas |
| Clerk MAU | >8,000 | Upgrade to Pro ($25/mo) |
| API p95 latency | >300ms | Add Vercel Edge caching |
| Database queries | >100ms p95 | Add query caching (Redis) |

### 10.3 Caching Strategy

| Layer | Cache | TTL | Invalidation |
|-------|-------|-----|--------------|
| Browser | Service Worker | Static assets: 1 year | On new build |
| CDN | Vercel Edge | API responses: 5 min | On mutation |
| Application | React Query | Server state: stale-while-revalidate | On mutation |
| Database | Neon query cache | Automatic | Automatic |

### 10.4 Bundle Optimization

```
Current bundle (est.):
├── Vendor (React, Router, etc.)    ~180 KB gzipped
├── KaTeX                           ~120 KB gzipped
├── math.js                         ~150 KB gzipped
├── Framer Motion                   ~40 KB gzipped
├── App code                        ~80 KB gzipped
├── Total                           ~570 KB gzipped

Target: <600 KB initial, lazy-load routes
```

**Optimizations:**
- Code splitting by route (`React.lazy`)
- KaTeX fonts loaded on demand
- math.js tree-shaken to essential functions
- Images: WebP format, responsive sizes

---

## 11. Testing Strategy

### 11.1 Unit Tests (Vitest)

```typescript
// answerChecker.test.ts
describe("checkAnswer", () => {
  it("matches equivalent algebraic expressions", () => {
    expect(checkAnswer("x^2 + 2x + 1", "(x+1)^2").correct).toBe(true);
  });

  it("matches fractions and decimals", () => {
    expect(checkAnswer("3/2", "1.5").correct).toBe(true);
  });

  it("matches text synonyms", () => {
    expect(checkAnswer("converges", "convergent").correct).toBe(true);
  });

  it("rejects wrong answers", () => {
    expect(checkAnswer("x^2", "x^3").correct).toBe(false);
  });
});
```

### 11.2 Integration Tests

- tRPC router tests with in-memory database
- Stripe webhook handler tests with mock events
- Clerk auth flow tests with test JWTs

### 11.3 E2E Tests (Playwright — Future)

- Complete signup → practice → subscribe flow
- Teacher: create class → assign → student completes → view analytics
- Mobile responsiveness on iPhone 14 and Pixel 7

### 11.4 Load Testing (Future)

- 100 concurrent users practicing
- 1000 webhook events per minute
- Database: 10K queries/second

---

## 12. Development Workflow

### 12.1 Branch Strategy

```
main          ← Production branch, protected
  └─ develop  ← Integration branch
       └─ feature/subject-applications-of-derivatives
       └─ feature/teacher-dashboard
       └─ bugfix/answer-checker-false-negative
```

### 12.2 Commit Convention

```
feat: add applications of derivatives subject
fix: handle division by zero in answer checker
docs: update API documentation
refactor: extract problem generation to factory
test: add integration tests for Stripe webhooks
chore: update dependencies
```

### 12.3 Code Review Checklist

- [ ] TypeScript compiles with 0 errors
- [ ] No `any` types
- [ ] Error handling for all async operations
- [ ] Accessibility: keyboard navigation, aria labels
- [ ] Mobile responsive
- [ ] No console.log in production code
- [ ] Database queries have indexes
- [ ] API inputs validated with Zod

---

## 13. Disaster Recovery

### 13.1 Backup & Restore

| Component | Backup Method | Frequency | Restore Time |
|-----------|--------------|-----------|--------------|
| Database | Neon automated | Daily | <1 hour |
| Code | GitHub | Every commit | <5 minutes |
| Environment vars | Vercel dashboard | Manual | <5 minutes |

### 13.2 Failure Scenarios

| Scenario | Impact | Mitigation |
|----------|--------|-----------|
| Neon outage | App read-only | Clerk auth still works; practice mode works offline (localStorage) |
| Stripe outage | No new subscriptions | Existing subscriptions unaffected; manual invoice creation |
| Clerk outage | No auth | Display "Login temporarily unavailable"; practice mode available anonymously |
| Vercel outage | App down | Status page; Twitter/X update; no action (Vercel SLA 99.99%) |
| math.js bug | Wrong answer evaluations | Manual review queue; fallback to text comparison |

### 13.3 Incident Response

1. **Detect:** Sentry alert, user report, monitoring dashboard
2. **Assess:** Severity (P0 = revenue-impacting, P1 = feature degraded, P2 = cosmetic)
3. **Communicate:** Status page update, Twitter/X if P0
4. **Mitigate:** Rollback if deploy-related, failover if infrastructure
5. **Resolve:** Deploy fix, verify monitoring
6. **Post-mortem:** Document within 24 hours, action items in backlog

---

## 14. Appendix

### A. Technology Versions

| Package | Version | Notes |
|---------|---------|-------|
| React | 19.x | Concurrent features, Server Components |
| Vite | 5.x | ESM, HMR |
| TypeScript | 5.x | Strict mode |
| Tailwind CSS | 3.4.x | JIT compiler |
| Hono | 4.x | Edge runtime |
| tRPC | 11.x | React Query integration |
| Drizzle ORM | 0.30.x | PostgreSQL support |
| Neon | Serverless | Latest |
| Clerk | 5.x | React SDK |
| Stripe | 15.x | Latest API |
| math.js | 12.x | Tree-shakeable |
| KaTeX | 0.16.x | Auto-render |

### B. External Dependencies

| Service | URL | Status Page |
|---------|-----|-------------|
| Vercel | vercel.com | status.vercel.com |
| Neon | neon.tech | status.neon.tech |
| Clerk | clerk.com | status.clerk.com |
| Stripe | stripe.com | status.stripe.com |

### C. Glossary

| Term | Definition |
|------|-----------|
| **tRPC** | TypeScript RPC — end-to-end typesafe APIs |
| **Drizzle ORM** | SQL-like ORM with type inference |
| **Neon** | Serverless PostgreSQL with branching |
| **Clerk** | Authentication as a service |
| **Hono** | Lightweight web framework for Edge runtimes |
| **PWA** | Progressive Web App |
| **CSP** | Content Security Policy |
| **RLS** | Row-Level Security |
| **MAU** | Monthly Active Users |
| **MRR** | Monthly Recurring Revenue |
| **LTV** | Lifetime Value |
| **CAC** | Customer Acquisition Cost |
| **NPS** | Net Promoter Score |
| **LCP** | Largest Contentful Paint |

---

**Document Owner:** Kimi  
**Last Updated:** 2026-09-19  
**Next Review:** Upon Phase 2 architecture changes

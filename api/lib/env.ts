import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

function optional(name: string): string {
  return process.env[name] ?? "";
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  clerkSecretKey: required("CLERK_SECRET_KEY"),
  clerkPublishableKey: required("CLERK_PUBLISHABLE_KEY"),
  // Reserved for future billing/uploads — no code reads these yet,
  // so they must not block production boot.
  stripeSecretKey: optional("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: optional("STRIPE_WEBHOOK_SECRET"),
  appUrl: optional("APP_URL"),
  isProduction: process.env.NODE_ENV === "production",
};

import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  clerkSecretKey: required("CLERK_SECRET_KEY"),
  clerkPublishableKey: required("CLERK_PUBLISHABLE_KEY"),
  stripeSecretKey: required("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: required("STRIPE_WEBHOOK_SECRET"),
  appUrl: required("APP_URL"),
  isProduction: process.env.NODE_ENV === "production",
};

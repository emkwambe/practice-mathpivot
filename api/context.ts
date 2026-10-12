import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  userId?: string;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  // Extract Clerk user ID from request headers if available
  const userId = opts.req.headers.get("x-clerk-user-id") || undefined;
  return { req: opts.req, resHeaders: opts.resHeaders, userId };
}

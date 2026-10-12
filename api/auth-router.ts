import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

export const authRouter = createRouter({
  me: publicQuery.query(async ({ ctx }) => {
    if (!ctx.userId) return null;
    const db = getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, ctx.userId),
    });
    return user;
  }),

  createUser: publicQuery.mutation(async ({ input }) => {
    const data = input as unknown as { clerkId: string; name?: string; email?: string; avatar?: string };
    const db = getDb();

    const existing = await db.query.users.findFirst({
      where: eq(users.clerkId, data.clerkId),
    });

    if (existing) return existing;

    const [user] = await db.insert(users).values({
      clerkId: data.clerkId,
      name: data.name || null,
      email: data.email || null,
      avatar: data.avatar || null,
    }).returning();

    return user;
  }),

  logout: publicQuery.mutation(() => {
    return { success: true };
  }),
});

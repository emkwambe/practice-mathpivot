import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { progressTable } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const mathRouter = createRouter({
  saveProgress: publicQuery.mutation(async ({ input }) => {
    const data = input as unknown as {
      userId: string;
      subject: string;
      technique: string;
      difficulty: string;
      correct: number;
      total: number;
      streak: number;
    };

    const db = getDb();

    const existing = await db.query.progressTable.findFirst({
      where: and(
        eq(progressTable.userId, data.userId),
        eq(progressTable.subject, data.subject),
        eq(progressTable.technique, data.technique),
        eq(progressTable.difficulty, data.difficulty)
      ),
    });

    if (existing) {
      await db.update(progressTable)
        .set({ correct: data.correct, total: data.total, streak: data.streak, lastPracticed: new Date() })
        .where(eq(progressTable.id, existing.id));
    } else {
      await db.insert(progressTable).values({
        userId: data.userId,
        subject: data.subject,
        technique: data.technique,
        difficulty: data.difficulty,
        correct: data.correct,
        total: data.total,
        streak: data.streak,
      });
    }

    return { success: true };
  }),

  getProgress: publicQuery.query(async ({ input }) => {
    const data = input as unknown as { userId: string };
    const db = getDb();

    const progress = await db.query.progressTable.findMany({
      where: eq(progressTable.userId, data.userId),
    });

    return progress;
  }),
});

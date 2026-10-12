import { authRouter } from "./auth-router";
import { mathRouter } from "./math-router";
import { teacherRouter } from "./teacher-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  math: mathRouter,
  teacher: teacherRouter,
});

export type AppRouter = typeof appRouter;


import { createTRPCRouter } from "~/server/api/trpc";
import { levelRouter } from "./routers/levels";
import { goalsRouter } from "./routers/goals";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  levels: levelRouter,
  goals: goalsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

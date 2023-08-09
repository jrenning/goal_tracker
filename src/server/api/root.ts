
import { createTRPCRouter } from "~/server/api/trpc";
import { levelRouter } from "./routers/levels";
import { goalsRouter } from "./routers/goals";
import { userRouter } from "./routers/user";
import { rewardsRouter } from "./routers/rewards";
import { historyRouter } from "./routers/history";
import { testRouter } from "./routers/tests";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  levels: levelRouter,
  goals: goalsRouter,
  rewards: rewardsRouter,
  history: historyRouter,
  tests: testRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

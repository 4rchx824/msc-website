import { createTRPCRouter } from "@/server/api/trpc";
import { competitionRouter } from "./routers/competition";
import { categoryRouter } from "./routers/category";
import { recordRouter } from "./routers/records";
import { disciplineRouter } from "./routers/disciplines";
import { contestentRouter } from "./routers/contestent";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  categories: categoryRouter,
  competitions: competitionRouter,
  records: recordRouter,
  disciplines: disciplineRouter,
  contestents: contestentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

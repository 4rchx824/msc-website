import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const disciplineRouter = createTRPCRouter({
  findMany: publicProcedure
    .input(
      z.object({
        competitionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const disciplines = await ctx.db.discipline.findMany({
        where: {
          competition_id: input.competitionId,
        },
      });
      
      return disciplines;
    }),
});

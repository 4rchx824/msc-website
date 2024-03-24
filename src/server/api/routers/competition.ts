import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const competitionRouter = createTRPCRouter({
  findMany: publicProcedure
    .input(
      z.object({
        length: z.number().optional(),
      }),
    )
    .query(({ input, ctx }) => {
      const limit = input.length ?? null;

      let records;
      if (limit) {
        records = ctx.db.competition.findMany({
          take: limit,
        });
      } else {
        records = ctx.db.competition.findMany();
      }

      return records;
    }),
  search: publicProcedure
    .input(
      z.object({
        category_id: z.string(),
        query: z.string(),
        page: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const page = input.page - 1;
      const result_count = 6;
      
      const results = await ctx.db.competition.findMany({
        where: {
          categoryId: input.category_id,
          name: {
            contains: input.query,
          },
        },
        skip: page * result_count,
        take: result_count,
        orderBy: {
          name: "asc",
        },
      });

      return results;
    }),
});

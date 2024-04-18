import { z } from "zod";

import {
  createTRPCRouter,
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
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        });
      } else {
        records = ctx.db.competition.findMany({
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        });
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
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        skip: page * result_count,
        take: result_count,
        orderBy: {
          name: "asc",
        },
      });

      const count = await ctx.db.competition.count({
        where: {
          categoryId: input.category_id,
          name: {
            contains: input.query,
          },
        },
      });

      const results_with_count = {
        results,
        count: count,
      };

      return results_with_count;
    }),

  findOne: publicProcedure
    .input(
      z.object({
        competitonId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const competition = await ctx.db.competition.findUnique({
        where: {
          cuid: input.competitonId,
        },
      });

      return competition;
    }),
});

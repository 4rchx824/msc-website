import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
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
        records = ctx.db.category.findMany({
          take: limit,
        });
      } else {
        records = ctx.db.category.findMany();
      }
      
      
      return records;
    }),
});

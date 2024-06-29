import { z } from "zod";

import {
  createTRPCRouter,
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
  findOne: publicProcedure.input(z.object({
    id: z.string()
  })).query(({ input, ctx }) => {
    return ctx.db.category.findFirst({
      where: {
        cuid: input.id,
      },
      include: {
        SBOR_Category: true,
      }
    });
  })
});

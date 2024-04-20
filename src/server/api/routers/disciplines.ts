import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const disciplineRouter = createTRPCRouter({
  findMany: publicProcedure
    .input(
      z.object({
        competitionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      // const disciplines = await ctx.db.discipline.findMany({
      //   where: {
      //     competition_id: input.competitionId,
      //   },
      // });

      // const data: Omit<Discipline, "competition_id" | "category_id">[] =
      //   await ctx.db.$queryRaw`
      //   SELECT
      //     "d"."cuid",
      //     "d"."name"
      //   FROM
      //     "Record" "r",
      //     "Discipline" "d"
      //   WHERE
      //     "r"."competition_id" = ${input.competitionId}
      //     AND "r"."discipline_id" = "d"."cuid"
      //   GROUP BY
      //     "r"."discipline_id",
      //     "d"."name",
      //     "d"."cuid"
      // `;

      const disciplines = await ctx.db.competitionDiscipline.findMany({
        where: {
          competition_id: input.competitionId,
        },
        select: {
          discipline: true,
        },
      });

      const sorted_disciplines = disciplines.map((d) => d.discipline);

      return sorted_disciplines;
    }),
  getRecords: publicProcedure
    .input(
      z.object({
        discipline_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const records = await ctx.db.record.findMany({
        where: {
          discipline_id: input.discipline_id,
        },
        include: {
          contestent: true,
          competition: true,
        },
        orderBy: {
          points: "desc",
        },
      });
      
      return records;
    }),
});

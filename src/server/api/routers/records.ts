import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { OverallRecord } from "@/app/competitions/[competition_id]/_components/RecordRow";

export type DisciplineWithRecord = {
  cuid: string;
  name: string;
  raw_score: number;
  time: number | null | undefined;
  points: number;
  contestent: {
    cuid: string;
    name: string;
  };
  competition: {
    cuid: string;
    name: string;
  };
};

export const recordRouter = createTRPCRouter({
  findMany: publicProcedure
    .input(
      z.object({
        disciplineId: z.string(),
        competitionId: z.string(),
        page: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result_count = 10;
      const page = input.page - 1;

      if (input.disciplineId === "OVERALL") {
        const records = await ctx.db.record.groupBy({
          where: {
            competition_id: input.competitionId,
          },
          by: ["contestent_id", "competition_id"],
          _sum: {
            points: true,
          },
          skip: page * result_count,
          take: result_count,
          orderBy: {
            _sum: {
              points: "desc",
            },
          },
        });

        const contestents = await ctx.db.contestent.findMany({});

        const recordsWithName: OverallRecord[] = [
          ...records.map((r) => {
            const contestent = contestents.find(
              (c) => c.cuid === r.contestent_id,
            );

            return {
              contestent: {
                cuid: contestent?.cuid ?? "NA",
                name: contestent?.name ?? "NA",
              },
              points: r._sum.points!,
              contestent_id: r.contestent_id,
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              competition_id: r.competition_id!,
            };
          }),
        ];

        const count = await ctx.db.record.groupBy({
          where: {
            competition_id: input.competitionId,
          },
          by: ["contestent_id", "competition_id"],
          _sum: {
            points: true,
          },
        });

        const results_with_count = {
          records: recordsWithName,
          count: count.length,
        };

        return results_with_count;
      }

      const records = await ctx.db.record.findMany({
        where: {
          discipline_id: input.disciplineId,
          competition_id: input.competitionId,
        },
        include: {
          contestent: true,
        },
        skip: page * result_count,
        take: result_count,
        orderBy: {
          raw_score: "desc",
        },
      });

      const count = await ctx.db.record.count({
        where: {
          discipline_id: input.disciplineId,
          competition_id: input.competitionId,
        },
      });

      const results_with_count = {
        records,
        count: count,
      };

      return results_with_count;
    }),
  findNational: publicProcedure.query(async ({ ctx }) => {
    const disciplines = await ctx.db.competitionDiscipline.findMany({
      distinct: ["discipline_id"],
      include: {
        discipline: true,
      },
      orderBy: {
        competition: {
          name: "asc",
        },
      },
    });

    const sorted_disciplines = disciplines.map((d) => {
      return {
        cuid: d.discipline.cuid,
        name: d.discipline.name,
      };
    });

    const national_record = await Promise.all(
      sorted_disciplines.map(async (d) => {
        const record = await ctx.db.record.findFirst({
          where: {
            discipline_id: d.cuid,
          },
          orderBy: {
            points: "desc",
          },
          take: 1,
          include: {
            contestent: true,
            competition: true,
          },
        });

        return {
          name: d.name,
          ...record,
          cuid: d.cuid,
        };
      }),
    );

    const discipline_with_records: DisciplineWithRecord[] = national_record.map(
      (r) => {
        return {
          cuid: r.cuid,
          name: r.name,
          raw_score: r.raw_score ?? 0,
          time: r.time ?? null,
          points: r.points ?? 0,
          contestent: {
            cuid: r.contestent?.cuid ?? "NA",
            name: r.contestent?.name ?? "NA",
          },
          competition: {
            cuid: r.competition?.cuid ?? "NA",
            name: r.competition?.name ?? "NA",
          },
        };
      },
    );

    return discipline_with_records;
  }),
  findOne: publicProcedure
    .input(
      z.object({
        disciplineId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const discipline = await ctx.db.discipline.findUnique({
        where: {
          cuid: input.disciplineId,
        },
      });

      return discipline;
    }),
});

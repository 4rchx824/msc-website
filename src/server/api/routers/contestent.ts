import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const enum Discipline {
  Images = "Images",
  Cards = "Cards",
  Names = "Names",
  Numbers = "Numbers",
  Words = "Words",
}

export const enum Difficulty {
  Beginner = "Beginner",
}

export type PersonalRecord = {
  cuid: string;
  discipline_name: string;
  discipline_id: string;
  points: number;
  raw_score: number;
  time: number | null | undefined;
  competition_id: string;
  competition_name: string;
  rank: number;
  contestent_id: string;
};

export const contestentRouter = createTRPCRouter({
  findOne: publicProcedure
    .input(
      z.object({
        contestentId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const contestent = await ctx.db.contestent.findUnique({
        where: {
          cuid: input.contestentId,
        },
      });

      return contestent;
    }),
  getRecords: publicProcedure
    .input(
      z.object({
        contestentId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const disciplines = await ctx.db.competitionDiscipline.findMany({
        include: {
          discipline: true,
        },
        orderBy: {
          discipline: {
            name: "asc",
          },
        },
      });

      const records = await Promise.all(
        disciplines.map(async (discipline) => {
          return await ctx.db.record.findFirst({
            where: {
              contestent_id: input.contestentId,
              discipline_id: discipline.discipline.cuid,
            },
            orderBy: {
              points: "desc",
            },
            include: {
              contestent: true,
              competition: true,
              discipline: true,
            },
          });
        }),
      );

      const records_with_rank = await Promise.all(
        records.map(async (record) => {
          const rank: [PersonalRecord] = await ctx.db.$queryRaw`
          SELECT
            *
          FROM
            (
              SELECT 
                "r"."cuid",
                "d"."name" as "discipline_name",
                "d"."cuid" as "discipline_id",
                "r"."points",
                "r"."raw_score",
                "r"."time",
                "r"."competition_id",
                "co"."name" as "competition_name",
                ROW_NUMBER() OVER (ORDER BY "r"."points" DESC, "c"."name" ASC) as "rank",
                "r"."contestent_id"
              FROM 
                "Record" "r", "Discipline" "d", "Contestent" "c", "Competition" "co"
              WHERE 
                "r"."discipline_id" = "d"."cuid"
                AND "r"."contestent_id" = "c"."cuid"
                AND "r"."competition_id" = "co"."cuid"
                AND "d"."cuid" = ${record?.discipline_id}
                AND "r"."competition_id" = ${record?.competition_id}
            ) as "rankings"
          WHERE 
            "rankings"."contestent_id" = ${record?.contestent_id}
        `;

          return rank[0];
        }),
      );

      return records_with_rank;
    }),
  getChartData: publicProcedure
    .input(
      z.object({
        contestentId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const rankings = {
        Beginner: {
          Ranking: {
            Images: {
              LEVEL_1: 20,
              LEVEL_2: 35,
              LEVEL_3: 50,
              LEVEL_4: 75,
              LEVEL_5: 100,
            },
            Cards: {
              LEVEL_1: 10,
              LEVEL_2: 16,
              LEVEL_3: 24,
              LEVEL_4: 38,
              LEVEL_5: 52,
            },
            Names: {
              LEVEL_1: 6,
              LEVEL_2: 9,
              LEVEL_3: 12,
              LEVEL_4: 15,
              LEVEL_5: 18,
            },
            Numbers: {
              LEVEL_1: 16,
              LEVEL_2: 32,
              LEVEL_3: 48,
              LEVEL_4: 64,
              LEVEL_5: 80,
            },
            Words: {
              LEVEL_1: 10,
              LEVEL_2: 15,
              LEVEL_3: 20,
              LEVEL_4: 25,
              LEVEL_5: 30,
            },
          },
          Category: "Beginner",
        },
      };

      const determine_level = (
        points: number,
        discipline: Discipline,
        difficulty: Difficulty,
      ) => {
        if (difficulty === Difficulty.Beginner) {
          const ranking: Record<string, number> =
            rankings.Beginner.Ranking[discipline];
          const level = Object.keys(ranking)
            .reverse()
            .find((level) => {
              return points >= ranking[level]!;
            });

          return parseInt(level?.split("_")[1] ?? "0");
        }
      };

      const hardcoded_discipline_ids = [
        {
          cuid: "clufccdbo000d51jwaxtl85b5",
          name: Discipline.Images,
        },
        {
          cuid: "clufccdbn000951jw12sspwsu",
          name: Discipline.Cards,
        },
        {
          cuid: "clufccdbo000h51jw691yoad8",
          name: Discipline.Names,
        },
        {
          cuid: "clufccdbo000g51jwssrw1vjj",
          name: Discipline.Numbers,
        },
        {
          cuid: "clufccdbn000a51jwyj1xvycr",
          name: Discipline.Words,
        },
      ];

      // const raw: { Raw: number; Discipline: string }[] = await ctx.db.$queryRaw`
      //   SELECT
      //     MAX(r."raw_score") as "Raw",
      //     d."name" as "Discipline"
      //   FROM
      //     "Record" "r", "Discipline" "d"
      //   WHERE
      //     r."discipline_id" = d."cuid"
      //     AND d."name" IN ('Images', 'Cards', 'Names', 'Numbers', 'Words')
      //     AND r."contestent_id" = ${input.contestentId}
      //   GROUP BY d."name"
      // `;

      const raw = await Promise.all(
        hardcoded_discipline_ids.map(async (d) => {
          const score = await ctx.db.record.findFirst({
            where: {
              contestent_id: input.contestentId,
              discipline_id: d.cuid,
            },
            orderBy: {
              points: "desc",
            },
          });

          return {
            Raw: score?.raw_score ?? 0,
            Discipline: d.name,
          };
        }),
      );

      console.log("raw", raw);

      const data = raw.map((record) => ({
        level: determine_level(
          record.Raw,
          record.Discipline as Discipline,
          Difficulty.Beginner,
        ),
        points: record.Raw,
        discipline: record.Discipline,
      }));

      if (data.length === 0) {
        return Object.keys(rankings[Difficulty.Beginner].Ranking).map(
          (discipline) => ({
            level: 0,
            points: 0,
            discipline: discipline as Discipline,
          }),
        );
      }

      const data_with_missing_disciplines = Object.keys(
        rankings[Difficulty.Beginner].Ranking,
      ).map((discipline) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        const found = data.find((record) => record.discipline === discipline);

        if (found) {
          return found;
        }

        return {
          level: 0,
          points: 0,
          discipline: discipline as Discipline,
        };
      });

      return data_with_missing_disciplines;
    }),
});

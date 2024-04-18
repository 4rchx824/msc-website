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
              LEVEL_4: 85,
              LEVEL_5: 100,
            },
            Cards: {
              LEVEL_1: 12,
              LEVEL_2: 24,
              LEVEL_3: 36,
              LEVEL_4: 46,
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

      const raw: { Points: number; Discipline: string }[] = await ctx.db
        .$queryRaw`
        SELECT 
          MAX(r."points") as "Points",
          d."name" as "Discipline"
        FROM 
          "Record" "r", "Discipline" "d" 
        WHERE 
          r."discipline_id" = d."cuid" 
          AND d."name" IN ('Images', 'Cards', 'Names', 'Numbers', 'Words') 
          AND r."contestent_id" = ${input.contestentId}
        GROUP BY d."name"
      `;

      const data = raw.map((record) => ({
        level: determine_level(
          record.Points,
          record.Discipline as Discipline,
          Difficulty.Beginner,
        ),
        points: record.Points,
        discipline: record.Discipline,
      }));

      console.log(data);

      // data.forEach((record) => {
      //   console.log(
      //     determine_level(
      //       record.points,
      //       record.discipline.name as Discipline,
      //       Difficulty.Beginner,
      //     ),
      //   );
      // });

      return data;
    }),
});

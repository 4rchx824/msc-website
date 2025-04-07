import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const sborRouter = createTRPCRouter({
  searchRecord: publicProcedure
    .input(
      z.object({
        category_id: z.string(),
        sbor_category_id: z.string(),
        record_title: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let records: { cuid: string; remarks: string | null }[];
      if (input.sbor_category_id === "ALL") {
        records = await ctx.db.$queryRaw`
          SELECT "cuid", "remarks", "date"
          FROM "SBOR_Record"
          WHERE ("record", "date") IN (
              SELECT "record", MAX("date")
              FROM "SBOR_Record"
              WHERE "record" ILIKE ${`%${input.record_title}%`}   
              GROUP BY "record", "date"
          )
          ORDER BY "date" DESC
          `;
      } else {
        records = await ctx.db.$queryRaw`
        SELECT "cuid", "remarks", "date"
        FROM "SBOR_Record"
        WHERE ("record", "date") IN (
            SELECT "record", MAX("date")
            FROM "SBOR_Record"
            WHERE "category_id" = ${input.sbor_category_id}
              AND "record" ILIKE ${`%${input.record_title}%`}   
            GROUP BY "record", "date"
        )
        ORDER BY "date" DESC
        `;
      }

      const records_with_contestent = await Promise.all(
        records.map(async (r) => {
          const record = await ctx.db.sBOR_Record.findUnique({
            where: {
              cuid: r.cuid,
            },
            include: {
              record_category: true,
              contestent: true,
              category: true,
            },
          });

          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          return record!;
        }),
      );

      return records_with_contestent;
    }),
});

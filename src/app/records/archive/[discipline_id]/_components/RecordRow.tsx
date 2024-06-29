import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import Image from "next/image";

type Record = inferRouterOutputs<AppRouter>["disciplines"]["getRecords"][0];

type Props = {
  record: Record;
  index: number;
};

function RecordRow({ record, index }: Props) {
  const rank = index + 1;
  const img = "medal";
  return (
    <TableRow>
      <TableCell
        className={cn([
          "text-center font-sansation-bold",
          rank >= 1 && rank <= 3 ? "flex items-center justify-center" : "",
        ])}
      >
        {rank === 1 ? (
          <Image
            src={`/leaderboard/${img}_1.png`}
            width={32}
            height={32}
            alt="1st"
          />
        ) : rank === 2 ? (
          <Image
            src={`/leaderboard/${img}_2.png`}
            width={32}
            height={32}
            alt="2nd"
          />
        ) : rank === 3 ? (
          <Image
            src={`/leaderboard/${img}_3.png`}
            width={32}
            height={32}
            alt="3rd"
          />
        ) : (
          <h1>{rank}</h1>
        )}
      </TableCell>
      <TableCell
        className={cn([
          record.contestent.cuid === "NA"
            ? ""
            : "font-sansation text-primary-blue underline",
        ])}
      >
        {record.contestent.cuid === "NA" ? (
          record.contestent.name
        ) : (
          <Link href={`/contestents/${record.contestent.cuid}`}>
            {record.contestent.name}
          </Link>
        )}
      </TableCell>
      <TableCell className="font-sansation-bold">{record.raw_score}</TableCell>
      <TableCell
        className={cn([
          record.competition?.cuid === "NA"
            ? ""
            : "font-sansation text-primary-blue underline",
        ])}
      >
        {record.competition?.cuid === "NA" ? (
          record.competition?.name
        ) : (
          <a href={`/competitions/${record.competition?.cuid}`}>
            {record.competition?.name}
          </a>
        )}
      </TableCell>
    </TableRow>
  );
}

export default RecordRow;

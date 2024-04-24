import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { PersonalRecord } from "@/server/api/routers/contestent";

type Props = {
  record: PersonalRecord;
};

function RecordRow({ record }: Props) {
  const rank = Number(record.rank);
  const img = "medal";

  return (
    <TableRow>
      <TableCell className="font-sansation text-primary-blue underline">
        <Link href={`/records/${record.discipline_id}`}>{record.discipline_name}</Link>
      </TableCell>
      <TableCell className="text-center font-sansation">
        {record.raw_score}
      </TableCell>
      <TableCell
        className={cn([
          "text-center font-sansation",
          record.time === null ? "opacity-50" : "",
        ])}
      >
        {record.time ?? "NA"}
      </TableCell>
      <TableCell className="text-center">{record.points}</TableCell>
      <TableCell className={"font-sansation text-primary-blue underline"}>
        <a href={`/competitions/${record.competition_id}`}>
          {record.competition_name}
        </a>
      </TableCell>
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
    </TableRow>
  );
}

export default RecordRow;

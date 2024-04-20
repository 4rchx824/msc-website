import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import type { DisciplineWithRecord } from "@/server/api/routers/records";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  record: DisciplineWithRecord;
};

function RecordRow({ record }: Props) {
  return (
    <TableRow>
      <TableCell className="font-sansation text-primary-blue underline">
        <Link href={`/records/${record.cuid}`}>{record.name}</Link>
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
      <TableCell className="font-sansation-bold">{record.points}</TableCell>
      <TableCell
        className={cn([
          record.competition.cuid === "NA"
            ? ""
            : "font-sansation text-primary-blue underline",
        ])}
      >
        {record.competition.cuid === "NA" ? (
          record.competition.name
        ) : (
          <a href={`/competitions/${record.competition.cuid}`}>
            {record.competition.name}
          </a>
        )}
      </TableCell>
    </TableRow>
  );
}

export default RecordRow;

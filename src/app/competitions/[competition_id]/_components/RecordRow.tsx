import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Contestent, Record } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export type OverallRecord = {
  contestent: {
    name: string;
  };
  points: number;
  contestent_id: string;
  competition_id: string;
};

type Props = {
  record: (Record & { contestent: Contestent }) | OverallRecord;
  index: number;
  page: number;
  per_page: number;
  discipline_id: string;
};

const RecordRow = ({ record, index, page, per_page, discipline_id }: Props) => {
  record = record as Record & { contestent: Contestent };
  const starting = (page - 1) * per_page;
  const rank = starting + index + 1;
  const img = discipline_id === "OVERALL" ? "trophy" : "medal";
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
      <TableCell className="font-sansation">
        <Link
          href={`/contestents/${record.contestent_id}`}
          className="text-primary-blue underline"
        >
          {record.contestent.name}
        </Link>
      </TableCell>
      {discipline_id !== "OVERALL" && (
        <>
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
        </>
      )}

      <TableCell className="text-center font-sansation">
        {record.points}
      </TableCell>
    </TableRow>
  );
};

export default RecordRow;

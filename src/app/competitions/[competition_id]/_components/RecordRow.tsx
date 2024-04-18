import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Contestent, Record } from "@prisma/client";
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
};

const RecordRow = ({ record, index, page, per_page }: Props) => {
  const starting = (page - 1) * per_page;
  const rank = starting + index + 1;
  return (
    <TableRow>
      <TableCell
        className={cn([
          "text-center font-sansation-bold",
          rank >= 1 && rank <= 3 ? "flex items-center justify-center" : "",
        ])}
      >
        <h1
          className={cn([
            "rounded-full px-4 py-2",
            rank === 1 ? "bg-yellow-300  text-yellow-900" : "",
            rank === 2 ? " bg-gray-300 text-gray-900" : "",
            rank === 3 ? "bg-amber-900 text-amber-300" : "",
          ])}
        >
          {rank}
        </h1>
      </TableCell>
      <TableCell className="font-sansation">
        <Link
          href={`/contestents/${record.contestent_id}`}
          className="text-primary-blue underline"
        >
          {record.contestent.name}
        </Link>
      </TableCell>
      <TableCell className="text-center font-sansation">
        {record.points}
      </TableCell>
    </TableRow>
  );
};

export default RecordRow;

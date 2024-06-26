import { api } from "@/trpc/react";
import type { Competition } from "@prisma/client";
import React, { useEffect } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RecordRow from "./RecordRow";
import CustomPagination from "@/components/shared/custom-pagination";
import type { OmittedDiscipline } from "./RecordFilter";

type Props = {
  discipline: OmittedDiscipline;
  competition: Competition | null | undefined;
};
const RecordResult = ({ discipline, competition }: Props) => {
  const [page, setPage] = React.useState(1);

  const { data: records } = api.records.findMany.useQuery({
    competitionId: competition!.cuid,
    disciplineId: discipline.cuid,
    page: page,
  });

  useEffect(() => {
    setPage(1);
  }, [discipline]);

  const count = records?.count ?? 0;
  const per_page = 10;

  return (
    <div className="mt-12 flex flex-col items-center space-y-4 rounded-xl bg-white p-4">
      <h1 className="font-sansation-bold text-2xl text-primary-blue">
        {discipline.name}
      </h1>

      <div className="w-full">
        <Table>
          {records?.records?.length === 0 && (
            <TableCaption className="py-12">
              Sorry, there are no records for {discipline.name}.
            </TableCaption>
          )}

          <TableHeader>
            <TableRow>
              <TableHead className="w-[24px] text-center font-sansation-bold">
                Rank
              </TableHead>
              <TableHead className="font-sansation-bold">Competitor</TableHead>
              {discipline.cuid !== "OVERALL" && (
                <>
                  <TableHead className="text-center font-sansation-bold">
                    Raw Score
                  </TableHead>
                  <TableHead className="text-center font-sansation-bold">
                    Time
                  </TableHead>
                </>
              )}

              <TableHead className="text-center font-sansation-bold">
                Points
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records?.records?.map((record, index) => (
              <RecordRow
                key={record.contestent_id}
                record={record}
                index={index}
                page={page}
                per_page={per_page}
                discipline_id={discipline.cuid}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {count > 0 && (
        <CustomPagination
          count={count}
          page={page}
          setPage={setPage}
          per_page={per_page}
        />
      )}
    </div>
  );
};

export default RecordResult;

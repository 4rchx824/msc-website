"use client";

import { useParams } from "next/navigation";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import RecordRow from "./_components/RecordRow";

const Page = () => {
  const { discipline_id }: { discipline_id: string } = useParams();

  const { data: record, isLoading } = api.records.findOne.useQuery({
    disciplineId: discipline_id,
  });

  const { data: records } = api.disciplines.getRecords.useQuery({
    discipline_id: discipline_id,
  });

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center bg-[#E7E7E7]">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="mt-12 flex w-full max-w-5xl flex-col items-center rounded-xl bg-white p-4 ">
          <h1 className="font-sansation-bold text-3xl text-primary-blue">
            {record?.name}
          </h1>

          <Table>
            <TableCaption>National Records for {record?.name}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-max font-sansation-bold">
                  Rank
                </TableHead>
                <TableHead className="w-max font-sansation-bold">
                  Competitor
                </TableHead>
                <TableHead className="font-sansation-bold">Score</TableHead>
                <TableHead className="font-sansation-bold">
                  Competition
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.map((record, index) => (
                <RecordRow key={record.cuid} record={record} index={index} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Page;

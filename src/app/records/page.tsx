import React from "react";
import { api } from "@/trpc/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RecordRow from "./_components/RecordRow";

export const dynamic = "force-dynamic";

const Page = async () => {
  const data = await api.records.findNational.query();

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center bg-[#E7E7E7]">
      <div className="mt-12 flex w-full max-w-5xl flex-col items-center rounded-xl bg-white p-4 ">
        <h1 className="font-sansation-bold text-3xl text-primary-blue">
          National Records
        </h1>

        <Table>
          <TableCaption>National Records for all Disciplines</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-max font-sansation-bold text-black">
                Discipline
              </TableHead>
              <TableHead className="w-max font-sansation-bold text-black">
                Competitor
              </TableHead>
              <TableHead className="font-sansation-bold text-black">
                Score
              </TableHead>
              <TableHead className="font-sansation-bold text-black">
                Competition
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record) => (
              <RecordRow key={record.cuid} record={record} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;

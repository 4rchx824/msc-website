"use client";
import React from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RecordRow from "./_components/RecordRow";
import type { PersonalRecord } from "@/server/api/routers/contestent";

const Page = () => {
  const { contestent_id }: { contestent_id: string } = useParams();

  const { data: contestent } = api.contestents.findOne.useQuery({
    contestentId: contestent_id,
  });

  const { data: chartData, isLoading } = api.contestents.getChartData.useQuery({
    contestentId: contestent_id,
  });

  const { data: records, isLoading: isLoadingRecords } =
    api.contestents.getRecords.useQuery({
      contestentId: contestent_id,
    }) as { data: PersonalRecord[]; isLoading: boolean };

    console.log(records)
  return (
    <div className="flex min-h-[100dvh] flex-col items-center bg-[#E7E7E7]">
      <div className="my-12 flex w-full max-w-5xl flex-col space-y-8 rounded-xl bg-white p-4">
        <h1 className="text-center font-sansation-bold text-4xl text-primary-blue">
          {contestent?.name}
        </h1>

        {!isLoading && (
          <ResponsiveContainer
            width={"100%"}
            height={330}
            className={"w-full max-w-5xl"}
          >
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="90%"
              data={chartData}
              className="h-64 w-64"
            >
              <PolarGrid stroke="#000" opacity={1} />
              <PolarAngleAxis
                dataKey="discipline"
                tick={{
                  fill: "#4169e1",
                  fontWeight: "bold",
                  fontFamily: "sansation",
                }}
              />
              <PolarRadiusAxis
                domain={[0, 5]}
                tickCount={6}
                angle={18}
                tick={{
                  fill: "#000000",
                  fontWeight: "bold",
                }}
              />
              <Radar
                name={contestent?.name}
                dataKey="level"
                stroke="#4169e1"
                fill="#b5d2ec"
                fillOpacity={0.7}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}

        <h1 className="text-center font-sansation-bold text-3xl text-primary-blue">
          Personal Records
        </h1>

        {!isLoadingRecords && (
          <Table>
            <TableCaption>Personal Records for all Disciplines</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-max font-sansation-bold">
                  Discipline
                </TableHead>
                <TableHead className="text-center font-sansation-bold">
                  Raw
                </TableHead>
                <TableHead className="text-center font-sansation-bold">
                  Time
                </TableHead>
                <TableHead className="text-center font-sansation-bold">
                  Points
                </TableHead>
                <TableHead className="w-max font-sansation-bold">
                  Competition
                </TableHead>
                <TableHead className="text-center font-sansation-bold">
                  Rank
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.map((record) => (
                <RecordRow key={record.cuid} record={record} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Page;

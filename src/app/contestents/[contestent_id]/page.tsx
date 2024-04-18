"use client";
import { Discipline } from "@/server/api/routers/contestent";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import React, { PureComponent } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  level: number;
  points: number;
  discipline: Discipline;
};

const Page = () => {
  const { contestent_id }: { contestent_id: string } = useParams();

  const { data: contestent } = api.contestents.findOne.useQuery({
    contestentId: contestent_id,
  });

  const { data: chartData, isLoading } = api.contestents.getChartData.useQuery({
    contestentId: contestent_id,
  });

  console.log(chartData);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center bg-[#E7E7E7]">
      <div className="mt-12 flex w-full max-w-5xl flex-col rounded-xl bg-white p-4">
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
                angle={55}
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
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Page;

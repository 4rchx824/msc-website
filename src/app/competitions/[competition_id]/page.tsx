"use client";
import { api } from "@/trpc/react";
import type { Discipline } from "@prisma/client";
import { useParams } from "next/navigation";
import React from "react";
import RecordFilter from "./_components/RecordFilter";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import RecordResults from "./_components/RecordResults";

const Page = () => {
  const { competition_id } = useParams();

  const { data: competition, isLoading } = api.competitions.findOne.useQuery({
    competitonId: competition_id as string,
  });

  const { data: disciplines } = api.disciplines.findMany.useQuery({
    competitionId: competition?.cuid ?? "",
  });

  const [discipline, setDiscipline] = React.useState<Discipline>({
    category_id: "OVERALL",
    competition_id: "OVERALL",
    cuid: "OVERALL",
    name: "OVERALL",
  });

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center bg-[#E7E7E7]">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="mt-12 flex w-full max-w-5xl flex-col">
          <Link
            href="/competitions"
            className="flex w-full items-center text-primary-blue"
          >
            <ChevronLeft size={24} />
            <h1 className="font-sansation-bold">Competitions</h1>
          </Link>

          <RecordFilter
            competition={competition}
            disciplines={disciplines}
            discipline={discipline}
            setDiscipline={setDiscipline}
          />

          <RecordResults discipline={discipline} competition={competition} />
        </div>
      )}
    </div>
  );
};

export default Page;

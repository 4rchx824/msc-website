"use client";
import { api } from "@/trpc/react";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import RecordFilter, {
  type OmittedDiscipline,
} from "./_components/RecordFilter";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import RecordResults from "./_components/RecordResults";

const Page = () => {
  const { competition_id }: { competition_id: string } = useParams();
  const searchParams = useSearchParams();

  const { data: competition, isLoading } = api.competitions.findOne.useQuery({
    competitonId: competition_id,
  });

  const { data: disciplines } = api.disciplines.findMany.useQuery({
    competitionId: competition?.cuid ?? "",
  });

  const discipline_id = searchParams.get("discipline_id");

  const [discipline, setDiscipline] = React.useState<OmittedDiscipline>({
    cuid: "OVERALL",
    name: "OVERALL",
  });

  useEffect(() => {
    const found_discipline = disciplines?.find((d) => d.cuid === discipline_id);

    if (discipline_id === "OVERALL") {
      setDiscipline({
        cuid: "OVERALL",
        name: "OVERALL",
      });
    } else if (found_discipline) {
      setDiscipline(found_discipline);
    }
  }, [discipline_id, disciplines]);

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
          />

          <RecordResults discipline={discipline} competition={competition} />
        </div>
      )}
    </div>
  );
};

export default Page;

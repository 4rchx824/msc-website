import { cn } from "@/lib/utils";
import type { Competition, Discipline } from "@prisma/client";
import { ChevronLeft } from "lucide-react";

type Props = {
  competition: Competition | null | undefined;
  disciplines: Discipline[] | null | undefined;
  discipline: Discipline;
  setDiscipline: React.Dispatch<React.SetStateAction<Discipline>>;
};

const RecordFilter = ({
  competition,
  disciplines,
  discipline,
  setDiscipline,
}: Props) => {
  return (
    <div className="mt-2 flex w-full flex-col space-y-8">
      <div className="flex flex-col items-center rounded-xl bg-white p-4">
        <h1 className="font-sansation-bold text-3xl text-primary-blue">
          {competition?.name}
        </h1>

        <div className="flex flex-wrap justify-center items-center space-x-2 pt-4">
          <button
            onClick={() =>
              setDiscipline({
                category_id: "OVERALL",
                competition_id: "OVERALL",
                cuid: "OVERALL",
                name: "OVERALL",
              })
            }
            className={cn([
              "my-1 rounded-md bg-gray-200 px-12 py-2 font-sansation-bold hover:opacity-90",
              discipline?.cuid === "OVERALL"
                ? "bg-primary-blue text-white"
                : "",
            ])}
          >
            Overall
          </button>

          {disciplines?.map((c) => (
            <button
              key={c.cuid}
              onClick={() => setDiscipline(c)}
              className={cn([
                "my-1 rounded-md bg-gray-200 px-12 py-2 font-sansation-bold hover:opacity-90",
                discipline?.cuid === c.cuid ? "bg-primary-blue text-white" : "",
              ])}
            >
              {c.name}
            </button>
          ))}

          {disciplines?.length === 0 && (
            <h1 className="text-lg">No disciplines found.</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordFilter;

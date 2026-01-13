import { cn } from "@/lib/utils";
import type { Competition, Discipline } from "@prisma/client";
import { useRouter } from "next/navigation";

export type OmittedDiscipline = Omit<
  Discipline,
  "competition_id" | "category_id"
>;

type Props = {
  competition: Competition | null | undefined;
  disciplines: OmittedDiscipline[] | null | undefined;
  discipline: OmittedDiscipline;
};

const RecordFilter = ({
  competition,
  disciplines,
  discipline,
}: Props) => {
  const router = useRouter();
  return (
    <div className="mt-2 flex w-full flex-col space-y-8">
      <div className="flex flex-col items-center rounded-xl bg-white p-4">
        <h1 className="font-sansation-bold text-3xl text-primary-blue">
          {competition?.name}
        </h1>

        <div className="flex flex-wrap items-center justify-center space-x-2 pt-4">
          <button
            onClick={() =>
              router.push(`/competitions/${competition?.cuid}?discipline_id=OVERALL`)
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
              onClick={() => router.push(`/competitions/${competition?.cuid}?discipline_id=${c.cuid}`)}
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

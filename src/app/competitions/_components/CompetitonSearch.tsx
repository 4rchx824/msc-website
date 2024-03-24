"use client";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { Category, Competition } from "@prisma/client";
import React, { useState } from "react";

type Props = {
  categories: Category[];
  competitions: Competition[];
};

const CompetitonSearch = ({ categories, competitions }: Props) => {
  const default_category = categories[0];

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(
    default_category?.cuid ?? null,
  );

  const { data, refetch, isLoading } = api.competition.search.useQuery(
    {
      category_id: default_category!.cuid,
      page: page,
      query: "",
    },
    {
      initialData: competitions,
    },
  );

  console.log(data);

  return (
    <div className="flex w-full max-w-5xl flex-col space-y-8">
      <div className="mt-12 flex flex-col items-center rounded-xl bg-white p-4">
        <h1 className="font-sansation-bold text-3xl text-primary-blue">
          Category
        </h1>

        <div className="flex flex-wrap space-x-2 pt-4">
          {categories.map((c) => (
            <button
              key={c.cuid}
              onClick={() => setCategory(c.cuid)}
              className={cn([
                "rounded-md bg-gray-200 px-12 py-2 font-sansation-bold hover:opacity-90",
                category === c.cuid ? "bg-primary-blue text-white" : "",
              ])}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center rounded-xl bg-white p-4">
        {data.map((c) => (
          <div key={c.cuid}>{c.name}</div>
        ))}
      </div>
    </div>
  );
};

export default CompetitonSearch;

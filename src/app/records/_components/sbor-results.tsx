"use client";

import React, { useState } from "react";

import type { appRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import useDebounce from "@/lib/useDebounce";
import SBORCard from "./sbor-card";

type Category = inferRouterOutputs<typeof appRouter>["categories"]["findOne"];
type Props = {
  category: Category;
};

const SBORResults = ({ category }: Props) => {
  const { category_id }: { category_id: string } = useParams();
  const [recordCategoryId, setRecordCategoryId] = useState<string>("ALL");
  const [recordName, setRecordName] = useState<string>("");
  const debouncedInput = useDebounce(recordName, 1000);

  const { data, isLoading } = api.sbor.searchRecord.useQuery({
    sbor_category_id: recordCategoryId,
    category_id: category_id,
    record_title: debouncedInput,
  });

  return (
    <div className="flex w-full max-w-5xl flex-col py-8 ">
      <div className="mt-12 flex flex-col items-center rounded-xl bg-white p-4 ">
        <h1 className="font-sansation-bold text-3xl text-primary-blue">
          {category?.name} Records
        </h1>

        <div className="flex flex-wrap items-center justify-center space-x-2 pt-4">
          <button
            onClick={() => setRecordCategoryId("ALL")}
            className={cn([
              "my-1 rounded-md bg-gray-200 px-12 py-2 font-sansation-bold hover:opacity-90",
              recordCategoryId === "ALL" ? "bg-primary-blue text-white" : "",
            ])}
          >
            Overall
          </button>

          {category?.SBOR_Category.map((c) => (
            <button
              key={c.cuid}
              onClick={() => setRecordCategoryId(c.cuid)}
              className={cn([
                "my-1 rounded-md bg-gray-200 px-12 py-2 font-sansation-bold hover:opacity-90",
                recordCategoryId === c.cuid ? "bg-primary-blue text-white" : "",
              ])}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center space-y-4 rounded-xl bg-white p-4">
        <form className="flex w-full items-center justify-center rounded-md border px-2">
          <SearchIcon size={24} className="stroke-1" />
          <Input
            disabled={category?.SBOR_Category.length === 0}
            placeholder="Search by record name"
            className="!border-0 !ring-0 !ring-offset-0"
            value={recordName}
            name="query"
            onChange={(e) => setRecordName(e.target.value)}
          />
        </form>

        {isLoading && <h1 className="py-12">Loading...</h1>}

        {!isLoading && (
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
            {(data ?? []).map((r) => (
              <SBORCard record={r} key={r.cuid} />
            ))}
          </div>
        )}

        {data && data.length === 0 && (
          <h1 className="py-12">No records found</h1>
        )}
      </div>
    </div>
  );
};

export default SBORResults;

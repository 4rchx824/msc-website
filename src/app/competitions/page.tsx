import { api } from "@/trpc/server";
import React from "react";
import CompetitonSearch from "./_components/CompetitonSearch";
import type { Category, Competition } from "@prisma/client";

export type CompetitionWithCategory = Competition & {
  category: {
    name: string;
  };
};

export type CompetitionSearchResults = {
  results: CompetitionWithCategory[];
  count: number;
};

export type CompetitionSearchOptions = {
  category_id: string;
  page: number;
  query: string;
};

const Page = async () => {
  let categories = [] as Category[];

  let searchOptions = {
    category_id: "",
    page: 1,
    query: "",
  };

  categories = await api.categories.findMany.query({});

  if (categories.length > 0) {
    const initial_category = categories[0];
    const initial_page = 1;

    searchOptions = {
      category_id: initial_category!.cuid,
      page: initial_page,
      query: "",
    };
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center bg-[#E7E7E7]">
      <CompetitonSearch categories={categories} searchOptions={searchOptions} />
    </div>
  );
};

export default Page;

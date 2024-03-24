import { api } from "@/trpc/server";
import React from "react";
import CompetitonSearch from "./_components/CompetitonSearch";

const Page = async () => {
  const categories = await api.category.findMany.query({});
  const competitions = await api.competition.findMany.query({});
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center bg-[#E7E7E7]">
      <CompetitonSearch competitions={competitions} categories={categories} />
    </div>
  );
};

export default Page;

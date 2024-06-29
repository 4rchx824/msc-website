"use client";
import Loading from "@/components/shared/loading";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import React from "react";
import SBORResults from "../_components/sbor-results";

const Page = () => {
  const { category_id }: { category_id: string } = useParams();
  const { data, isLoading } = api.categories.findOne.useQuery({
    id: category_id,
  });
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center bg-[#E7E7E7]">
      {isLoading ? (
        <div className="mt-12 flex w-full max-w-5xl flex-col items-center rounded-xl bg-white p-4 py-12">
          <Loading />
        </div>
      ) : data === null ? (
        <div className="mt-12 flex w-full max-w-5xl flex-col items-center rounded-xl bg-white p-4 ">
          <h1 className="font-sansation-bold text-3xl text-primary-blue">
            Sorry, this category does not exist.
          </h1>
        </div>
      ) : (
        data && <SBORResults category={data} />
      )}
    </div>
  );
};

export default Page;

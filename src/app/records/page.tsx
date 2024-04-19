import { api } from "@/trpc/server";
import React from "react";

export const dynamic = "force-dynamic";

const Page = async () => {
  const data = await api.records.findNational.query();

  console.log(data);
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center bg-[#E7E7E7]"></div>
  );
};

export default Page;

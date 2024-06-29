"use client";

import React from "react";

import { RocketIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartialCategory } from "../page";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  c: PartialCategory;
};

const CategoryCard = ({ c }: Props) => {
  const router = useRouter();
  return (
    <button
    
      onClick={() => c.name !== "TBC" && void router.push(`/records/${c.cuid}`)}
      className={cn([
        "flex h-[275px] w-[275px] flex-col items-center justify-center space-y-4 rounded-3xl border py-8",
        c.name !== "TBC"
          ? "cursor-pointer shadow-lg transition-shadow hover:shadow-xl"
          : "cursor-default ",
      ])}
    >
      {c.img_url ? (
        <Image
          alt="Icon"
          className="h-[150px] w-[150px] object-contain object-center"
          src={c.img_url ?? ""}
          width={200}
          height={200}
        />
      ) : (
        <RocketIcon width={150} height={150} className="text-gray-300" />
      )}
      <h1
        className={cn([
          "w-full truncate overflow-ellipsis px-8 font-sansation-bold text-3xl",
          c.name === "TBC" ? "text-gray-400" : "",
        ])}
      >
        {c.name}
      </h1>
    </button>
  );
};

export default CategoryCard;

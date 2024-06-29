"use client";

import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { NavbarItem } from "../navbar";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { api } from "@/trpc/react";
import Loading from "../loading";
import Link from "next/link";

type Props = {
  item: NavbarItem;
};

const RecordsDropdown = ({ item }: Props) => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = api.categories.findMany.useQuery({});
  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <div
          className={cn([
            item.current || open
              ? "!border-y-2 !border-primary-blue !text-primary-blue"
              : "hover:border-y-2 hover:border-primary-blue hover:text-primary-blue",
            "flex cursor-pointer items-center border-y-2 border-transparent px-3 py-1 font-sansation-bold text-base transition-all",
          ])}
        >
          <h1>{item.name}</h1>
          <ChevronDown
            className={cn([
              "ml-2 h-4 w-4 transition-all duration-300",
              open ? "rotate-180" : "",
            ])}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isLoading ? (
          <div className="grid h-12 w-full place-content-center">
            <Loading />
          </div>
        ) : (
          data?.map((category) => (
            <Link href={`/records/${category.cuid}`} key={category.cuid}>
              <DropdownMenuItem className="cursor-pointer font-sansation-bold text-base hover:text-primary-blue">
                {category.name}
              </DropdownMenuItem>
            </Link>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecordsDropdown;

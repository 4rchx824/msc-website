"use client";
import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type Props = {
  count: number;
  page: number;
  per_page: number;
  setPage: (page: number) => void;
};

const CustomPagination = ({ count, page, setPage, per_page }: Props) => {
  const max_page = Math.ceil(count / per_page);

  const handlePrev = () => {
    setPage(page - 1 === 0 ? 1 : page - 1);
  };

  const handleNext = () => {
    setPage(page + 1 > max_page ? max_page : page + 1);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn([
              page - 1 === 0
                ? "cursor-not-allowed hover:bg-transparent"
                : "cursor-pointer",
            ])}
            onClick={handlePrev}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>{page}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className={cn([
              page + 1 > max_page
                ? "cursor-not-allowed hover:bg-transparent"
                : "cursor-pointer",
            ])}
            onClick={handleNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;

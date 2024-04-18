"use client";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { Category, Competition } from "@prisma/client";
import React, {
  FormEvent,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import debounce from "lodash/debounce";
import CompetitionCard from "./CompetitionCard";

import type {
  CompetitionSearchOptions,
  CompetitionSearchResults,
} from "../page";
import CompetitionResultPagination from "../../_components/CustomPagination";

type Props = {
  categories: Category[];
  competitions: CompetitionSearchResults;
  searchOptions: CompetitionSearchOptions;
};

const CompetitonSearch = ({
  categories,
  competitions,
  searchOptions,
}: Props) => {
  const ctx = api.useUtils();
  const [search, setSearch] = useState({
    categoryId: searchOptions.category_id,
    page: searchOptions.page,
    query: searchOptions.query,
  });

  const [results, setResults] = useState(competitions);

  const { data, refetch, isFetching } = api.competitions.search.useQuery(
    {
      category_id: search.categoryId!,
      page: search.page,
      query: search.query,
    },
    {
      enabled: false,
      initialData: results,
    },
  );

  const setCategoryId = (id: string) => {
    setSearch({
      ...search,
      categoryId: id,
    });
  };

  const setPage = (page: number) => {
    setSearch({
      ...search,
      page,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void refetch();
  };

  const debouncedSearch = useCallback(
    debounce(async () => {
      await refetch();
      setResults(data);
    }, 1000),
    [],
  );

  useEffect(() => {
    debouncedSearch();
  }, [search.query]);

  useEffect(() => {
    void refetch();
  }, [search.page]);

  useEffect(() => {
    setSearch({
      ...search,
      categoryId: search.categoryId,
      page: searchOptions.page,
    });
    void refetch();
  }, [search.categoryId]);

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
              onClick={() => setCategoryId(c.cuid)}
              className={cn([
                "rounded-md bg-gray-200 px-12 py-2 font-sansation-bold hover:opacity-90",
                search.categoryId === c.cuid
                  ? "bg-primary-blue text-white"
                  : "",
              ])}
            >
              {c.name}
            </button>
          ))}

          {categories.length === 0 && (
            <h1 className="text-lg">No categories found.</h1>
          )}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center space-y-4 rounded-xl bg-white p-4">
        <form
          className="flex w-full items-center justify-center rounded-md border px-2"
          onSubmit={handleSubmit}
        >
          <SearchIcon size={24} className="stroke-1" />
          <Input
            disabled={categories.length === 0}
            placeholder="Search"
            className="!border-0 !ring-0 !ring-offset-0"
            value={search.query}
            name="query"
            onChange={handleInputChange}
          />
        </form>

        {isFetching && <h1 className="py-12">Loading...</h1>}

        {!isFetching && (
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
            {(data?.results ?? []).map((c) => (
              <CompetitionCard competiton={c} key={c.cuid} />
            ))}
          </div>
        )}

        {data.results.length === 0 && (
          <h1 className="py-12">No competitions found</h1>
        )}

        {data.results.length > 0 && (
          <CompetitionResultPagination
            per_page={6}
            count={data.count}
            page={search.page}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default CompetitonSearch;

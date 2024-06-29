"use client";
import React from "react";

import type { appRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";

type Record = inferRouterOutputs<typeof appRouter>["sbor"]["searchRecord"][0];
type Props = {
  record: Record;
};

const SBORCard = ({ record }: Props) => {
  return (
    <div className="flex flex-col space-y-2 rounded-lg border shadow-md hover:shadow-lg">
      <Image
        className="h-48 rounded-t-lg object-cover object-center"
        src={record.img_url ?? "/no_photo.jpg"}
        width={500}
        height={500}
        alt="Event picture"
      />

      <div className="flex flex-grow flex-col justify-between px-4 py-2">
        <h1 className="font-sansation-bold text-lg text-primary-blue">
          {record.record}
        </h1>

        <p className="text-gray-600">{record.remarks}</p>

        <p className="text-gray-00 pt-4 text-xs">
          {dayjs(record.date).format("DD MMM YYYY")}
        </p>
        <div className="flex items-center space-x-2 pb-2 pt-2">
          <Badge className="bg-blue-200 text-blue-900 hover:bg-blue-100">
            {record.category.name}
          </Badge>
          <Badge className="bg-purple-200 text-purple-900 hover:bg-purple-100">
            {record.record_category.name}
          </Badge>
        </div>
        <Link href={record.link ?? ""} className="mb-2 mt-4 flex items-center space-x-1 rounded-md hover:text-primary-blue transition-colors justify-end" target="_blank">
          <h1>Read More</h1> <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default SBORCard;

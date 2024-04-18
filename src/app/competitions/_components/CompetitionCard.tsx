import React from "react";

import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import Image from "next/image";
import { CompetitionWithCategory } from "../page";
import Link from "next/link";

type Props = {
  competiton: CompetitionWithCategory;
};

const CompetitionCard = ({ competiton }: Props) => {
  return (
    <Link
      href={`/competitions/${competiton.cuid}`}
      key={competiton.cuid}
      className="flex flex-col space-y-2 rounded-lg border shadow-md hover:shadow-lg"
    >
      <Image
        className="h-48 rounded-t-lg object-cover object-center"
        src={competiton.img_url ?? "/no_photo.jpg"}
        width={500}
        height={500}
        alt="Event picture"
      />
      <div className="flex flex-grow flex-col justify-between px-4 py-2">
        <h1 className="font-sansation-bold text-lg text-primary-blue">
          {competiton.name}
        </h1>

        <div className="flex items-center space-x-2 pb-2 pt-4">
          <p className="text-sm">
            {dayjs(competiton.date).format("DD MMM YYYY")}
          </p>
          <Badge className="bg-blue-200 text-blue-900 hover:bg-blue-100">
            #{competiton.category.name}
          </Badge>
        </div>
      </div>
    </Link>
  );
};

export default CompetitionCard;

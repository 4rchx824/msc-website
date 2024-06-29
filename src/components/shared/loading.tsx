import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import React from "react";
type Props = {
  className?: string;
};
const Loading = ({ className }: Props) => {
  return (
    <Loader2Icon
      className={cn(["h-6 w-6 animate-spin text-primary-blue", className])}
    />
  );
};

export default Loading;

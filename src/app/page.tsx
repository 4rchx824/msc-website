import Image from "next/image";
import { api } from "@/trpc/server";
import type { Category } from "@prisma/client";
import { RocketIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function Home() {
  const competitions = await api.competition.findMany.query({
    length: 3,
  });

  const categories = (await api.category.findMany.query({
    length: 4,
  })) as Partial<Category>[];

  if (categories.length < 4) {
    for (let i = categories.length; i < 4; i++) {
      categories.push({
        cuid: "" + Math.random(),
        name: "TBC",
      });
    }
  }

  console.log(categories);

  return (
    <div className="min-h-[100dvh] w-full">
      <div className="relative flex min-h-screen items-center justify-center bg-hero bg-cover bg-center">
        <Image
          src={"/stats.png"}
          alt="Stats"
          width={750}
          height={1000}
          className="absolute w-full max-w-3xl object-contain"
        />
        <h1 className="relative font-sansation-bold text-3xl sm:text-[108px] sm:leading-[108px]">
          <span className="opacity-0">
            SINGAPORE MEMORY <br /> SPORTS
          </span>
          <span className="absolute inset-0 translate-x-[6px] text-center text-[#7089DF]">
            SINGAPORE MEMORY SPORTS
          </span>
          <span className="absolute inset-0 text-center text-white">
            SINGAPORE MEMORY SPORTS
          </span>
        </h1>
      </div>
      <div className="p-8">
        <div className="flex flex-col border-8 border-[#A19797] bg-board-texture bg-cover py-12 shadow-lg sm:flex-row">
          <div className="relative m-8 flex-1">
            <Image
              className="-rotate-2 shadow-md"
              src={"/board/msc.png"}
              alt="MSC Training Session"
              height={585}
              width={760}
            />
            <Image
              src={"/board/clip.png"}
              height={100}
              width={100}
              alt="clip"
              className="absolute -top-10 left-1/2 w-[75px] -translate-x-1/2 -rotate-2 sm:-top-12 sm:w-[100px]"
            />
          </div>
          <div className="relative m-8 flex flex-1 flex-col items-center space-y-12 bg-primary-blue p-4 font-sansation text-white shadow-md sm:rotate-3">
            <Image
              className="absolute -left-8 -top-8"
              src={"/board/tape.png"}
              height={100}
              width={100}
              alt="clip"
            />
            <Image
              className="absolute -bottom-8 -right-8"
              src={"/board/tape.png"}
              height={100}
              width={100}
              alt="clip"
            />
            <h1 className="my-4 w-max bg-white px-6 py-2 text-center font-sansation-bold text-black sm:text-3xl">
              ABOUT SINGAPORE
              <br />
              MEMORY SPORTS
            </h1>
            <p className="px-4 text-justify sm:px-8 sm:text-lg">
              Singapore Polytechnic&#39;s Memory Sports CCA is a vibrant
              community within Singapore Polytechnic dedicated to pushing the
              boundaries of memory enhancement. <br />
              <br /> Through engaging activities, workshops, and competitions,
              members are empowered to unlock their cognitive potential using
              mnemonic techniques and memory challenges. <br />
              <br />
              The CCA fosters collaboration, camaraderie, and lasting
              friendships while representing the polytechnic in regional and
              international memory competitions, showcasing dedication, skill,
              and determination on a global stage.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-8 bg-gray-200 p-8 sm:flex-row sm:space-x-8 sm:space-y-0">
        <div className="flex rounded-3xl bg-white p-8">
          <div className="flex w-max flex-col space-y-8">
            <h1 className="font-sansation-bold text-3xl text-primary-blue underline decoration-primary-blue underline-offset-8">
              Records
            </h1>

            <div className="grid w-max grid-cols-1 place-items-center gap-8 self-center sm:grid-cols-2">
              {categories.map((c) => (
                <button
                  key={c.cuid}
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
                    <RocketIcon
                      width={150}
                      height={150}
                      className="text-gray-300"
                    />
                  )}
                  <h1
                    className={cn([
                      "font-sansation-bold text-3xl px-8 w-full truncate overflow-ellipsis",
                      c.name === "TBC" ? "text-gray-400" : "",
                    ])}
                  >
                    {c.name}
                  </h1>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-grow rounded-3xl bg-white p-8">
          <div className="flex h-full flex-col justify-between space-y-8">
            <h1 className="font-sansation-bold text-3xl text-primary-blue underline decoration-primary-blue underline-offset-8">
              Past Competitions
            </h1>
            <div className="h-full">
              {competitions.length === 0 && (
                <h1 className="text-lg">There are no past competitions.</h1>
              )}
            </div>
            <Link
              href={"/"}
              className="font-sansation-bold text-xl text-primary-blue"
            >
              View more
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-8 bg-primary-blue py-8 sm:flex-row sm:items-start sm:space-x-8 sm:space-y-0">
        <div className="flex flex-col space-y-4 font-sansation">
          <h1 className="font-sansation-bold text-5xl text-white">CONTACT</h1>
          <h1 className="bg-white p-2 text-xl text-primary-blue">QUESTIONS?</h1>
          <h1 className="bg-white p-2 text-xl text-primary-blue">FEEDBACK?</h1>
        </div>
        <form
          className="flex w-full max-w-sm flex-col space-y-4 bg-white p-4 sm:max-w-lg"
          action="mailto:sp_msc@ichat.sp.edu.sg"
          method="post"
        >
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email" className="text-lg">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              className="bg-gray-300 text-xl !ring-0 !ring-offset-0"
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="subject" className="text-lg">
              Subject
            </Label>
            <Input
              type="text"
              id="subject"
              className="bg-gray-300 text-xl !ring-0 !ring-offset-0"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="message" className="text-lg">
              Message
            </Label>
            <Textarea
              id="message"
              className="resize-none bg-gray-300 text-xl !ring-0 !ring-offset-0"
            />
          </div>

          <div className="flex w-full items-center justify-end space-x-2">
            <Button type="reset" variant="outline" className="text-lg">
              Reset
            </Button>
            <Button
              className="bg-primary-blue text-lg hover:bg-primary-blue hover:opacity-90"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

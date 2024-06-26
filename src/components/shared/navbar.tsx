"use client";

import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import RecordsDropdown from "./navbar/records-dropdown";
import { useEffect, useState } from "react";
import path from "path";

const navigation = [
  { name: "About Us", href: "/", current: false },
  { name: "Competitions", href: "/competitions", current: false },
  { name: "Records", href: "/records", current: false },
  { name: "Contact Us", href: "/#contact", current: false },
];

export type NavbarItem = (typeof navigation)[number];

export default function Navbar() {
  const pathname = usePathname();
  const [nav, setNav] = useState(navigation);

  useEffect(() => {
    const new_nav = nav.map((item) => {
      return {
        ...item,
        current: item.href === "/" ? pathname === "/" ? true : false : pathname.includes(item.href),
      };
    });
    setNav(new_nav);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Disclosure as="nav">
      {({ open }: { open: boolean }) => (
        <>
          <div className="mx-auto w-full px-2 shadow-md sm:rounded-lg sm:px-0 lg:px-0">
            <div className="relative flex h-20 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-slate-900">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="relative flex flex-shrink-0 items-center sm:w-[128px]">
                  <Image
                    src="/logo.png"
                    height={100}
                    width={100}
                    alt="Logo"
                    className="z-10 w-[64px] rounded-full sm:absolute sm:-top-2 sm:w-[128px]"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <div className="flex space-x-6">
                    {nav.map((item) => {
                      if (item.href === "/records") {
                        return <RecordsDropdown key={item.name} item={item} />;
                      } else {
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn([
                              item.current
                                ? "!border-y-2 !border-primary-blue !text-primary-blue"
                                : "hover:border-y-2 hover:border-primary-blue hover:text-primary-blue",
                              "border-y-2 border-transparent px-3 py-1 font-sansation-bold text-base transition-all",
                            ])}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="rounded-b-2xl bg-white shadow-md sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {nav.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={cn([
                    item.current
                      ? "text-primary-blue underline decoration-primary-blue underline-offset-4"
                      : "hover:underline hover:decoration-primary-blue hover:underline-offset-4",
                    "block rounded-md px-3 py-2 text-base font-medium",
                  ])}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

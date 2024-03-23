"use client";
import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { NextUIProvider } from "@nextui-org/react";
import Navbar from "./_components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <NextUIProvider>
            <main className="flex flex-col ">
              <Navbar />
              {children}
            </main>
          </NextUIProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

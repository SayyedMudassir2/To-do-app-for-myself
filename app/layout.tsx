import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Level 2026 | Mastery OS",
  description: "A high-performance self-improvement operating system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-zinc-50 antialiased selection:bg-emerald-500/30`}>
        {children}
      </body>
    </html>
  );
}
"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 Not Found</title>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          "flex justify-center items-center",
          inter.variable
        )}
      >
        <main className="flex flex-col xl:flex-row gap-2 text-center">
          <h2 className="text-5xl">Сторінку не знайдено</h2>
          <a href="/">
            <h1 className="text-9xl">404</h1>
          </a>
          <h2 className="text-5xl xl:self-end">Page Not Found</h2>
        </main>
      </body>
    </html>
  );
}

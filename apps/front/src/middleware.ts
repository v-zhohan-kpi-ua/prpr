import type { NextRequest } from "next/server";
import { middleware as localizationMiddleware } from "@/localization/middleware";

export function middleware(request: NextRequest) {
  return localizationMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

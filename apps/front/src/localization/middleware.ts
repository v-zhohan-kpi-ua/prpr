import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./config";

export const middleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});
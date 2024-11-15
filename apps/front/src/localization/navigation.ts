import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { locales, localePrefix } from "./config";

export const { Link, redirect, permanentRedirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales,
    localePrefix,
  });

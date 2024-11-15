import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, defaultTranslationValues, locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (
      await (locale === defaultLocale
        ? import(`./dictionaries/${defaultLocale}.json`)
        : import(`./dictionaries/${locale}.json`))
    ).default,
    defaultTranslationValues: {
      ...defaultTranslationValues,
    },
  };
});

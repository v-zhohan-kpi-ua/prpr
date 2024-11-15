import { RichTranslationValues } from "next-intl";
import { enGB, Locale, uk } from "date-fns/locale";

export const defaultLocale = "uk" as const;
export const locales = ["uk", "en"] as const;
export const localePrefix: "as-needed" | "always" | "never" = "as-needed";

export const defaultTranslationValues: RichTranslationValues = {
  important: (chunks) => <b>{chunks}</b>,
  br: () => <br />,
};

export const dateFnsLocales: { [key: string]: Locale } = {
  uk: uk,
  en: enGB,
};

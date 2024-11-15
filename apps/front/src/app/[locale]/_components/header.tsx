import Typography from "@prpr/ui/components/typography";
import { DarkModeToggle } from "./dark-mode";
import { Badge } from "@prpr/ui/components/badge";
import { Link } from "@/localization/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import LanguageChanger from "@/app/[locale]/_components/language-changer";

export function Header() {
  const t = useTranslations("common");

  return (
    <header className="bg-background px-4 md:px-8 pt-3 pb-3 border-b print:border-none">
      <div className="flex items-center">
        <Link
          href="/"
          className={cn(
            "focus-visible:outline-2 focus-visible:outline-ring focus-visible:rounded-sm focus-visible:outline-offset-4 print:p-3 print:rounded-lg print:border"
          )}
        >
          <div className="flex flex-col items-center">
            <Typography variant="h4" className="uppercase">
              {t("app.name.short")}
            </Typography>
            <Badge variant="outline" className="lowercase">
              {t("header.beta")}
            </Badge>
          </div>
        </Link>
        <div className="flex flex-1 justify-end print:hidden">
          <div className="flex gap-4">
            <LanguageChanger
              translation={{
                header: {
                  changeLang: t("header.changeLang"),
                  langs: {
                    uk: t("header.langs.uk"),
                    en: t("header.langs.en"),
                  },
                },
              }}
            />
            <DarkModeToggle
              translation={{
                changeTheme: t("header.changeTheme"),
                lightTheme: t("header.lightTheme"),
                darkTheme: t("header.darkTheme"),
                systemTheme: t("header.systemTheme"),
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

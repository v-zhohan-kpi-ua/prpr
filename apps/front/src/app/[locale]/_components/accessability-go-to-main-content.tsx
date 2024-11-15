import { Button } from "@prpr/ui/components/button";
import { useTranslations } from "next-intl";

export function GoToMainContent() {
  const t = useTranslations("common.accessability");

  return (
    <Button
      asChild
      className="sr-only focus-visible:not-sr-only z-50 rounded-none justify-start uppercase tracking-widest text-base focus-visible:px-4 focus-visible:py-2 min-w-full"
    >
      <a href="#main">{t("go-to-main-content")}</a>
    </Button>
  );
}

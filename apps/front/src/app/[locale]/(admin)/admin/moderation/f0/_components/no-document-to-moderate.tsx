import { Button } from "@prpr/ui/components/button";
import { Ghost } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NoDocumentToModerate({
  refreshFn,
  isRefreshing,
}: {
  isRefreshing: boolean;
  refreshFn: () => void;
}) {
  const t = useTranslations(
    "pages.admin.moderation-f0.no-document-to-moderation"
  );

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <Ghost className="h-28 w-28 text-muted-foreground/50 mb-4" />
        <h3 className="text-2xl font-bold tracking-tight">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
        <Button
          disabled={isRefreshing}
          onClick={() => refreshFn()}
          variant="outline"
          className="mt-4"
        >
          {t("buttonRefresh")}
        </Button>
      </div>
    </div>
  );
}

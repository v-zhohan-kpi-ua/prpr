import { defaultTranslationValues } from "@/localization/config";
import { Alert, AlertDescription, AlertTitle } from "@prpr/ui/components/alert";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

export function F0FormAlertHiddenInfo() {
  const t = useTranslations("common.documents.f0.form.alertHiddenInfo");

  return (
    <Alert role="status">
      <Eye className="h-4 w-4" />
      <AlertTitle>{t("title")}</AlertTitle>
      <AlertDescription>
        {t.rich("description", defaultTranslationValues)}
      </AlertDescription>
    </Alert>
  );
}

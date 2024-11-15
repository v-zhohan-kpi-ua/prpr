import { LoadingIcon } from "@prpr/ui/components/icons/loading";
import { useTranslations } from "next-intl";

export default function AdminLoading() {
  const t = useTranslations("pages.admin.common");

  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="h-8 w-8">
        <LoadingIcon />
        <span className="sr-only">{t("loading")}</span>
      </div>
    </div>
  );
}

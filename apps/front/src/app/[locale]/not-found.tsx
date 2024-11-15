import Typography from "@prpr/ui/components/typography";
import { useTranslations } from "next-intl";

export default function NotFoundWithLocale() {
  const t = useTranslations("common");

  return (
    <div className="text-center">
      <Typography variant="h2" className="text-5xl">
        {t("errors.notFound")}
      </Typography>
      <Typography variant="h1" className="text-9xl">
        404
      </Typography>
    </div>
  );
}

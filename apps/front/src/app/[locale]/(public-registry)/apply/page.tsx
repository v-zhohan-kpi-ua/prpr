import { Button } from "@prpr/ui/components/button";
import Typography from "@prpr/ui/components/typography";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/localization/navigation";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: `${t("pages.apply.title")} | ${t("common.app.name.long")}`,
    description: `${t("pages.apply.title")} | ${t("common.app.name.long")}`,
  };
}

export default function Apply() {
  const t = useTranslations();

  return (
    <>
      <div>
        <div className="mb-6 max-w-2xl mx-auto">
          <Typography variant="h1" className="text-center uppercase">
            {t("common.app.name.long")}
          </Typography>
        </div>

        <Typography variant="h2" className="text-center">
          {t("pages.apply.title")}
        </Typography>
        <p className="text-center font-semibold text-2xl">
          {t("pages.apply.description")}
        </p>
        <div className="flex justify-center mt-4">
          <Button asChild size="xl" className="uppercase">
            <Link href="/apply/form">{t("pages.apply.button-start")}</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

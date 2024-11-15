import Typography from "@prpr/ui/components/typography";
import { useTranslations } from "next-intl";
import { Link } from "@/localization/navigation";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="bg-background border-t py-3 px-2 md:py-5 md:px-4 print:hidden">
      <div className="flex flex-col md:flex-row gap-3 md:gap-5 items-start text-sm">
        <Link className="link-underline" href="/privacy">
          {t("footer.privacy")}
        </Link>
        <Link className="link-underline" href="/accessability">
          {t("footer.accessabilityStatement")}
        </Link>
      </div>
      <div className="mt-4">
        <Typography variant="p" affects="muted">
          © {t("footer.allRightsReserved")} — {new Date().getFullYear()}
          <br />
          {t("app.name.long")} ({t("app.name.short")})
          <br />
          {t("footer.propertyOf")}
        </Typography>
      </div>
    </footer>
  );
}

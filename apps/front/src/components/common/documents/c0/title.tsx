import { DocumentType } from "@prpr/documents";
import { encodeNumber } from "@prpr/documents/number";
import Typography from "@prpr/ui/components/typography";
import { useTranslations } from "next-intl";

export function C0Title({ data }: { data: { year: number; id: string } }) {
  const t = useTranslations("common.documents.c0");

  const formattedNumber = encodeNumber({
    type: DocumentType.C0_Main_Case,
    year: data.year,
    id: data.id,
  });

  return (
    <Typography variant="h2">
      {t("title")}
      <br /># {formattedNumber}
    </Typography>
  );
}

import { DocumentType } from "@prpr/documents";
import { encodeNumber } from "@prpr/documents/number";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@prpr/ui/components/card";
import { useTranslations } from "next-intl";

export function F0CaseOpenedCard({
  data,
}: {
  data: {
    id: string;
    year: number;
    type: DocumentType;
  };
}) {
  const t = useTranslations("common.documents.f0.caseOpenedCard");

  const caseNumberFormatted = encodeNumber({
    year: data.year,
    id: data.id,
    type: data.type,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <span className="font-semibold">{t("caseNumber")}:</span>{" "}
          <span className="text-2xl font-semibold">{caseNumberFormatted}</span>
        </div>
      </CardContent>
    </Card>
  );
}

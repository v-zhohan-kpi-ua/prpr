import { C0Document } from "@prpr/documents";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@prpr/ui/components/card";
import { useTranslations } from "next-intl";

export function C0AdvisorInfoCard({
  data,
}: {
  data: C0Document["assignments"][0]["worker"];
}) {
  const t = useTranslations("common.documents.c0.advisorInfoCard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <span className="font-semibold">{t("advisor.who")}:</span>{" "}
          {data.surname} {data.givenName}{" "}
        </div>
        <div>
          <span className="font-semibold">{t("advisor.howToContact")}:</span>{" "}
          <a className="link-underline" href={`mailto:${data.email}`}>
            {data.email}
          </a>
        </div>
        <div>
          <span className="font-semibold">{t("advisor.location")}:</span>{" "}
          {data.cluster.name} ({data.cluster.address})
        </div>
      </CardContent>
    </Card>
  );
}

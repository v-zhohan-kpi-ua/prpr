import { C0Document } from "@prpr/documents";
import { C0PropertiesStatus } from "@prpr/documents/properties";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@prpr/ui/components/card";
import { useFormatter, useTranslations } from "next-intl";

export function C0StatusChangeCard({
  data,
}: {
  data: C0Document["properties"]["statusChange"];
}) {
  const t = useTranslations("common.documents.c0.statusChangeCard");
  const formatter = useFormatter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {data.map((status) => {
              const statusValue =
                Object.values(C0PropertiesStatus).find(
                  (s) => s === status.status
                ) || "unknown";

              return (
                <div key={new Date(status.changedAt).toISOString()}>
                  <div className="text-base">
                    {t(`statusValues.${statusValue}`)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatter.dateTime(new Date(status.changedAt), {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

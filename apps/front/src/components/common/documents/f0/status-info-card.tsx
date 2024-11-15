import { F0DocumentModifiedFromApi } from "@/types/api/f0";
import { F0PropertiesStatus } from "@prpr/documents/properties";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@prpr/ui/components/card";
import Typography from "@prpr/ui/components/typography";
import { useFormatter, useTranslations } from "next-intl";

export function F0StatusInfoCard({
  data,
}: {
  data: F0DocumentModifiedFromApi;
}) {
  const t = useTranslations("common.documents.f0.statusInfoCard");
  const formatter = useFormatter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description")}:{" "}
          {formatter.dateTime(new Date(data.updatedAt), {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <span className="font-semibold">{t("status.label")}:</span>{" "}
          {t(`status.value.${data.properties.status}`)}
        </div>
        {data.assignments[0].comment && (
          <div>
            <span className="font-semibold">{t("statusComment")}:</span>{" "}
            {data.assignments[0].comment}
          </div>
        )}
        <div>
          <span className="font-semibold">{t("deadline")}:</span>{" "}
          {formatter.dateTime(new Date(data.assignments[0].deadline), {
            dateStyle: "short",
          })}{" "}
          {new Date(data.assignments[0].deadline).getTime() <
            new Date().getTime() &&
          data.properties.status === F0PropertiesStatus.SUBMITTED
            ? `(${t("deadlinePassed")})`
            : ""}
        </div>

        <br />
        <Typography variant="h4">{t("infoAboutExecutor")}</Typography>
        <br />

        <div>
          <span className="font-semibold">{t("executor.who")}:</span>{" "}
          {data.assignments[0].worker.surname}{" "}
          {data.assignments[0].worker.givenName}{" "}
        </div>
        <div>
          <span className="font-semibold">{t("executor.howToContact")}:</span>{" "}
          <a
            className="link-underline"
            href={`mailto:${data.assignments[0].worker.email}`}
          >
            {data.assignments[0].worker.email}
          </a>
        </div>
        <div>
          <span className="font-semibold">
            {t("executor.physicalLocation")}:
          </span>{" "}
          {data.assignments[0].worker.cluster.name} (
          {data.assignments[0].worker.cluster.address})
        </div>
      </CardContent>
    </Card>
  );
}

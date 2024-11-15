import { F0PropertiesModifiedFromApi } from "@/types/api/f0";
import { F0FormAlertHiddenInfo } from "../f0/form-alert-hidden-info";
import { F0FormPersonal } from "../f0/form-personal";
import { F0FormProperty } from "../f0/form-property";
import { F0FormDocs } from "../f0/form-docs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@prpr/ui/components/card";
import { useTranslations } from "next-intl";

export function C0InfoFromF0Card({
  data,
}: {
  data: F0PropertiesModifiedFromApi["form"];
}) {
  const t = useTranslations("common.documents.c0.infoFromF0Card");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <F0FormAlertHiddenInfo />
          </div>
          <div className="flex flex-col gap-6">
            <F0FormPersonal withHeader={true} personal={data.personal} />
            <F0FormProperty withHeader={true} property={data.property} />
            <F0FormDocs withHeader={true} docs={data.docs} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { getNextAssignment } from "@/lib/back-api/admin/assignments/f0";
import { ModerationForm } from "./form";
import { AsyncReturnType } from "@/types/utils";
import { F0Title } from "@/components/common/documents/f0/title";
import { F0FormPersonal } from "@/components/common/documents/f0/form-personal";
import { F0FormProperty } from "@/components/common/documents/f0/form-property";
import Typography from "@prpr/ui/components/typography";
import { useTranslations } from "next-intl";

export function DocumentToModerate({
  data,
  fetchNextAssignment,
}: {
  data: AsyncReturnType<typeof getNextAssignment>["data"];
  fetchNextAssignment: () => Promise<void>;
}) {
  const t = useTranslations("pages.admin.moderation-f0");

  return (
    <div>
      <div className="mb-4">
        {t("document-to-moderate.leftToCheck")}: {data.leftIncludingCurrent}
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div>
            <F0Title
              data={{
                year: data.assignment?.document.year!,
                id: data.assignment?.document.id!,
              }}
            />
            <Typography variant="h3">
              {t("document-to-moderate.infoFromForm")}
            </Typography>
          </div>

          <div>
            <F0FormPersonal
              personal={data.assignment?.document.properties.form.personal!}
              withHeader
            />
          </div>

          <div>
            <F0FormProperty
              property={data.assignment?.document.properties.form.property!}
              withHeader
            />
          </div>
        </div>

        <div className="break-all">
          <ModerationForm
            data={data}
            fetchNextAssignment={fetchNextAssignment}
          />
        </div>
      </div>
    </div>
  );
}

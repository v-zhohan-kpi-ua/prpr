import { get } from "@/lib/back-api/public/documents/f0";
import { AsyncReturnType } from "@/types/utils";
import { F0FormProperty } from "@/components/common/documents/f0/form-property";
import { F0FormPersonal } from "@/components/common/documents/f0/form-personal";
import { F0FormDocs } from "@/components/common/documents/f0/form-docs";
import { F0FormAlertHiddenInfo } from "@/components/common/documents/f0/form-alert-hidden-info";
import { F0StatusInfoCard } from "@/components/common/documents/f0/status-info-card";
import { F0Title } from "@/components/common/documents/f0/title";
import { F0CaseOpenedCard } from "@/components/common/documents/f0/case-opened-card";
import { DocumentType } from "@prpr/documents";
import { cn } from "@prpr/ui/lib/utils";

export function F0PageView({
  data,
}: {
  data: AsyncReturnType<typeof get>["data"];
}) {
  const isCaseOpened = data.assignments[0].resultedIn?.id;

  return (
    <div className="mx-4 lg:mx-8">
      <div>
        <F0Title data={{ year: data.year, id: data.id }} />
      </div>

      <div className="grid grid-cols-12 gap-8 my-4">
        {/*  case opened card */}
        {data.assignments[0].resultedIn?.id && (
          <div className="col-span-12 row-start-1 xl:col-span-8">
            <F0CaseOpenedCard
              data={{
                id: data.assignments[0].resultedIn.id,
                year: data.assignments[0].resultedIn.year,
                type: DocumentType.C0_Main_Case as DocumentType,
              }}
            />
          </div>
        )}

        {/* form */}
        <div
          className={cn(
            "col-span-12 row-start-2 xl:row-start-1 xl:col-span-8 flex flex-col gap-4",
            isCaseOpened && "row-start-3 xl:row-start-2"
          )}
        >
          <div>
            <F0FormAlertHiddenInfo />
          </div>
          <div className="flex flex-col gap-6">
            <F0FormPersonal
              withHeader={true}
              personal={data.properties.form.personal}
            />
            <F0FormProperty
              withHeader={true}
              property={data.properties.form.property}
            />
            <F0FormDocs withHeader={true} docs={data.properties.form.docs} />
          </div>
        </div>

        {/* status and worker */}
        <div
          className={cn(
            "col-span-12 row-start-1 xl:col-span-4",
            isCaseOpened && "row-start-2"
          )}
        >
          <F0StatusInfoCard data={data} />
        </div>
      </div>
    </div>
  );
}

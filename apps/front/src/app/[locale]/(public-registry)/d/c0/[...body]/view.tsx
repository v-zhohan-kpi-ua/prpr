import { get } from "@/lib/back-api/public/documents/c0";
import { AsyncReturnType } from "@/types/utils";
import { C0Title } from "@/components/common/documents/c0/title";
import { C0InfoFromF0Card } from "@/components/common/documents/c0/info-from-f0-card";
import { C0StatusChangeCard } from "@/components/common/documents/c0/status-change-card";
import { C0AdvisorInfoCard } from "@/components/common/documents/c0/advisor-info-card";

export function C0PageView({
  data,
}: {
  data: AsyncReturnType<typeof get>["data"];
}) {
  return (
    <div className="mx-4 lg:mx-8">
      <div>
        <C0Title data={{ year: data.year, id: data.id }} />
      </div>

      <div className="grid grid-cols-12 gap-8 my-4">
        {/* f0Form */}
        <div className="col-span-12 row-start-2 xl:row-start-1 xl:col-span-8">
          <C0InfoFromF0Card data={data.properties.f0Form} />
        </div>

        {/* side cards */}
        <div className="col-span-12 row-start-1 xl:col-span-4 flex flex-col gap-8">
          {/* status change */}
          <div>
            <C0StatusChangeCard data={data.properties.statusChange} />
          </div>

          {/* advisor info */}
          <div>
            <C0AdvisorInfoCard
              data={
                data.assignments.find(
                  (a) => a.guid === data.properties.mainLongTermAssignmentGuid
                )?.worker!
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

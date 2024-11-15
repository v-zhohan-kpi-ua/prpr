"use client";

import { getNextAssignment } from "@/lib/back-api/admin/assignments/f0";
import { DocumentToModerate } from "./_components/document-to-moderate";
import AdminLoading from "../../loading";
import NoDocumentToModerate from "./_components/no-document-to-moderate";
import { useEffect, useState } from "react";
import { AsyncReturnType } from "@/types/utils";

export function AdminModerationF0PageClient() {
  const [assignment, setAssignment] =
    useState<AsyncReturnType<typeof getNextAssignment>>();
  const [isAssignmentFirstLoading, setIsAssignmentFirstLoading] =
    useState(true);
  const [isAssignmentFetching, setIsAssignmentFetching] = useState(false);

  useEffect(() => {
    if (isAssignmentFirstLoading) {
      getNextAssignment().then((data) => {
        setAssignment(data);
        setIsAssignmentFirstLoading(false);
      });
    }
  }, [assignment, isAssignmentFirstLoading]);

  const refetchAssignment = async () => {
    setIsAssignmentFetching(true);
    
    const data = await getNextAssignment();

    setAssignment(data);
    setIsAssignmentFetching(false);
  };

  const documentsLeft = assignment?.data.leftIncludingCurrent || 0;

  if (isAssignmentFirstLoading) {
    return <AdminLoading />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {documentsLeft <= 0 && (
        <NoDocumentToModerate
          refreshFn={refetchAssignment}
          isRefreshing={isAssignmentFetching}
        />
      )}

      {documentsLeft > 0 && (
        <DocumentToModerate
          data={assignment?.data!}
          fetchNextAssignment={refetchAssignment}
        />
      )}
    </div>
  );
}

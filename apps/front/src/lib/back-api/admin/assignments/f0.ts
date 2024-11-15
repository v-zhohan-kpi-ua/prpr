import { AssignmentForDocument, F0Document } from "@prpr/documents";
import { adminInstance } from "../admin-axios";
import { F0DocumentModifiedFromApi } from "@/types/api/f0";

const getNextAssignment = () => {
  type ReturnType = {
    leftIncludingCurrent: number;
    assignment: {
      guid: string;
      deadline: Date;
      status: AssignmentForDocument["status"];
      createdAt: Date;
      updatedAt: Date;
      document: F0DocumentModifiedFromApi;
    } | null;
  };

  return adminInstance.get<ReturnType>("/documents/f0/assignments/next");
};

const approveOrRejectAssignment = ({
  guid,
  comment,
  status,
  keysWithDescription,
}: {
  guid: string;
  comment: string;
  status: "approve" | "reject";
  keysWithDescription: { key: string; description: string }[];
}) => {
  type ReturnType = {
    guid: string;
    status: AssignmentForDocument["status"];
  };

  return adminInstance.patch<ReturnType>(
    `/documents/f0/assignments/${guid}/approve-or-reject`,
    {
      comment,
      status,
      keysWithDescription,
    }
  );
};

export { getNextAssignment, approveOrRejectAssignment };

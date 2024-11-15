interface AssignmentForDocument {
  guid: string;
  deadline?: Date;
  status: AssignmentForDocumentStatus;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  worker: {
    guid: string;
    surname: string;
    givenName: string;
    email: string;
    cluster: {
      guid: string;
      name: string;
      address: string;
    };
  };
  resultedIn?: {
    id: string;
    year: number;
    type: string;
  };
}

enum AssignmentForDocumentStatus {
  PROCESSING = "processing",
  RESOLVED = "resolved",
  REJECTED = "rejected",
  CANCELED = "canceled",
}

export { AssignmentForDocument, AssignmentForDocumentStatus };

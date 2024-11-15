import { AssignmentForDocument } from "./assignment";

interface BaseDocument<P> {
  guid: string;
  id: string;
  type: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  properties: P;
  assignments: AssignmentForDocument[];
}

export { BaseDocument };

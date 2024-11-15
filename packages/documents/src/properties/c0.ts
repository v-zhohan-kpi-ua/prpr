import { F0Properties } from "./f0";

interface C0Properties {
  statusChange: {
    changedAt: Date;
    status: C0PropertiesStatus;
  }[];
  mainLongTermAssignmentGuid: string;
  f0Form: F0Properties["form"];
}

enum C0PropertiesStatus {
  OPENED = "opened",
}

export { C0Properties, C0PropertiesStatus };

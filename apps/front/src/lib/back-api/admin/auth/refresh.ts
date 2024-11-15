import { adminInstance } from "../admin-axios";

export const refresh = () => {
  return adminInstance.post("/auth/refresh");
};

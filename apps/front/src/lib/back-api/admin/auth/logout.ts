import { useAuthAdminStore } from "@/app/[locale]/(admin)/admin/auth/store";
import { adminInstance } from "../admin-axios";

export const logout = async () => {
  const response = await adminInstance.post("/auth/logout");

  if (response.status === 204) {
    useAuthAdminStore.getState().logout();
  }

  return response;
};

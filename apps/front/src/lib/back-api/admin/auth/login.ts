import { useAuthAdminStore } from "@/app/[locale]/(admin)/admin/auth/store";
import { adminInstance } from "../admin-axios";

export const login = async (data: { username: string; password: string }) => {
  const response = await adminInstance.post("/auth/login", data);
  const { token } = response.data;
  useAuthAdminStore.getState().setToken(token);

  return response;
};

import { useAuthAdminStore } from "@/app/[locale]/(admin)/admin/auth/store";
import axios from "axios";
import { refresh } from "./auth/refresh";

export const adminInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_BACK_API_URL + "/admin",
  withCredentials: true,
});

adminInstance.interceptors.request.use((config) => {
  const { token } = useAuthAdminStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

adminInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    const { token: tokenFromStore } = useAuthAdminStore.getState();

    if (tokenFromStore === null) {
      return Promise.reject(error);
    }

    if (response && response.status === 401) {
      try {
        const refreshRes = await refresh();
        const { token } = refreshRes.data;
        useAuthAdminStore.getState().setToken(token);

        return adminInstance(response.config);
      } catch (error) {
        useAuthAdminStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

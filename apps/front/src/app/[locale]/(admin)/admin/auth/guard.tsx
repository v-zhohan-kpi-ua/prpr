"use client";

import { useEffect } from "react";
import { useAuthAdminStore } from "./store";
import { useRouter, usePathname } from "@/localization/navigation";
import { refresh } from "@/lib/back-api/admin/auth/refresh";
import AdminLoading from "../loading";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthAdminStore((state) => state.token);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const call = async () => {
      try {
        const response = await refresh();
        const { token } = response.data;
        useAuthAdminStore.getState().setToken(token);
      } catch (error) {
        router.push("/admin/auth/login");
      }
    };

    if (!token) {
      call();
    }
  }, [token]);

  if (pathname === "/admin/auth/login") {
    if (!token) return children;

    router.push("/admin");
  }

  if (!token) return <AdminLoading />;

  return children;
};

export default AuthGuard;

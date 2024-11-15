import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AuthAdminStore = {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthAdminStore = create<AuthAdminStore>()(
  devtools(
    (set, get) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    { name: "auth-admin" }
  )
);

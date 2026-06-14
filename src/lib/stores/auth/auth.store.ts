import { create } from "zustand";
import { UserInfoDto } from "@/src/lib/types/auth/auth.type";

interface AuthState {
  // مرحله phone start
  flowToken: string | null;
  phone: string | null;
  maskedPhone: string | null;

  // مرحله verify
  registrationToken: string | null;
  isNewUser: boolean | null;

  // مرحله register / login
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfoDto | null;

  setAuthFlow: (flowToken: string, phone: string, maskedPhone: string) => void;
  setVerifyResult: (isNewUser: boolean, registrationToken?: string) => void;
  setSession: (
    accessToken: string,
    refreshToken: string,
    user: UserInfoDto,
  ) => void;
  clearAuthFlow: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  flowToken: null,
  phone: null,
  maskedPhone: null,
  registrationToken: null,
  isNewUser: null,
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  setAuthFlow: (flowToken, phone, maskedPhone) =>
    set({ flowToken, phone, maskedPhone }),

  setVerifyResult: (isNewUser, registrationToken) =>
    set({ isNewUser, registrationToken: registrationToken ?? null }),

  setSession: (accessToken, refreshToken, user) =>
    set({ accessToken, refreshToken, user }),

   setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),


  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  clearAuthFlow: () =>
    set({
      flowToken: null,
      phone: null,
      maskedPhone: null,
      registrationToken: null,
      isNewUser: null,
    }),
}));

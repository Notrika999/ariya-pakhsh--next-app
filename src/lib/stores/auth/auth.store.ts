// src/lib/stores/auth/auth.store.ts
import { create } from "zustand";
import { AUTH_USER_STORAGE_KEY } from "@/src/lib/auth/constants";
import { UserInfoDto } from "@/src/lib/types/auth/auth.type";

export type AuthOtpMode = "phone" | "login-2fa" | null;

interface AuthState {
  flowToken: string | null;
  phone: string | null;
  maskedPhone: string | null;
  deviceFingerPrint: string | null;

  resendCooldownSeconds: number | null;

  registrationToken: string | null;
  isNewUser: boolean | null;
  user: UserInfoDto | null;
  isAuthenticated: boolean;
  isAuthBootstrapping: boolean;

  authOtpMode: AuthOtpMode;
  loginTwoFactorToken: string | null;
  loginTwoFactorOtpSentTo: string | null;

  passwordResetToken: string | null;
  passwordResetUsername: string | null;
  passwordResetMaskedDestination: string | null;
  passwordResetResendCooldownSeconds: number | null;

  setAuthFlow: (
    flowToken: string, 
    phone: string, 
    maskedPhone: string,
    deviceFingerPrint: string,
    resendCooldownSeconds?: number
  ) => void;
  setLoginTwoFactorFlow: (
    twoFactorToken: string,
    otpSentTo: string | null,
    deviceFingerPrint: string,
    resendCooldownSeconds?: number,
  ) => void;
  setPasswordResetFlow: (
    resetToken: string,
    username: string,
    maskedDestination: string | null,
    resendCooldownSeconds?: number,
  ) => void;
  setVerifyResult: (isNewUser: boolean, registrationToken?: string) => void;
  setUser: (user: UserInfoDto) => void;
  hydrateUserFromStorage: () => UserInfoDto | null;
  clearUser: () => void;
  setAuthBootstrapping: (value: boolean) => void;
  clearAuthFlow: () => void;
  clearLoginTwoFactorFlow: () => void;
  clearPasswordResetFlow: () => void;
}

function readStoredUser(): UserInfoDto | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as UserInfoDto;
    return user?.userId ? user : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user: UserInfoDto): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

function mergeStoredUser(nextUser: UserInfoDto): UserInfoDto {
  const storedUser = readStoredUser();

  if (!storedUser || storedUser.userId !== nextUser.userId) {
    return nextUser;
  }

  return {
    ...storedUser,
    ...nextUser,
    birthDate: nextUser.birthDate ?? storedUser.birthDate,
    currentSession: nextUser.currentSession ?? storedUser.currentSession,
    lastLoginDevice: nextUser.lastLoginDevice ?? storedUser.lastLoginDevice,
  };
}

const initialStoredUser = readStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  flowToken: null,
  phone: null,
  maskedPhone: null,
  deviceFingerPrint: null,
  resendCooldownSeconds: null,
  registrationToken: null,
  isNewUser: null,
  user: initialStoredUser,
  isAuthenticated: Boolean(initialStoredUser),
  isAuthBootstrapping: Boolean(initialStoredUser),
  authOtpMode: null,
  loginTwoFactorToken: null,
  loginTwoFactorOtpSentTo: null,
  passwordResetToken: null,
  passwordResetUsername: null,
  passwordResetMaskedDestination: null,
  passwordResetResendCooldownSeconds: null,

  setAuthFlow: (
    flowToken,
    phone,
    maskedPhone,
    deviceFingerPrint,
    resendCooldownSeconds,
  ) =>
    set({
      flowToken,
      phone,
      maskedPhone,
      deviceFingerPrint,
      resendCooldownSeconds,
      authOtpMode: "phone",
      loginTwoFactorToken: null,
      loginTwoFactorOtpSentTo: null,
    }),

  setLoginTwoFactorFlow: (
    twoFactorToken,
    otpSentTo,
    deviceFingerPrint,
    resendCooldownSeconds,
  ) =>
    set({
      authOtpMode: "login-2fa",
      loginTwoFactorToken: twoFactorToken,
      loginTwoFactorOtpSentTo: otpSentTo,
      deviceFingerPrint,
      resendCooldownSeconds: resendCooldownSeconds ?? 120,
      flowToken: null,
      phone: null,
      maskedPhone: null,
    }),

  setPasswordResetFlow: (
    resetToken,
    username,
    maskedDestination,
    resendCooldownSeconds,
  ) =>
    set({
      passwordResetToken: resetToken,
      passwordResetUsername: username,
      passwordResetMaskedDestination: maskedDestination,
      passwordResetResendCooldownSeconds: resendCooldownSeconds ?? 120,
    }),

  setVerifyResult: (isNewUser, registrationToken) =>
    set({ isNewUser, registrationToken: registrationToken ?? null }),

  setUser: (user) => {
    const mergedUser = mergeStoredUser(user);
    writeStoredUser(mergedUser);
    set({
      user: mergedUser,
      isAuthenticated: true,
    });
  },

  hydrateUserFromStorage: () => {
    const user = readStoredUser();
    if (user) {
      set({ user, isAuthenticated: true, isAuthBootstrapping: true });
    }
    return user;
  },

  clearUser: () => {
    clearStoredUser();
    set({
      user: null,
      isAuthenticated: false,
      isAuthBootstrapping: false,
    });
  },

  setAuthBootstrapping: (value) => set({ isAuthBootstrapping: value }),

  clearAuthFlow: () =>
    set({
      flowToken: null,
      phone: null,
      maskedPhone: null,
      deviceFingerPrint: null,
      resendCooldownSeconds: null,
      registrationToken: null,
      isNewUser: null,
      authOtpMode: null,
      loginTwoFactorToken: null,
      loginTwoFactorOtpSentTo: null,
      passwordResetToken: null,
      passwordResetUsername: null,
      passwordResetMaskedDestination: null,
      passwordResetResendCooldownSeconds: null,
    }),

  clearLoginTwoFactorFlow: () =>
    set({
      authOtpMode: null,
      loginTwoFactorToken: null,
      loginTwoFactorOtpSentTo: null,
    }),

  clearPasswordResetFlow: () =>
    set({
      passwordResetToken: null,
      passwordResetUsername: null,
      passwordResetMaskedDestination: null,
      passwordResetResendCooldownSeconds: null,
    }),
}));

/* ----------------------------- Selector hooks ----------------------------- */
/**
 * برای دسترسی به اطلاعات کاربر در هر کامپوننت کلاینتی از این هوک‌ها استفاده کن.
 * این‌ها فقط همان بخش از state را subscribe می‌کنند و از rerender اضافی جلوگیری می‌کنند.
 */
export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useIsAuthBootstrapping = () =>
  useAuthStore((s) => s.isAuthBootstrapping);

/**
 * دسترسی امری (بیرون از React: interceptor، util، event handler و ...).
 * مثال: const user = getCurrentUser();
 */
export const getCurrentUser = () => useAuthStore.getState().user;
export const getIsAuthenticated = () =>
  useAuthStore.getState().isAuthenticated;

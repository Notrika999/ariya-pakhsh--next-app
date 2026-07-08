// src/services/auth/auth.client.ts
"use client";

import { apiClient } from "@/src/lib/http/api-client";
import { ApiError } from "@/src/lib/http/api-client";
import {
  CUSTOMER_AUTH_CLIENT_PATHS,
} from "@/src/lib/auth/constants";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  StartAuthRequest,
  StartAuthResponse,
  SessionInfoDto,
  UpdateProfileRequest,
  UpdateProfileResponse,
  EmailVerificationStartResponse,
  EmailVerifyResponse,
  TwoFactorToggleResponse,
  UserInfoDto,
  VerifyLoginTwoFactorRequest,
  VerifyLoginTwoFactorResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  StartChangePasswordOtpRequest,
  StartChangePasswordOtpResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/src/lib/types/auth/auth.type";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
  code?: string;
  errorCode?: string;
  errorMessage?: string;
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Access denied": "دسترسی شما مجاز نیست.",
  "Bad request": "درخواست نامعتبر است. لطفاً اطلاعات واردشده را بررسی کنید.",
  "Session expired": "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
  "Resource not found": "منبع مورد نظر پیدا نشد.",
  "Validation failed": "اطلاعات واردشده معتبر نیست.",
  "Too many requests. Slow down.":
    "تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.",
  "Server-side crash": "خطای سرور رخ داده است. لطفاً کمی بعد دوباره تلاش کنید.",
  "An unexpected error occurred": "خطای غیرمنتظره‌ای رخ داد.",
  "Network failure or Server unreachable":
    "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.",
  BAD_REQUEST: "درخواست نامعتبر است. لطفاً اطلاعات واردشده را بررسی کنید.",
  UNAUTHORIZED: "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
  FORBIDDEN: "دسترسی شما مجاز نیست.",
  NOT_FOUND: "منبع مورد نظر پیدا نشد.",
  VALIDATION_ERROR: "اطلاعات واردشده معتبر نیست.",
  RATE_LIMIT: "تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.",
  SERVER_ERROR: "خطای سرور رخ داده است. لطفاً کمی بعد دوباره تلاش کنید.",
  NETWORK_ERROR: "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.",
  UNKNOWN: "خطای غیرمنتظره‌ای رخ داد.",
  OTP_INVALID: "کد واردشده نامعتبر است یا منقضی شده است.",
  INVALID_2FA_TOKEN:
    "جلسه تایید نامعتبر یا منقضی شده است. لطفاً دوباره وارد شوید.",
  TOKEN_INVALID: "نشست شما منقضی یا نامعتبر است. لطفاً دوباره وارد شوید.",
  ERROR: "خطا در تایید کد. لطفاً دوباره تلاش کنید.",
};

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function pickString(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

function pickNumber(
  record: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number") return value;
  }
  return undefined;
}

function unwrapApiData<T>(payload: unknown, label: string): T {
  if (!payload || typeof payload !== "object") {
    throw new Error(`${label}: پاسخ سرور نامعتبر است`);
  }

  const record = payload as ApiEnvelope<T> & { data?: ApiEnvelope<T> | T };

  // APIهای بکند معمولاً envelope برمی‌گردانند: { success, data: {...} }.
  // اول data را باز می‌کنیم تا success ریشه باعث گم شدن data.token نشود.
  if (record.data && typeof record.data === "object") {
    const inner = record.data as Record<string, unknown>;
    if (
      "success" in inner ||
      "flowToken" in inner ||
      "token" in inner ||
      "resetToken" in inner ||
      "verificationToken" in inner ||
      "userId" in inner
    ) {
      return record.data as T;
    }
    if ("data" in inner && inner.data) {
      return inner.data as T;
    }
  }

  if (
    "success" in record ||
    "flowToken" in record ||
    "token" in record ||
    "resetToken" in record ||
    "verificationToken" in record ||
    "userId" in record
  ) {
    return payload as T;
  }

  throw new Error(`${label}: فیلد data در پاسخ پیدا نشد`);
}

function normalizeStartAuthResponse(
  result: StartAuthResponse,
): StartAuthResponse {
  const record = getRecord(result);
  const token = pickString(record, [
    "flowToken",
    "token",
    "authFlowToken",
    "otpToken",
    "verificationToken",
  ]);

  return {
    ...result,
    flowToken: token ?? result.flowToken,
    token: result.token ?? token,
    maskedPhone:
      pickString(record, [
        "maskedPhone",
        "maskedDestination",
        "maskedPhoneNumber",
        "phoneNumber",
      ]) ?? result.maskedPhone,
    resendCooldownSeconds:
      pickNumber(record, [
        "resendCooldownSeconds",
        "cooldownSeconds",
        "retryAfterSeconds",
      ]) ??
      result.resendCooldownSeconds ??
      120,
    otpExpiresInSeconds:
      pickNumber(record, ["otpExpiresInSeconds", "expiresInSeconds"]) ??
      result.otpExpiresInSeconds ??
      0,
  };
}

function normalizeResendOtpResponse(
  result: ResendOtpResponse,
): ResendOtpResponse {
  const record = getRecord(result);
  const token = pickString(record, [
    "flowToken",
    "token",
    "authFlowToken",
    "otpToken",
    "verificationToken",
  ]);

  return {
    ...result,
    flowToken: token ?? result.flowToken,
    token: result.token ?? token,
    maskedPhone:
      pickString(record, [
        "maskedPhone",
        "maskedDestination",
        "maskedPhoneNumber",
        "phoneNumber",
      ]) ?? result.maskedPhone,
    resendCooldownSeconds:
      pickNumber(record, [
        "resendCooldownSeconds",
        "cooldownSeconds",
        "retryAfterSeconds",
      ]) ?? result.resendCooldownSeconds,
    otpExpiresInSeconds:
      pickNumber(record, ["otpExpiresInSeconds", "expiresInSeconds"]) ??
      result.otpExpiresInSeconds,
  };
}

export function attachSessionToUser(
  user: UserInfoDto,
  session?: SessionInfoDto,
): UserInfoDto {
  if (!session) return user;

  return {
    ...user,
    currentSession: session,
    lastLoginDevice: session.deviceName || user.lastLoginDevice,
    lastLoginIp: session.ipAddress || user.lastLoginIp,
  };
}

export async function completeUserFromMe(
  user: UserInfoDto,
): Promise<UserInfoDto> {
  if (user.birthDate) return user;
  return getMe().catch(() => user);
}

export const startPhoneAuth = async (
  data: StartAuthRequest,
): Promise<StartAuthResponse> => {
  console.log(
    "[auth.client] POST",
    CUSTOMER_AUTH_CLIENT_PATHS.PHONE_START,
    data,
  );

  try {
    const response = await apiClient.post(
      CUSTOMER_AUTH_CLIENT_PATHS.PHONE_START,
      data,
    );
    const result = normalizeStartAuthResponse(
      unwrapApiData<StartAuthResponse>(response.data, "startPhoneAuth"),
    );

    console.log("[auth.client] startPhoneAuth OK =>", result);
    return result;
  } catch (error) {
    console.error("[auth.client] startPhoneAuth FAILED =>", error);
    throw error;
  }
};

export const verifyOtp = async (
  data: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  console.log("[auth.client] POST", CUSTOMER_AUTH_CLIENT_PATHS.PHONE_VERIFY);

  try {
    const response = await apiClient.post(
      CUSTOMER_AUTH_CLIENT_PATHS.PHONE_VERIFY,
      data,
    );
    const result = unwrapApiData<VerifyOtpResponse>(response.data, "verifyOtp");

    console.log("[auth.client] verifyOtp OK =>", result);
    return result;
  } catch (error) {
    console.error("[auth.client] verifyOtp FAILED =>", error);
    throw error;
  }
};

export const resendOtp = async (
  data: ResendOtpRequest,
): Promise<ResendOtpResponse> => {
  console.log(
    "[auth.client] resendOtp => POST",
    CUSTOMER_AUTH_CLIENT_PATHS.OTP_RESEND,
    data,
  );
  const response = await apiClient.post(
    CUSTOMER_AUTH_CLIENT_PATHS.OTP_RESEND,
    data,
  );
  console.log("[auth.client] resendOtp raw response =>", response.data);
  const result = normalizeResendOtpResponse(
    unwrapApiData<ResendOtpResponse>(response.data, "resendOtp"),
  );
  console.log("[auth.client] resendOtp parsed =>", result);
  return result;
};

export const loginWithPassword = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  console.log(
    "[auth.client] loginWithPassword => POST",
    CUSTOMER_AUTH_CLIENT_PATHS.LOGIN,
  );
  const response = await apiClient.post(CUSTOMER_AUTH_CLIENT_PATHS.LOGIN, data);
  console.log("[auth.client] loginWithPassword raw response =>", response.data);
  const result = normalizeLoginResponse(
    unwrapApiData<LoginResponse>(response.data, "loginWithPassword"),
  );
  console.log("[auth.client] loginWithPassword parsed =>", result);
  return result;
};

function normalizeLoginResponse(result: LoginResponse): LoginResponse {
  const record = getRecord(result);
  const requiresTwoFactor =
    Boolean(record.requiresTwoFactor) ||
    Boolean(record.twoFactorToken) ||
    Boolean(record.twoFactorMethod);

  return {
    ...result,
    success: result.success ?? true,
    requiresTwoFactor,
    twoFactorToken:
      pickString(record, ["twoFactorToken", "token"]) ?? result.twoFactorToken,
    twoFactorMethod:
      pickString(record, ["twoFactorMethod"]) ?? result.twoFactorMethod,
    otpSentTo:
      pickString(record, ["otpSentTo", "maskedDestination", "maskedPhone"]) ??
      result.otpSentTo,
    errorMessage:
      pickString(record, ["errorMessage", "error"]) ??
      result.errorMessage ??
      null,
  };
}

export const verifyLoginTwoFactor = async (
  data: VerifyLoginTwoFactorRequest,
): Promise<VerifyLoginTwoFactorResponse> => {
  console.log(
    "[auth.client] verifyLoginTwoFactor => POST",
    CUSTOMER_AUTH_CLIENT_PATHS.LOGIN_VERIFY_2FA,
    {
      twoFactorToken: data.twoFactorToken,
      code: data.code,
      deviceFingerPrint: data.deviceFingerPrint,
    },
  );
  const response = await apiClient.post(
    CUSTOMER_AUTH_CLIENT_PATHS.LOGIN_VERIFY_2FA,
    {
      twoFactorToken: data.twoFactorToken,
      code: data.code,
      deviceFingerPrint: data.deviceFingerPrint,
    },
  );
  console.log(
    "[auth.client] verifyLoginTwoFactor raw response =>",
    response.data,
  );
  const result = unwrapApiData<VerifyLoginTwoFactorResponse>(
    response.data,
    "verifyLoginTwoFactor",
  );
  console.log("[auth.client] verifyLoginTwoFactor parsed =>", result);
  return result;
};

export const resendLoginTwoFactorOtp = async (
  twoFactorToken: string,
): Promise<ResendOtpResponse> => {
  console.log("[auth.client] resendLoginTwoFactorOtp =>", {
    token: twoFactorToken,
  });
  return resendOtp({ token: twoFactorToken });
};

export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post(CUSTOMER_AUTH_CLIENT_PATHS.REGISTER, data);
  return unwrapApiData<RegisterResponse>(response.data, "register");
};

function normalizeForgotPasswordResponse(
  result: ForgotPasswordResponse,
): ForgotPasswordResponse {
  const record = getRecord(result);
  return {
    ...result,
    success: result.success ?? true,
    resetToken:
      pickString(record, ["resetToken", "token", "flowToken"]) ??
      result.resetToken,
    maskedDestination:
      pickString(record, [
        "maskedDestination",
        "maskedPhone",
        "otpSentTo",
        "maskedEmail",
      ]) ?? result.maskedDestination,
    deliveryMethod:
      pickString(record, ["deliveryMethod"]) ?? result.deliveryMethod,
    resendCooldownSeconds:
      pickNumber(record, [
        "resendCooldownSeconds",
        "cooldownSeconds",
        "retryAfterSeconds",
      ]) ??
      result.resendCooldownSeconds ??
      120,
    otpExpiresInSeconds:
      pickNumber(record, ["otpExpiresInSeconds", "expiresInSeconds"]) ??
      result.otpExpiresInSeconds ??
      0,
    errorMessage:
      pickString(record, ["errorMessage", "error", "message"]) ??
      result.errorMessage ??
      null,
    errorCode:
      pickString(record, ["errorCode", "code"]) ?? result.errorCode ?? null,
  };
}

export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post(
    CUSTOMER_AUTH_CLIENT_PATHS.PASSWORD_FORGOT,
    { username: data.username },
  );
  return normalizeForgotPasswordResponse(
    unwrapApiData<ForgotPasswordResponse>(response.data, "forgotPassword"),
  );
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post(
    CUSTOMER_AUTH_CLIENT_PATHS.PASSWORD_RESET,
    {
      resetToken: data.resetToken,
      otpCode: data.otpCode,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    },
  );
  const result = unwrapApiData<ResetPasswordResponse>(
    response.data,
    "resetPassword",
  );
  const record = getRecord(result);
  return {
    ...result,
    success: result.success ?? true,
    errorMessage:
      pickString(record, ["errorMessage", "error", "message"]) ??
      result.errorMessage ??
      null,
    errorCode:
      pickString(record, ["errorCode", "code"]) ?? result.errorCode ?? null,
  };
};

function normalizeStartChangePasswordOtpResponse(
  result: StartChangePasswordOtpResponse,
): StartChangePasswordOtpResponse {
  const record = getRecord(result);
  return {
    ...result,
    success: result.success ?? true,
    verificationToken:
      pickString(record, ["verificationToken", "token", "flowToken"]) ??
      result.verificationToken,
    otpSentTo:
      pickString(record, [
        "otpSentTo",
        "maskedDestination",
        "maskedPhone",
        "maskedEmail",
      ]) ?? result.otpSentTo,
    deliveryMethod:
      pickString(record, ["deliveryMethod"]) ?? result.deliveryMethod,
    expiresAt: pickString(record, ["expiresAt"]) ?? result.expiresAt,
    remainingAttempts:
      pickNumber(record, ["remainingAttempts"]) ?? result.remainingAttempts,
    developmentCode:
      pickString(record, ["developmentCode"]) ?? result.developmentCode,
    errorMessage:
      pickString(record, ["errorMessage", "error", "message"]) ??
      result.errorMessage ??
      null,
    errorCode:
      pickString(record, ["errorCode", "code"]) ?? result.errorCode ?? null,
  };
}

export const startChangePasswordOtp = async (
  data: StartChangePasswordOtpRequest,
): Promise<StartChangePasswordOtpResponse> => {
  const response = await apiClient.post(
    CUSTOMER_AUTH_CLIENT_PATHS.ME_PASSWORD_OTP_START,
    { currentPassword: data.currentPassword },
  );

  console.log(
    "[auth.client] startChangePasswordOtp raw response =>",
    response.data,
  );
  return normalizeStartChangePasswordOtpResponse(
    unwrapApiData<StartChangePasswordOtpResponse>(
      response.data,
      "startChangePasswordOtp",
    ),
  );
};

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  console.log(
    "[auth.client] changePassword => PATCH",
    CUSTOMER_AUTH_CLIENT_PATHS.ME_PASSWORD_CHANGE,
    data,
  );
  const response = await apiClient.patch(
    CUSTOMER_AUTH_CLIENT_PATHS.ME_PASSWORD_CHANGE,
    {
      verificationToken: data.verificationToken,
      otpCode: data.otpCode,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    },
  );

  console.log("[auth.client] changePassword raw response =>", response.data);
  const result = unwrapApiData<ChangePasswordResponse>(
    response.data,
    "changePassword",
  );
  const record = getRecord(result);
  return {
    ...result,
    success: result.success ?? true,
    errorMessage:
      pickString(record, ["errorMessage", "error", "message"]) ??
      result.errorMessage ??
      null,
    errorCode:
      pickString(record, ["errorCode", "code"]) ?? result.errorCode ?? null,
    message: pickString(record, ["message"]) ?? result.message,
  };
};

/** کاربر را از شکل‌های مختلف پاسخ /me استخراج می‌کند. */
function extractUser(payload: unknown): UserInfoDto {
  if (!payload || typeof payload !== "object") {
    throw new Error("getMe: پاسخ سرور نامعتبر است");
  }

  const root = payload as Record<string, unknown>;
  const candidates: unknown[] = [
    root.userInfoDto,
    (root.data as Record<string, unknown> | undefined)?.userInfoDto,
    root.data,
    root,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      "userId" in (candidate as Record<string, unknown>)
    ) {
      return candidate as UserInfoDto;
    }
  }

  throw new Error("getMe: اطلاعات کاربر در پاسخ پیدا نشد");
}

export const getMe = async (): Promise<UserInfoDto> => {
  const response = await apiClient.get(CUSTOMER_AUTH_CLIENT_PATHS.ME);
  console.log(
    "[auth.client] CustomerAuth/me raw response before store =>",
    response.data,
  );
  return extractUser(response.data);
};

export interface AvatarUploadResponse {
  success?: boolean;
  message?: string;
  errorMessage?: string | null;
  avatarUrl?: string;
}

function extractAvatarUrl(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const record = payload as Record<string, unknown>;
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  return (
    pickString(data, ["avatarUrl", "url", "imageUrl"]) ??
    pickString(record, ["avatarUrl", "url", "imageUrl"])
  );
}

export const uploadAvatar = async (
  file: File,
): Promise<AvatarUploadResponse> => {
  const formData = new FormData();
  // نام فیلد رایج در بک‌اندهای ASP.NET برای IFormFile
  formData.append("file", file);

  console.log("[auth.client] uploadAvatar =>", {
    path: CUSTOMER_AUTH_CLIENT_PATHS.ME_AVATAR,
    field: "file",
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });

  try {
    const response = await apiClient.post(
      CUSTOMER_AUTH_CLIENT_PATHS.ME_AVATAR,
      formData,
    );
    console.log("[auth.client] uploadAvatar response =>", response.data);

    if (!response.data) {
      return { success: true };
    }

    let record: Record<string, unknown> = {};
    try {
      record = getRecord(
        unwrapApiData<AvatarUploadResponse>(response.data, "uploadAvatar"),
      );
    } catch (parseError) {
      console.warn(
        "[auth.client] uploadAvatar parse fallback =>",
        parseError,
        response.data,
      );
      record = getRecord(response.data);
    }

    return {
      success: (record.success as boolean | undefined) ?? true,
      message: pickString(record, ["message"]),
      errorMessage: pickString(record, ["errorMessage", "error"]) ?? null,
      avatarUrl: extractAvatarUrl(response.data) ?? extractAvatarUrl(record),
    };
  } catch (error) {
    console.error("[auth.client] uploadAvatar failed =>", error);
    if (error instanceof ApiError) {
      console.error("[auth.client] uploadAvatar error body =>", {
        status: error.status,
        code: error.code,
        message: error.message,
        data: error.data,
      });
    }
    throw error;
  }
};

export const deleteAvatar = async (): Promise<AvatarUploadResponse> => {
  console.log("[auth.client] deleteAvatar =>", {
    path: CUSTOMER_AUTH_CLIENT_PATHS.ME_AVATAR,
    method: "DELETE",
  });

  try {
    const response = await apiClient.delete(
      CUSTOMER_AUTH_CLIENT_PATHS.ME_AVATAR,
    );
    console.log("[auth.client] deleteAvatar response =>", response.data);

    const record =
      response.data && typeof response.data === "object"
        ? getRecord(response.data)
        : {};

    return {
      success: (record.success as boolean | undefined) ?? true,
      message: pickString(record, ["message"]),
      errorMessage: pickString(record, ["errorMessage", "error"]) ?? null,
    };
  } catch (error) {
    console.error("[auth.client] deleteAvatar failed =>", error);
    if (error instanceof ApiError) {
      console.error("[auth.client] deleteAvatar error body =>", {
        status: error.status,
        code: error.code,
        message: error.message,
        data: error.data,
      });
    }
    throw error;
  }
};

export const getProfile = async (): Promise<Partial<UserInfoDto>> => {
  const response = await apiClient.get("/CustomerAuth/me/profile");

  if (response.data && typeof response.data === "object") {
    const root = response.data as Record<string, unknown>;
    const dataRecord =
      root.data && typeof root.data === "object"
        ? (root.data as Record<string, unknown>)
        : root;
    const data =
      dataRecord.userInfoDto && typeof dataRecord.userInfoDto === "object"
        ? (dataRecord.userInfoDto as Partial<UserInfoDto>)
        : (dataRecord as Partial<UserInfoDto>);

    return data;
  }

  throw new Error("getProfile: پاسخ سرور نامعتبر است");
};

export const updateProfile = async (
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  const response = await apiClient.put("/CustomerAuth/me/profile", data);

  try {
    return extractUser(response.data);
  } catch {
    return {
      ...(response.data as UserInfoDto),
      ...data,
      birthDate: data.birthDate ?? undefined,
    };
  }
};

function normalizeEmailVerificationStart(
  result: EmailVerificationStartResponse,
): EmailVerificationStartResponse {
  const record = getRecord(result);
  return {
    ...result,
    success: result.success ?? true,
    message: pickString(record, ["message"]) ?? result.message ?? null,
    errorMessage:
      pickString(record, ["errorMessage", "error"]) ??
      result.errorMessage ??
      null,
    email: pickString(record, ["email", "otpSentTo"]) ?? result.email ?? null,
    maskedEmail:
      pickString(record, ["maskedEmail", "maskedEmailAddress"]) ??
      result.maskedEmail ??
      null,
    otpSentTo:
      pickString(record, ["otpSentTo", "email"]) ?? result.otpSentTo ?? null,
  };
}

function unwrapEmailActionResponse<T>(payload: unknown, label: string): T {
  try {
    return unwrapApiData<T>(payload, label);
  } catch {
    console.warn(`[auth.client] ${label}: fallback to raw payload`);
    return (payload && typeof payload === "object" ? payload : {}) as T;
  }
}

export const startEmailVerification =
  async (): Promise<EmailVerificationStartResponse> => {
    console.log(
      "[auth.client] startEmailVerification => POST /CustomerAuth/me/email/verification/start",
    );
    const response = await apiClient.post(
      "/CustomerAuth/me/email/verification/start",
      {},
    );
    console.log(
      "[auth.client] startEmailVerification raw response =>",
      response.data,
    );

    const result = normalizeEmailVerificationStart(
      unwrapEmailActionResponse<EmailVerificationStartResponse>(
        response.data,
        "startEmailVerification",
      ),
    );
    console.log("[auth.client] startEmailVerification parsed =>", result);
    return result;
  };

export const verifyEmail = async (
  code: string,
): Promise<EmailVerifyResponse> => {
  console.log(
    "[auth.client] verifyEmail => POST /CustomerAuth/me/email/verify",
    {
      code,
    },
  );
  const response = await apiClient.post("/CustomerAuth/me/email/verify", {
    code,
  });
  console.log("[auth.client] verifyEmail raw response =>", response.data);

  const result = unwrapEmailActionResponse<EmailVerifyResponse>(
    response.data,
    "verifyEmail",
  );
  console.log("[auth.client] verifyEmail parsed =>", result);
  return result;
};

export const enableTwoFactor = async (): Promise<TwoFactorToggleResponse> => {
  console.log(
    "[auth.client] enableTwoFactor => PATCH /CustomerAuth/me/two-factor/enable",
  );
  const response = await apiClient.patch(
    "/CustomerAuth/me/two-factor/enable",
    {},
  );
  console.log("[auth.client] enableTwoFactor raw response =>", response.data);
  const result = unwrapEmailActionResponse<TwoFactorToggleResponse>(
    response.data,
    "enableTwoFactor",
  );
  console.log("[auth.client] enableTwoFactor parsed =>", result);
  return result;
};

export const disableTwoFactor = async (): Promise<TwoFactorToggleResponse> => {
  console.log(
    "[auth.client] disableTwoFactor => PATCH /CustomerAuth/me/two-factor/disable",
  );
  const response = await apiClient.patch(
    "/CustomerAuth/me/two-factor/disable",
    {},
  );
  console.log("[auth.client] disableTwoFactor raw response =>", response.data);
  const result = unwrapEmailActionResponse<TwoFactorToggleResponse>(
    response.data,
    "disableTwoFactor",
  );
  console.log("[auth.client] disableTwoFactor parsed =>", result);
  return result;
};

export const logout = async (): Promise<void> => {
  await apiClient.post(CUSTOMER_AUTH_CLIENT_PATHS.LOGOUT, {});
};

/** درخواست توکن جدید از طریق refresh-token. در صورت موفقیت کوکی‌ها به‌روز می‌شوند. */
export const refreshSession = async (): Promise<void> => {
  await apiClient.post(CUSTOMER_AUTH_CLIENT_PATHS.REFRESH, {});
};

/**
 * وضعیت احراز هویت را بررسی می‌کند:
 * 1) getMe → اگر موفق، کاربر برمی‌گردد.
 * 2) اگر شکست خورد، یک‌بار refresh-token می‌زند و دوباره getMe را تلاش می‌کند.
 * در صورت شکست نهایی null برمی‌گرداند.
 */
export const resolveSession = async (): Promise<UserInfoDto | null> => {
  try {
    return await getMe();
  } catch {
    try {
      await refreshSession();
      return await getMe();
    } catch {
      return null;
    }
  }
};

function extractValidationMessages(errors: unknown): string[] {
  if (!errors) return [];

  // فرمت آرایه‌ای: [{ field, message }]
  if (Array.isArray(errors)) {
    return errors
      .map((item) => {
        if (!item || typeof item !== "object") return "";
        const record = item as Record<string, unknown>;
        return typeof record.message === "string" ? record.message : "";
      })
      .filter(Boolean);
  }

  // فرمت ASP.NET ProblemDetails: { "body": ["..."], "$.category": ["..."] }
  if (typeof errors === "object") {
    return Object.values(errors as Record<string, unknown>).flatMap((value) => {
      if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === "string");
      }
      if (typeof value === "string") return [value];
      return [];
    });
  }

  return [];
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const data = error.data as
      | (ApiEnvelope<unknown> & {
          errors?: unknown;
          title?: string;
        })
      | undefined;
    const nested =
      data?.data && typeof data.data === "object"
        ? (data.data as ApiEnvelope<unknown> & {
            errors?: unknown;
            title?: string;
          })
        : undefined;

    const validationMessages = [
      ...extractValidationMessages(data?.errors),
      ...extractValidationMessages(nested?.errors),
    ];

    // پیام‌های فنی enum را به فارسی ساده‌تر کن
    const friendlyValidation = validationMessages.map((message) => {
      if (
        message.includes("could not be converted") &&
        message.includes("ategory")
      ) {
        return "دسته‌بندی انتخاب‌شده معتبر نیست";
      }
      if (message.toLowerCase().includes("body field is required")) {
        return "متن تیکت الزامی است";
      }
      return message;
    });

    if (friendlyValidation.length > 0) {
      return friendlyValidation[0].trim();
    }

    const backendMessage = [
      data?.message,
      nested?.message,
      data?.title,
      nested?.title,
      data?.errorMessage,
      nested?.errorMessage,
    ].find((value): value is string => Boolean(value && value.trim()));

    if (backendMessage) return backendMessage.trim();

    const backendCode = [
      data?.code,
      nested?.code,
      data?.errorCode,
      nested?.errorCode,
    ]
      .find((value): value is string => Boolean(value && value.trim()))
      ?.trim();

    if (backendCode && AUTH_ERROR_MESSAGES[backendCode]) {
      return AUTH_ERROR_MESSAGES[backendCode];
    }

    const candidates = [error.code, error.message, String(error.status)].filter(
      (value): value is string => Boolean(value),
    );

    for (const value of candidates) {
      const normalized = value.trim();
      if (AUTH_ERROR_MESSAGES[normalized])
        return AUTH_ERROR_MESSAGES[normalized];
    }

    return candidates[0] ?? "خطایی رخ داد";
  }

  if (error instanceof Error) {
    return AUTH_ERROR_MESSAGES[error.message] ?? error.message;
  }
  return "ارتباط با سرور برقرار نشد";
}

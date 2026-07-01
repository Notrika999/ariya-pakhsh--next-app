// src/lib/types/auth/auth.type.ts
export interface StartAuthRequest {
  phoneNumber: string;
  deviceFingerPrint: string;
}

export interface StartAuthResponse {
  success: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  flowToken: string;
  token?: string;
  maskedPhone: string;
  otpExpiresInSeconds: number;
  resendCooldownSeconds: number;
  deliveryMethod: string;
  retryAfter: string | null;
}

export interface VerifyOtpRequest {
  flowToken: string;
  code: string;
  deviceFingerPrint: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  isNewUser: boolean;
  registrationToken?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  userInfoDto?: UserInfoDto;
  sessionInfoDto?: SessionInfoDto;
}

export interface ResendOtpRequest {
  token: string;
}

export interface ResendOtpResponse {
  success: boolean;
  errorMessage?: string | null;
  errorCode?: string | null;
  message?: string;
  token?: string;
  flowToken?: string;
  maskedPhone?: string;
  maskedDestination?: string;
  deliveryMethod?: string;
  otpExpiresInSeconds?: number;
  resendCooldownSeconds?: number;
  cooldownSeconds?: number;
  nextResendAvailableAt?: string;
  remainingAttempts?: number;
  maxAttempts?: number;
  retryAfter?: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
  deviceFingerPrint: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  code?: string;
  errorMessage?: string | null;
  errorCode?: string | null;
  requiresTwoFactor?: boolean;
  twoFactorToken?: string;
  twoFactorMethod?: string;
  otpSentTo?: string;
  lockoutTimeRemaining?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  deviceId?: string;
  userInfoDto?: UserInfoDto;
  sessionInfoDto?: SessionInfoDto;
}

export interface VerifyLoginTwoFactorRequest {
  twoFactorToken: string;
  code: string;
  deviceFingerPrint: string;
}

export type VerifyLoginTwoFactorResponse = LoginResponse;

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string | null;
}

export type UpdateProfileResponse = UserInfoDto;

export interface EmailVerificationStartResponse {
  success?: boolean;
  message?: string | null;
  errorMessage?: string | null;
  errorCode?: string | null;
  email?: string | null;
  maskedEmail?: string | null;
  otpSentTo?: string | null;
}

export interface EmailVerifyRequest {
  code: string;
}

export interface EmailVerifyResponse {
  success?: boolean;
  message?: string | null;
  errorMessage?: string | null;
  errorCode?: string | null;
  isEmailVerified?: boolean;
}

export interface TwoFactorToggleResponse {
  success?: boolean;
  message?: string | null;
  errorMessage?: string | null;
  errorCode?: string | null;
  twoFactorEnabled?: boolean;
}

// ─── Register ───────────────────────────────────────────────

export interface RegisterRequest {
  registrationToken: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  deviceFingerPrint: string;
}

export interface UserInfoDto {
  userId: string;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  nationalCode?: string;
  birthDate?: string;
  avatarUrl?: string;
  gender?: string;
  phone?: string;
  phoneNumber?: string;
  isEmailVerified?: boolean;
  emailVerifiedAt?: string;
  isPhoneVerified?: boolean;
  phoneVerifiedAt?: string;
  username?: string;
  userStatus?: string;
  userType?: string;
  registrationStatus?: "phoneVerified" | string;
  registrationStatusDisplayName?: string;
  twoFactorEnabled?: boolean;
  hasPassword?: boolean;
  passwordLastChangedAt?: string;
  lockoutEnabled?: boolean;
  lockoutEnd?: string;
  failedLoginAttempts?: number;
  roles?: string[];
  permissions?: string[];
  roleName?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  lastLoginDevice?: string;
  currentSession?: SessionInfoDto;
  preferredLanguage?: string;
  timeZone?: string;
  notificationsEnabled?: boolean;
  notificationPreferences?: string;
}

export interface SessionInfoDto {
  sessionId: string;
  ipAddress: string;
  deviceName: string;
  createdAt: string;
  expiresAt: string;
}

export interface RegisterResponse {
  success: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  deviceId: string;
  userInfoDto: UserInfoDto;
  sessionInfoDto: SessionInfoDto;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
}
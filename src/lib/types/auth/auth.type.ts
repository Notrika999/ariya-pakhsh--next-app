export interface StartAuthRequest {
  phoneNumber: string;
  deviceFingerPrint: string;
}

export interface StartAuthResponse {
  success: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  flowToken: string;
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
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  username: string;
  roles: string[];
  permissions: string[];
  roleName: string;
  createdAt: string;
  lastLoginAt: string;
  lastLoginIp: string;
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
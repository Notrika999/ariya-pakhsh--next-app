// src/lib/types/common/auth
export interface User {
  userId: string
  email: string | null
  firstName: string
  lastName: string
  displayName: string
  avatarUrl?: string | null
  phoneNumber: string
  securityStamp: string
  roleName: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  username: string
  roles: Role[]
  permissions: Permission[]
  createdAt: string
  lastLoginAt?: string | null
  lastLoginIp: string
}

export interface SessionInfo {
  sessionId: string
  createdAt: string
  expiresAt: string
  deviceName?: string | null
}

export type Role =
  | 'SuperAdmin'
  | 'Admin'
  | 'Marketing Manager'
  | 'Store Manager'
  | 'Operator'
  | 'Order Manager'
  | 'Customer Service'
  | 'Accounting'
  | 'Warehouse'
  | 'Customer'

export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  MARKETING_MANAGER: 'Marketing Manager',
  STORE_MANAGER: 'Store Manager',
  OPERATOR: 'Operator',
  CUSTOMER: 'Customer',
  ORDER_MANAGER: 'Order Manager',
  CUSTOMER_SERVICE: 'Customer Service',
  ACCOUNTING: 'Accounting',
  WAREHOUSE: 'Warehouse'
} as const

export type Permission =
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'products.export'
  | 'orders.view'
  | 'orders.edit'
  | 'orders.cancel'
  | 'orders.refund'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'users.assign_role'
  | 'settings.view'
  | 'settings.edit'
  | 'analytics.view'
  | 'analytics.export'

export const PERMISSIONS = {
  // ─── Users ──────────────────
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_ASSIGN_ROLE: 'users.assign_role',

  // ─── Orders ─────────────────
  ORDERS_VIEW: 'orders.view',
  ORDERS_CANCEL: 'orders.cancel',
  ORDERS_EDIT: 'orders.edit',
  ORDERS_REFUND: 'orders.refund',

  // ─── Products ───────────────
  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_EDIT: 'products.edit',
  PRODUCTS_DELETE: 'products.delete',
  PRODUCTS_EXPORT: 'products.export',

  // ─── Reports ────────────────
  REPORTS_VIEW: 'reports.view',
  REPORTS_FINANCIAL: 'reports.financial',
  REPORTS_EXPORT: 'reports.export',

  // ─── Settings ───────────────
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit',
  SETTINGS_ROLES: 'settings.roles',

  // ─── Analytics ───────────────
  ANALYTICS_VIEW: 'analytics.view',
  ANALYTICS_EXPORT: 'analytics.export'
} as const

export interface LoginCredentials {
  email: string
  password: string
  rememberMe: boolean
  deviceFingerPrint: string | null
  isTrustedDevice: boolean
}

export interface TwoFactorVerification {
  twoFactorToken: string
  otpCode: string
  rememberMe: boolean
  deviceFingerPrint: string | null
  isTrustedDevice: boolean
}

export interface AuthState {
  user: User | null
  session: SessionInfo | null
  isAuthenticated: boolean
  rememberMe: boolean
  isLoading: boolean
  isInitialized: boolean
  securityStamp: string | null
  otpSendPhoneNumber: string | null
  otpSendEmail: string | null
  requiresTwoFactor: boolean
  twoFactorToken: string | null
  sessionExpiresIn: number | null
}

export interface AuthActions {
  fetchMe: () => Promise<void>
  login: (credentials: LoginCredentials) => Promise<void>
  verifyTwoFactor: (credentials: TwoFactorVerification) => Promise<void>
  logout: () => Promise<void>
  validateStamp: () => Promise<boolean>
  clearAuth: () => void
  clearTwoFactor: () => void
  setLoading: (loading: boolean) => void
}

export type AuthStore = AuthState & AuthActions

export interface LoginResponse {
  success: boolean
  errorMessage: string | null
  requiresTwoFactor: boolean
  twoFactorToken: string | null
  twoFactorMethod: string | null
  expiresIn: number | null
  tokenType: string
  lockoutTimeRemaining: number | null
  remainingAttempts: number | null
  session: SessionInfo
  otpSendPhoneNumber: string | null
  otpSendEmail: string | null
  deliveryMethod: string | null
}

export interface VerifyTwoFactorResponse {
  success: boolean
  errorMessage: string | null
  requiresTwoFactor: boolean | null
  twoFactorToken: string | null
  twoFactorMethod: string | null
  expiresIn: number | null
  tokenType: string
  remainingAttempts: number | null
  session: SessionInfo | null
}

export interface ResendOtpRequest {
  twoFactorToken: string
}

export interface ResendOtpResponse {
  success: boolean
  message: string
  cooldownSeconds: number
  isResendAllowed: boolean
  nextResendAvailableAt: string | null
  remainingAttempts: number
  maxAttempts: number
  maskedDestination: string | null
  deliveryMethod: string | null
  shouldRedirectToLogin: boolean
  redirectAfterSeconds: number | null
  errorCode: string | null
}

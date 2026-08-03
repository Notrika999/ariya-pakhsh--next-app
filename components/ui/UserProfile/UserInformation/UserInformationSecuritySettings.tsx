"use client";
// components/ui/UserProfile/UserInformation/UserInformationSecuritySettings.jsx
import { useEffect, useState } from "react";
import TitleAfter from "../../../modules/TitleAfter/TitleAfter";
import { UserInfoDto } from "@/src/lib/types/auth/auth.type";
import {
  disableTwoFactor,
  enableTwoFactor,
  getAuthErrorMessage,
  getMe,
  startEmailVerification,
  verifyEmail,
} from "@/src/services/auth/auth.client";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";

function formatDate(value: string | number | Date | null | undefined): string {
  if (!value) return "ثبت نشده";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "ثبت نشده";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function valueOrFallback(
  value: string | number | null | undefined,
  fallback = "ثبت نشده",
): string {
  return value?.toString() || fallback;
}

export default function UserInformationSecuritySettings({
  user,
}: {
  user: UserInfoDto | null;
}) {
  const setUser = useAuthStore((state) => state.setUser);

  // State for showing the password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // State for password fields
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  // Two-factor toggle state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [twoFactorSuccess, setTwoFactorSuccess] = useState<string | null>(null);

  const isEmailVerified = Boolean(user?.isEmailVerified);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationTarget, setVerificationTarget] = useState<string | null>(
    null,
  );
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null,
  );
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setTwoFactorEnabled(Boolean(user?.twoFactorEnabled));
      if (user?.isEmailVerified) {
        setShowEmailVerification(false);
        setVerificationCode("");
        setEmailError(null);
      }
    });
  }, [user?.twoFactorEnabled, user?.isEmailVerified]);

  const handleTwoFactorToggle = async (checked: boolean) => {
  

    const previous = Boolean(user?.twoFactorEnabled);
    setTwoFactorLoading(true);
    setTwoFactorError(null);
    setTwoFactorSuccess(null);
    setTwoFactorEnabled(checked);

    try {
      const result = checked ? await enableTwoFactor() : await disableTwoFactor();
  

      const freshUser = await getMe();
      if (user?.userId) {
        setUser({
          ...user,
          ...freshUser,
          userId: user.userId,
          twoFactorEnabled:
            freshUser.twoFactorEnabled ?? result.twoFactorEnabled ?? checked,
        });
      } else {
        setUser({
          ...freshUser,
          twoFactorEnabled:
            freshUser.twoFactorEnabled ?? result.twoFactorEnabled ?? checked,
        });
      }

      setTwoFactorEnabled(
        freshUser.twoFactorEnabled ?? result.twoFactorEnabled ?? checked,
      );
      setTwoFactorSuccess(
        result.message ??
          (checked
            ? "احراز هویت دو مرحله‌ای فعال شد."
            : "احراز هویت دو مرحله‌ای غیرفعال شد."),
      );
    } catch (error) {
      console.error(
        "[UserInformationSecuritySettings] handleTwoFactorToggle error =>",
        error,
      );
      setTwoFactorEnabled(previous);
      setTwoFactorError(getAuthErrorMessage(error));
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const resolveVerificationTarget = (
    email?: string | null,
    apiEmail?: string | null,
    apiMasked?: string | null,
    apiOtpSentTo?: string | null,
    apiMessage?: string | null,
  ) => apiOtpSentTo || apiMasked || apiEmail || email || apiMessage || null;

  const sendVerificationCode = async () => {
  
    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(null);

    try {
      const result = await startEmailVerification();
      const target = resolveVerificationTarget(
        user?.email,
        result.email,
        result.maskedEmail,
        result.otpSentTo,
        result.message,
      );

   

      setVerificationTarget(target);
      setVerificationMessage(result.message ?? null);
      setShowEmailVerification(true);
      setEmailSuccess(
        result.message ??
          (target
            ? `کد تایید به ${target} ارسال شد. لطفاً صندوق ورودی و پوشه اسپم را بررسی کنید.`
            : "کد تایید به ایمیل شما ارسال شد. لطفاً صندوق ورودی و پوشه اسپم را بررسی کنید."),
      );
      return true;
    } catch (error) {
      console.error(
        "[UserInformationSecuritySettings] sendVerificationCode => error",
        error,
      );
      setEmailError(getAuthErrorMessage(error));
      return false;
    } finally {
      setEmailLoading(false);
    }
  };

  const handleEmailToggle = async (checked: boolean) => {

    if (isEmailVerified) return;

    if (!checked) {
      setShowEmailVerification(false);
      setVerificationCode("");
      setVerificationTarget(null);
      setVerificationMessage(null);
      setEmailError(null);
      setEmailSuccess(null);
      return;
    }

    if (!user?.email?.trim()) {
      setEmailError("ابتدا ایمیل خود را در بخش اطلاعات شخصی ثبت کنید.");
      return;
    }

    await sendVerificationCode();
  };

  const handleVerifyEmailCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = verificationCode.trim();



    if (!code) {
      setEmailError("کد تایید را وارد کنید.");
      return;
    }

    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(null);

    try {
      const result = await verifyEmail(code);


      const freshUser = await getMe();
      setUser({
        ...(user ?? freshUser),
        ...freshUser,
        userId: user?.userId ?? freshUser.userId,
        isEmailVerified:
          freshUser.isEmailVerified ?? result.isEmailVerified ?? true,
      });

      setShowEmailVerification(false);
      setVerificationCode("");
      setEmailSuccess(result.message ?? "ایمیل شما با موفقیت تایید شد.");
    } catch (error) {
      console.error(
        "[UserInformationSecuritySettings] handleVerifyEmailCode => error",
        error,
      );
      setEmailError(getAuthErrorMessage(error));
    } finally {
      setEmailLoading(false);
    }
  };

  const handleResendVerificationCode = async () => {
    setVerificationCode("");
    await sendVerificationCode();
  };

  const handleCancelEmailVerification = () => {
    setShowEmailVerification(false);
    setVerificationCode("");
    setVerificationTarget(null);
    setVerificationMessage(null);
    setEmailError(null);
    setEmailSuccess(null);
  };

  // Toggle show/hide password form
  const togglePasswordForm = () => {
    setShowPasswordForm((prev) => !prev);
  };

  // Handle password updates
  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If you want validation/API, tell me
  };

  const displayName =
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "کاربر";
  const currentSession = user?.currentSession;
  const currentDeviceName =
    currentSession?.deviceName || user?.lastLoginDevice || "دستگاه فعلی";
  const currentSessionIp = currentSession?.ipAddress || user?.lastLoginIp;
  const currentSessionStartedAt =
    currentSession?.createdAt || user?.lastLoginAt;

  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <TitleAfter title={"تنظیمات امنیتی"} tag={false} />

      <div className="space-y-6">
        {/* Account Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              نام کاربر
            </p>
            <p className="font-bold text-gray-800 dark:text-gray-100">
              {displayName}
            </p>
            <p
              className="text-sm text-gray-500 dark:text-gray-400 mt-1"
              dir="ltr"
            >
              {valueOrFallback(user?.phoneNumber ?? user?.phone)}
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              وضعیت ثبت‌نام
            </p>
            <p className="font-bold text-gray-800 dark:text-gray-100">
              {valueOrFallback(
                user?.registrationStatusDisplayName ?? user?.registrationStatus,
              )}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              نوع کاربر: {valueOrFallback(user?.userType)}
            </p>
          </div>
        </div>

        {/* Password Change */}
        {/* <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                تغییر رمز عبور
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {user?.hasPassword
                  ? `آخرین تغییر: ${formatDate(user?.passwordLastChangedAt)}`
                  : "برای حساب شما هنوز رمز عبور ثبت نشده است"}
              </p>
            </div>
            <button
              className="text-primary hover:text-primary/80 font-medium"
              onClick={togglePasswordForm}
            >
              تغییر رمز عبور
            </button>
          </div>

          {showPasswordForm && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="frmCurrentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    رمز عبور فعلی
                  </label>
                  <input
                    type="password"
                    id="frmCurrentPassword"
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="frmNewPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    id="frmNewPassword"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="frmConfirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    تکرار رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    id="frmConfirmPassword"
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
                  >
                    بروزرسانی رمز عبور
                  </button>
                </div>
              </form>
            </div>
          )}
        </div> */}

        {/* Two-Factor Authentication */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                احراز هویت دو مرحله‌ای
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {user?.twoFactorEnabled
                  ? "احراز دومرحله‌ای برای حساب شما فعال است"
                  : "برای افزایش امنیت حساب، احراز دومرحله‌ای را فعال کنید"}
              </p>
            </div>

            <div className="flex items-center shrink-0">
              <span
                className={`text-sm me-2 ${
                  twoFactorEnabled ? "text-green-500" : "text-red-500"
                }`}
              >
                {twoFactorEnabled ? "فعال" : "غیرفعال"}
              </span>

              <label
                className={`relative inline-flex items-center ${
                  twoFactorLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={twoFactorEnabled}
                  disabled={twoFactorLoading}
                  onChange={(e) => void handleTwoFactorToggle(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
                <span className="absolute inset-e-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
              </label>
            </div>
          </div>

          {twoFactorError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              {twoFactorError}
            </div>
          )}

          {twoFactorSuccess && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300">
              {twoFactorSuccess}
            </div>
          )}
        </div>

        {/* Email Verification */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                تایید ایمیل
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isEmailVerified
                  ? `ایمیل تایید شده: ${valueOrFallback(user?.email)}`
                  : user?.email
                    ? `ایمیل ثبت‌شده: ${user.email} — هنوز تایید نشده است`
                    : "ایمیلی ثبت نشده است. ابتدا در بخش اطلاعات شخصی ایمیل خود را وارد کنید."}
              </p>
            </div>

            <div className="flex items-center shrink-0">
              <span
                className={`text-sm me-2 ${
                  isEmailVerified ? "text-green-500" : "text-red-500"
                }`}
              >
                {isEmailVerified ? "فعال" : "غیرفعال"}
              </span>

              <label
                className={`relative inline-flex items-center ${
                  isEmailVerified || emailLoading
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isEmailVerified || showEmailVerification}
                  disabled={isEmailVerified || emailLoading}
                  onChange={(e) => void handleEmailToggle(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
                <span className="absolute inset-e-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></span>
              </label>
            </div>
          </div>

          {emailError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              {emailError}
            </div>
          )}

          {emailSuccess && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300">
              {emailSuccess}
            </div>
          )}

          {showEmailVerification && !isEmailVerified && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                    <i className="far fa-envelope-open-text"></i>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">
                      کد تایید را از ایمیل خود وارد کنید
                    </h4>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {verificationMessage ||
                        "یک کد تایید برای شما ارسال شده است. لطفاً به صندوق ورودی ایمیل خود سر بزنید و در صورت نیاز پوشه اسپم را هم بررسی کنید."}
                    </p>
                    {(verificationTarget || user?.email) && (
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        ارسال‌شده به:{" "}
                        <span className="font-semibold" dir="ltr">
                          {verificationTarget || user?.email}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyEmailCode} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="frmEmailVerificationCode"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    کد تایید ایمیل
                  </label>
                  <input
                    id="frmEmailVerificationCode"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 8),
                      )
                    }
                    placeholder="کد ارسال‌شده را وارد کنید"
                    disabled={emailLoading}
                    dir="ltr"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center tracking-[0.35em] focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => void handleResendVerificationCode()}
                    disabled={emailLoading}
                    className="text-sm font-medium text-primary hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    ارسال مجدد کد
                  </button>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleCancelEmailVerification}
                      disabled={emailLoading}
                      className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      disabled={emailLoading || verificationCode.trim().length === 0}
                      className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-600"
                    >
                      {emailLoading ? "در حال بررسی..." : "تایید ایمیل"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                جلسات فعال
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                آخرین ورود: {formatDate(currentSessionStartedAt)}
              </p>
            </div>
            {/* <button className="text-primary hover:text-primary/80 font-medium">
              مشاهده همه
            </button> */}
          </div>

          <div className="mt-4 space-y-3">
            {currentSessionIp && (
              <div className="flex justify-between items-center p-3 bg-custom-light dark:bg-zinc-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center me-3 bg-blue-100 dark:bg-blue-900">
                    <i className="far fa-shield-check text-blue-600 dark:text-blue-400 text-sm"></i>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {currentDeviceName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      IP: {currentSessionIp}
                      {currentSession?.expiresAt
                        ? ` • انقضا: ${formatDate(currentSession.expiresAt)}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* {sessions.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center p-3 bg-custom-light dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center me-3 ${
                      s.iconColor === "blue"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    <i
                      className={`${s.iconClass} ${
                        s.iconColor === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-green-600 dark:text-green-400"
                      } text-sm`}
                    ></i>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {s.device}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {s.location}
                    </p>
                  </div>
                </div>

                <button
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => removeSession(s.id)}
                >
                  خروج
                </button>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}

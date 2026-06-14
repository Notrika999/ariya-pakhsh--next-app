"use client";
import React, { useState, useEffect, useRef } from "react";
import { verifyOtp } from "@/src/services/auth/auth.service";
import { useAuthStore } from "@/src/lib/stores/auth/auth.store";


const OTP_LENGTH = 6;

interface StepOtpProps {
  onSuccess: (isNewUser: boolean) => void;
  onBack: () => void;
}

export default function StepOtp({ onSuccess, onBack }: StepOtpProps) {
  const { flowToken, phone, maskedPhone, clearAuthFlow, setVerifyResult } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleVerify = async (code: string) => {
    if (!flowToken) {
      setError("توکن معتبر نیست. لطفاً دوباره شماره را وارد کنید");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyOtp({
        flowToken,
        code,
        deviceFingerPrint: "device-id",
      });

      // result = { success, isNewUser, registrationToken, ... }
      console.log("verify result:", result);

      setVerifyResult(result.isNewUser, result.registrationToken);
      onSuccess(result.isNewUser);

    } catch (err: any) {
      console.error("verify error:", err);

      // پیام خطا از server
      const serverMessage =
        err?.response?.data?.data?.errorMessage ??
        err?.response?.data?.message ??
        null;

      setError(serverMessage ?? "کد وارد شده صحیح نیست");
      setDigits(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError(null);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (digit && index === OTP_LENGTH - 1 && newDigits.every((d) => d !== "")) {
      handleVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newDigits = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => { newDigits[i] = char; });
    setDigits(newDigits);
    const nextEmpty = newDigits.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty]?.focus();
    if (newDigits.every((d) => d !== "")) handleVerify(newDigits.join(""));
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <p className="text-sm text-gray-500 text-center">
        کد تأیید به شماره{" "}
        <span className="font-semibold text-gray-800" dir="ltr">
          {maskedPhone ?? phone}
        </span>{" "}
        ارسال شد
      </p>

      <div className="flex gap-2 flex-row-reverse">
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={loading}
            className={[
              "w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition",
              digits[index] ? "border-primary bg-primary/5" : "border-gray-300",
              error ? "!border-red-400" : "focus:border-primary",
              loading ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
            dir="ltr"
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={() => handleVerify(digits.join(""))}
        disabled={!isComplete || loading}
        className={[
          "w-full py-3 rounded-xl text-white transition",
          isComplete && !loading
            ? "bg-primary hover:opacity-90"
            : "bg-slate-300 cursor-not-allowed",
        ].join(" ")}
      >
        {loading ? "در حال تأیید..." : "تأیید کد"}
      </button>

      <button
        onClick={() => { clearAuthFlow(); onBack(); }}
        className="text-sm text-gray-400 hover:text-gray-600 transition"
      >
        ویرایش شماره موبایل
      </button>
    </div>
  );
}
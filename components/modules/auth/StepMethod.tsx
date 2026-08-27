import Link from "next/link";

interface StepMethodProps {
  onOtp: () => void;
  onPassword: () => void;
  onForgot: () => void;
}

export default function StepMethod({
  onOtp,
  onPassword,
}: StepMethodProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={onOtp}
        className="w-full bg-primary text-white py-3 rounded-xl"
      >
        ورود با موبایل
      </button>

      <button
        onClick={onPassword}
        className="w-full border py-3 rounded-xl"
      >
        ورود با رمز عبور
      </button>

      <p className="pt-2 text-center text-xs leading-6 text-gray-500 dark:text-gray-400">
        ورود شما به معنای پذیرش{" "}
        <Link
          href="/rules"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          شرایط کارآپ 24
        </Link>{" "}
        و{" "}
        <Link
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          قوانین حریم‌خصوصی
        </Link>{" "}
        است
      </p>
    </div>
  );
}

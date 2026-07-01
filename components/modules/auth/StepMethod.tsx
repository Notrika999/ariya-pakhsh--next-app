interface StepMethodProps {
  onOtp: () => void;
  onPassword: () => void;
  onForgot: () => void;
}

export default function StepMethod({
  onOtp,
  onPassword,
  onForgot,
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

      <button
        onClick={onForgot}
        className="text-primary text-sm"
      >
        رمز عبور را فراموش کرده‌اید؟
      </button>


    </div>
  );
}

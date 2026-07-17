export default function ReturnTerms({ accepted = false, onChange, disabled = false }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <label className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={accepted}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">شرایط و قوانین مرجوعی</span> را مطالعه
          کرده‌ام و موافقم:
          <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
            <li>کالا باید در شرایط اولیه و بدون استفاده باشد</li>
            <li>
              تمام اقلام همراه محصول (جعبه، دفترچه راهنما و ...) باید بازگردانده
              شود
            </li>
            <li>مبلغ استرداد پس از بررسی و تأیید کالا در انبار انجام می‌شود</li>
            <li>مدت زمان بررسی مرجوعی ۳ تا ۵ روز کاری می‌باشد</li>
          </ul>
        </span>
      </label>
    </div>
  );
}

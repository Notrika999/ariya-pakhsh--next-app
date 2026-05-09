export default function ReturnTerms() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <label className="flex items-start space-x-3 ">
        <input
          type="checkbox"
          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-1"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">شرایط و قوانین مرجوعی</span> را مطالعه
          کرده‌ام و موافقم:
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400">
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

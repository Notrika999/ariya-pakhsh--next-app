// components/ui/UserProfile/OrdersReturn/formContent/ReturnReasons.jsx
export const RETURN_REASONS = [
  {
    value: "defective",
    title: "کالای معیوب یا ناقص",
    description: "خرابی، نقص فنی یا کمبود قطعه",
    icon: "fa-triangle-exclamation",
  },
  {
    value: "wrong_item_sent",
    title: "کالای نادرست ارسال شده",
    description: "محصول، مدل یا قطعه با سفارش متفاوت است",
    icon: "fa-shuffle",
  },
  {
    value: "mismatch_with_description",
    title: "مغایرت با توضیحات",
    description: "مشخصات یا وضعیت کالا با توضیحات همخوانی ندارد",
    icon: "fa-file-lines",
  },
  {
    value: "change_mind",
    title: "تغییر نظر",
    description: "دیگر به کالا نیاز ندارید",
    icon: "fa-rotate-left",
  },
  {
    value: "shipping_damage",
    title: "آسیب‌دیده در حمل و نقل",
    description: "بسته یا کالا در مسیر ارسال آسیب دیده است",
    icon: "fa-box-open",
  },
  {
    value: "other",
    title: "سایر دلایل",
    description: "علت را در توضیحات تکمیلی دقیق بنویسید",
    icon: "fa-circle-question",
  },
];

export default function ReturnReasons({ value, onChange, disabled = false }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          دلیل مرجوعی
        </h3>
        <span className="text-xs font-bold text-red-500">الزامی</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {RETURN_REASONS.map((reason) => {
          const selected = value === reason.value;

          return (
            <label
              key={reason.value}
              className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20 dark:bg-primary/10"
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-800"
              } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <input
                type="radio"
                name="returnReason"
                value={reason.value}
                disabled={disabled}
                className="sr-only"
                checked={selected}
                onChange={(event) => onChange?.(event.target.value)}
              />
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  selected
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300"
                }`}
              >
                <i className={`fa-solid ${reason.icon}`}></i>
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-gray-900 dark:text-gray-100">
                  {reason.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {reason.description}
                </span>
              </span>
              {selected ? (
                <i className="fa-regular fa-circle-check ms-auto text-lg text-primary"></i>
              ) : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}

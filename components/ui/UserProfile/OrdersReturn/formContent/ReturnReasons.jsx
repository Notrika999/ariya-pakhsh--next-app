export default function ReturnReasons({ value, onChange }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
        دلیل مرجوعی
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
            value="defective"
            checked={value === "defective"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            کالای معیوب یا ناقص
          </span>
        </label>
        <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="wrong_item"
            className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
            checked={value === "wrong_item"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            کالای نادرست ارسال شده
          </span>
        </label>
        <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="not_as_described"
            className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
            checked={value === "not_as_described"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            مغایرت با توضیحات
          </span>
        </label>
        <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="change_mind"
            className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
            checked={value === "change_mind"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            تغییر نظر
          </span>
        </label>
        <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="damaged"
            className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
            checked={value === "damaged"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            آسیب دیده در حمل و نقل
          </span>
        </label>
        <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="other"
            className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
            checked={value === "other"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            سایر دلایل
          </span>
        </label>
      </div>
    </div>
  );
}

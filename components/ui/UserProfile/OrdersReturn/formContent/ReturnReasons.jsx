export default function ReturnReasons({ value, onChange }) {
  return (
    <div>
      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
        دلیل مرجوعی
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            value="defective"
            checked={value === "defective"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            کالای معیوب یا ناقص
          </span>
        </label>
        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="wrong_item"
            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            checked={value === "wrong_item"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            کالای نادرست ارسال شده
          </span>
        </label>
        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="not_as_described"
            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            checked={value === "not_as_described"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            مغایرت با توضیحات
          </span>
        </label>
        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="change_mind"
            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            checked={value === "change_mind"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            تغییر نظر
          </span>
        </label>
        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="damaged"
            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            checked={value === "damaged"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ms-3 text-gray-700 dark:text-gray-300">
            آسیب دیده در حمل و نقل
          </span>
        </label>
        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="returnReason"
            value="other"
            className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
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

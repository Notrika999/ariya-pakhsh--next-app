export default function RefundMethod({ value, onChange }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
        روش استرداد وجه
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="refundMethod"
            value="wallet"
            className="refund-method w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            checked={value === "wallet"}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="ms-3">
            <span className="block text-gray-700 dark:text-gray-300 font-medium">
              اعتبار کیف پول
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
              (سریع‌ترین روش - ۲۴ ساعت)
            </span>
          </div>
        </label>
        <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
          <input
            type="radio"
            name="refundMethod"
            value="bank"
            className="refund-method w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            checked={value === "bank"}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="ms-3">
            <span className="block text-gray-700 dark:text-gray-300 font-medium">
              حساب بانکی
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
              (۳-۵ روز کاری)
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}

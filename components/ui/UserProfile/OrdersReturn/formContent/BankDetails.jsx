export default function BankDetails({ value, onChange }) {
  return (
    <div id="bankDetails" className={value ? "" : "hidden"}>
      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
        مشخصات حساب بانکی
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            نام بانک
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            value={value.bankName}
            onChange={(e) => onChange("bankName", e.target.value)}
            placeholder="مثال: ملت"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            شماره شبا
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            value={value.sheba}
            onChange={(e) => onChange("sheba", e.target.value)}
            placeholder="IR..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            شماره کارت
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            value={value.cardNumber}
            onChange={(e) => onChange("cardNumber", e.target.value)}
            placeholder="۶۲۱۹-****-****-****"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            به نام
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            value={value.owner}
            onChange={(e) => onChange("owner", e.target.value)}
            placeholder="نام صاحب حساب"
          />
        </div>
      </div>
    </div>
  );
}

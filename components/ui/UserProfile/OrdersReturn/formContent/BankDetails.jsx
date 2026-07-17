export default function BankDetails({ value, onChange, visible = true }) {
  if (!visible) return null;

  return (
    <div id="bankDetails">
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
        مشخصات حساب بانکی
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            نام بانک
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
            value={value.bankName}
            onChange={(e) => onChange("bankName", e.target.value)}
            placeholder="مثال: ملت"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            شماره شبا
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
            value={value.sheba}
            onChange={(e) => onChange("sheba", e.target.value)}
            placeholder="IR..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            شماره کارت
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
            value={value.cardNumber}
            onChange={(e) => onChange("cardNumber", e.target.value)}
            placeholder="۶۲۱۹-****-****-****"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            به نام
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
            value={value.owner}
            onChange={(e) => onChange("owner", e.target.value)}
            placeholder="نام صاحب حساب"
          />
        </div>
      </div>
    </div>
  );
}

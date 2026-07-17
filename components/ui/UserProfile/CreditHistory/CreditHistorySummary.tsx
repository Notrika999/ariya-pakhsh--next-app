"use client";

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  )} تومان`;
}

export default function CreditHistorySummary({
  totalIncome = 0,
  totalExpense = 0,
  lastTransactionAmount = 0,
}: {
  totalIncome?: number;
  totalExpense?: number;
  lastTransactionAmount?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              مجموع واریزی
            </p>
            <p
              id="total-income"
              className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-200"
            >
              {formatMoney(totalIncome)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <i className="far fa-check-circle text-blue-600 dark:text-blue-400"></i>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              مجموع برداشت
            </p>
            <p
              id="total-expense"
              className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-200"
            >
              {formatMoney(totalExpense)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <i className="far fa-xmark-circle text-red-600 dark:text-red-400"></i>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              آخرین تراکنش
            </p>
            <p
              id="last-transaction"
              className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-200"
            >
              {formatMoney(Math.abs(lastTransactionAmount))}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
            <i className="far fa-clock text-gray-600 dark:text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransactionCard({ item }) {
  const isIncome = item.type === "income" || item.type === "bonus";
  const isExpense = item.type === "expense";
  const isSuccess = item.status === "success";

  // تعیین رنگ بر اساس نوع تراکنش
  const bgColor = isIncome
    ? "bg-green-100 dark:bg-green-900"
    : "bg-red-100 dark:bg-red-900";

  const iconColor = isIncome
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";

  const amountColor = isIncome
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
console.log(item)
  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4"
      data-transaction-id={item.transactionId}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4 mb-3 md:mb-0">
          {/* آیکون نوع تراکنش */}
          <div
            className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}
          >
            <i className={`far ${item.icon} ${bgColor} ${iconColor}`}></i>
          </div>

          {/* عنوان */}
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {item.title}
            </p>

            {item.orderId && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                شماره سفارش: {item.orderId}
              </p>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              شماره تراکنش: {item.transactionId}
            </p>
          </div>
        </div>

        {/* مبلغ + تاریخ */}
        <div className="flex items-center space-x-6">
          <div className="text-left md:text-right">
            <p className={`font-bold text-lg ${amountColor}`}>
              {isIncome ? "+" : "-"}
              {item.amount.toLocaleString()} تومان
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {item.date} - {item.time}
            </p>
          </div>

          {/* وضعیت */}
          {isSuccess && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
              موفق
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

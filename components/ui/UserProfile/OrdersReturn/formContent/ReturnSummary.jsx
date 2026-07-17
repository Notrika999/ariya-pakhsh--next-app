export default function ReturnSummary({ orderItems = [], selections = {} }) {
  const selectedItems = orderItems.filter(
    (item) => selections[item.orderItemId]?.checked,
  );

  const refundableAmount = selectedItems.reduce((total, item) => {
    const quantity = Number(selections[item.orderItemId]?.quantity) || 1;
    return total + (Number(item.unitPrice) || 0) * quantity;
  }, 0);

  return (
    <div className="rounded-lg bg-gray-50 p-6 dark:bg-zinc-800">
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
        خلاصه مرجوعی
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            تعداد محصولات انتخابی
          </span>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {selectedItems.length} از {orderItems.length}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            مبلغ قابل استرداد
          </span>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {refundableAmount.toLocaleString("fa-IR")} تومان
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            هزینه ارسال مرجوعی
          </span>
          <span className="font-medium text-green-600 dark:text-green-400">
            رایگان
          </span>
        </div>

        <div className="border-t border-gray-300 pt-3 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              مبلغ نهایی استرداد
            </span>
            <span className="text-lg font-bold text-primary">
              {refundableAmount.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

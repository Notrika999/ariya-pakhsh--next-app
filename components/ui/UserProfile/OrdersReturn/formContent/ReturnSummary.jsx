export default function ReturnSummary({ products }) {
  // تعداد محصولاتی که انتخاب شده‌اند
  const selectedProductsCount = Object.values(products).filter(
    (p) => p.checked,
  ).length;

  // قیمت محصولات (فعلاً ثابت — مثل نمونه HTML اصلی)
  // اگر می‌خوای داینامیک از API یا props بیاد بگو
  const productPrices = {
    product1: 1100000, // ۱,۱۰۰,۰۰۰
    product2: 1850000, // مثال — می‌تونی تغییر بدی
  };

  // محاسبه مبلغ قابل استرداد
  const refundableAmount = Object.entries(products).reduce(
    (total, [key, product]) => {
      if (product.checked) {
        const price = productPrices[key] || 0;
        return total + price * product.quantity;
      }
      return total;
    },
    0,
  );

  // هزینه ارسال: همیشه رایگان (طبق UI اصلی)
  const finalRefund = refundableAmount;

  return (
    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-6">
      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
        خلاصه مرجوعی
      </h3>

      <div className="space-y-3">
        {/* تعداد محصولات انتخابی */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            تعداد محصولات انتخابی
          </span>
          <span
            id="selectedProductsCount"
            className="font-medium text-gray-800 dark:text-gray-200"
          >
            {selectedProductsCount} از {Object.keys(products).length}
          </span>
        </div>

        {/* مبلغ قابل استرداد */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            مبلغ قابل استرداد
          </span>
          <span
            id="refundableAmount"
            className="font-medium text-gray-800 dark:text-gray-200"
          >
            {refundableAmount.toLocaleString("fa-IR")} تومان
          </span>
        </div>

        {/* هزینه ارسال */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            هزینه ارسال مرجوعی
          </span>
          <span className="font-medium text-green-600 dark:text-green-400">
            رایگان
          </span>
        </div>

        {/* مبلغ نهایی */}
        <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              مبلغ نهایی استرداد
            </span>
            <span
              id="finalRefundAmount"
              className="text-lg font-bold text-primary"
            >
              {finalRefund.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

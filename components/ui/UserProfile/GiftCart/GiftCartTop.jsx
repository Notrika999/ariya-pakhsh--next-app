import TitleAfter from "../../../modules/TitleAfter/TitleAfter";

function formatMoney(value, currency = "تومان") {
  const amount = new Intl.NumberFormat("fa-IR").format(
    Math.max(0, Math.round(Number(value) || 0)),
  );

  return `${amount} ${currency}`;
}

export default function GiftCartTop({ totalBalance = 0, currency = "تومان" }) {
  return (
    <div className="rounded-2xl bg-white p-6 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <TitleAfter title="کارت‌های هدیه" />
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              مدیریت و خرید کارت‌های هدیه
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                موجودی کل
              </p>
              <span className="text-2xl font-bold text-primary">
                {formatMoney(totalBalance, currency)}
              </span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <i className="far fa-gift text-xl text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

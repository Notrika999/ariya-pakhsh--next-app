import { GiftCard } from "@/src/lib/types/userpanel/GiftCard";

export default function GiftCardItem({ card }: { card: GiftCard }) {
  const isActive = card.type === "active";
  const isUsed = card.type === "used";
  const isExpired = card.type === "expired";

  const bgClass = isActive
    ? "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700"
    : "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-gray-700 opacity-60";

  const circleColor = isActive ? "bg-purple-500" : "bg-gray-400";

  const icon = isActive ? (
    <i className="fa-solid fa-check text-white text-sm"></i>
  ) : (
    <i className="fa-solid fa-xmark text-white text-sm"></i>
  );

  return (
    <div
      className={`bg-gradient-to-br rounded-2xl p-6 relative overflow-hidden border ${bgClass}`}
    >
      <div
        className={`absolute top-4 end-4 w-8 h-8 rounded-full flex items-center justify-center ${circleColor}`}
      >
        {icon}
      </div>

      <div className="text-center mt-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 mb-4">
          <span
            className={`text-2xl font-bold ${
              isActive
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-400 line-through"
            }`}
          >
            {card.amount} تومان
          </span>
        </div>

        <h3
          className={`font-semibold mb-2 ${
            isActive
              ? "text-gray-800 dark:text-gray-200"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {card.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              شماره کارت:
            </span>
            <span
              className={`font-mono ${
                isActive
                  ? "text-gray-800 dark:text-gray-200"
                  : "text-gray-400 line-through"
              }`}
            >
              {card.code}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {isActive ? "تاریخ انقضا:" : "تاریخ استفاده:"}
            </span>
            <span
              className={`${
                isActive ? "text-gray-800 dark:text-gray-200" : "text-gray-400"
              }`}
            >
              {card.date}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">وضعیت:</span>
            <span
              className={
                isActive ? "text-green-600 dark:text-green-400" : "text-red-400"
              }
            >
              {isActive ? "فعال" : isUsed ? "استفاده شده" : "منقضی شده"}
            </span>
          </div>
        </div>

        {isActive && (
          <button
            className="copy-gift-card w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200 text-sm font-medium"
            data-code={card.code}
          >
            کپی شماره کارت
          </button>
        )}
      </div>
    </div>
  );
}

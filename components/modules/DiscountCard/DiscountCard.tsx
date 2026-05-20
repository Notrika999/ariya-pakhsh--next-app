import { DiscountCode } from "@/src/lib/types/userpanel/Discount";

const variantStyles = {
  green: {
    bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700",
    badgeText: "text-green-600 dark:text-green-400",
    circle: "bg-green-500",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700",
    badgeText: "text-blue-600 dark:text-blue-400",
    circle: "bg-blue-500",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700",
    badgeText: "text-purple-600 dark:text-purple-400",
    circle: "bg-purple-500",
  },
};

export default function DiscountCard({ data }: { data: DiscountCode }) {
  const isExpired = data.status === "expired";

  const styles = data.variant
    ? variantStyles[data.variant]
    : variantStyles.green;

  return (
    <div
      className={`rounded-2xl p-6 relative overflow-hidden ${
        isExpired
          ? "bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 opacity-60"
          : styles.bg
      }`}
    >
      {/* Status Icon */}
      <div
        className={`absolute top-4 end-4 w-8 h-8 rounded-full flex items-center justify-center ${
          isExpired ? "bg-gray-400" : styles.circle
        }`}
      >
        <i
          className={`fa-solid ${
            isExpired ? "fa-xmark" : "fa-check"
          } text-white text-sm`}
        ></i>
      </div>

      <div className="text-center mt-4">
        <span
          className={`inline-block bg-white dark:bg-zinc-800 text-2xl font-bold px-4 py-2 rounded-lg mb-3 ${
            isExpired ? "text-gray-400 line-through" : styles.badgeText
          }`}
        >
          {data.code}
        </span>

        <h3
          className={`font-semibold mb-2 ${
            isExpired
              ? "text-gray-500 dark:text-gray-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {data.title}
        </h3>

        <p
          className={`text-sm mb-4 ${
            isExpired ? "text-gray-400" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {data.description}
        </p>

        <div
          className={`flex justify-between items-center text-xs ${
            isExpired ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <span>{isExpired ? "منقضی شده:" : "منقضی می‌شود:"}</span>
          <span>{data.expireDate}</span>
        </div>
      </div>
    </div>
  );
}

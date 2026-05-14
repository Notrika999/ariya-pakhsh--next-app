export default function NotificationCard({
  type,
  status,
  iconBgColor,
  iconColor,
  iconClass,
  borderColor,
  badgeLabel,
  title,
  message,
  date,
  onMarkRead,
  onMarkUnread,
  onDelete,
}) {
  return (
    <div
      className={`bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700 border-s-4 ${borderColor} ${
        status === "read" ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div
          className={`shrink-0 w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}
        >
          <div className={`${iconClass} ${iconColor}`}></div>
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {message}
              </p>
            </div>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-opacity-30">
              {badgeLabel}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {date}
            </span>

            <div className="flex items-center space-x-2">
              {status === "unread" ? (
                <button
                  onClick={onMarkRead}
                  className="mark-read-btn text-primary hover:text-primary/80 transition duration-150 text-sm font-medium flex items-center"
                >
                  علامت خوانده شده
                </button>
              ) : (
                <button
                  onClick={onMarkUnread}
                  className="mark-unread-btn text-primary hover:text-primary/80 transition duration-150 text-sm font-medium flex items-center"
                >
                  علامت خوانده نشده
                </button>
              )}

              <button
                onClick={onDelete}
                className="delete-notification-btn text-red-600 hover:text-red-800 transition duration-150 text-sm font-medium flex items-center"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

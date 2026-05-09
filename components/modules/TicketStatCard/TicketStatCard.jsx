export default function TicketStatCard({ icon, bg, title, count }) {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>

        <div className="ms-3 flex-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>

          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}

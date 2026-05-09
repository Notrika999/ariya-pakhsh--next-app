export default function UserFavoritesFilter({
  category,
  sort,
  search,
  onCategoryChange,
  onSortChange,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <select
            className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            <option value="mobile">موبایل</option>
            <option value="laptop">لپ‌تاپ</option>
            <option value="accessory">لوازم جانبی</option>
            <option value="electronics">الکترونیک</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="all">مرتب‌سازی بر اساس</option>
            <option value="recent">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="price-low">قیمت (کم به زیاد)</option>
            <option value="price-high">قیمت (زیاد به کم)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="relative w-full md:w-64">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5 dark:bg-zinc-800 dark:border-gray-600 dark:text-white dark:focus:ring-primary"
          placeholder="جستجوی نام محصول..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}

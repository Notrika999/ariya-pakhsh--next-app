import CustomSelect from "@/components/modules/UserProfile/CustomSelect";

const SORT_OPTIONS = [
  { value: "", label: "همه مرتب‌سازی‌ها" },
  { value: "recent", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
  { value: "price-low", label: "قیمت (کم به زیاد)" },
  { value: "price-high", label: "قیمت (زیاد به کم)" },
];

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
        <CustomSelect
          className="sm:w-44"
          options={SORT_OPTIONS}
          value={sort}
          onChange={(val) => onSortChange(val)}
        />
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

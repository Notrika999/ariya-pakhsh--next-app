"use client";

export default function TicketFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full appearance-none border rounded-lg px-4 pe-10 py-2"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="open">باز</option>
            <option value="pending">در حال بررسی</option>
            <option value="answered">پاسخ داده شده</option>
            <option value="closed">بسته شده</option>
          </select>
        </div>

        {/* Priority */}
        <div className="relative">
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="w-full appearance-none border rounded-lg px-4 pe-10 py-2"
          >
            <option value="">همه اولویت‌ها</option>
            <option value="low">کم</option>
            <option value="medium">متوسط</option>
            <option value="high">بالا</option>
            <option value="urgent">فوری</option>
          </select>
        </div>

        {/* Department */}
        <div className="relative">
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full appearance-none border rounded-lg px-4 pe-10 py-2"
          >
            <option value="">همه دپارتمان‌ها</option>
            <option value="technical">پشتیبانی فنی</option>
            <option value="financial">امور مالی</option>
            <option value="sales">فروش</option>
            <option value="general">عمومی</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-64">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="bg-gray-50 border px-4 py-2 rounded-lg w-full"
          placeholder="جستجوی تیکت..."
        />
      </div>
    </div>
  );
}

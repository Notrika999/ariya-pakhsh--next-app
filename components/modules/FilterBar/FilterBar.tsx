import CustomSelect from "@/components/modules/UserProfile/CustomSelect";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFilter = {
  key: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

type SearchFilter = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

interface FilterBarProps {
  selects?: SelectFilter[];
  search?: SearchFilter;
}

export default function FilterBar({ selects = [], search }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {selects.map((select) => (
          <CustomSelect
            key={select.key}
            options={select.options}
            value={select.value}
            onChange={select.onChange}
          />
        ))}
      </div>

      {search && (
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <i className="far fa-search text-gray-500 dark:text-gray-400"></i>
          </div>

          <input
            type="text"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5 dark:bg-zinc-800 dark:border-gray-600 dark:text-white dark:focus:ring-primary"
          />
        </div>
      )}
    </div>
  );
}
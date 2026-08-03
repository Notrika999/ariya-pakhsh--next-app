"use client";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";
import DatePicker from "@/components/modules/DatePicker/AppDatePicker";
import CustomSelect from "@/components/modules/UserProfile/CustomSelect";
import "react-multi-date-picker/styles/colors/red.css";

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

type DateRangeFilter = {
  fromDate: string;
  toDate: string;
  fromLabel?: string;
  toLabel?: string;
  placeholder?: string;
  clearLabel?: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
};

interface FilterBarProps {
  selects?: SelectFilter[];
  search?: SearchFilter;
  dateRange?: DateRangeFilter;
}

function toPickerValue(dateValue: string) {
  if (!dateValue) return null;

  const date = new Date(`${dateValue}T00:00:00.000`);
  if (Number.isNaN(date.getTime())) return null;

  return new DateObject({
    date,
    calendar: gregorian,
    locale: gregorian_en,
  }).convert(persian, persian_fa);
}

function toInputDate(value: unknown) {
  if (!value || Array.isArray(value)) return "";

  const date = new DateObject(value).convert(gregorian, gregorian_en);
  return date.format("YYYY-MM-DD");
}

function getRangeValue(dateRange: DateRangeFilter) {
  return [toPickerValue(dateRange.fromDate), toPickerValue(dateRange.toDate)]
    .filter(Boolean);
}

function handleRangeChange(value: unknown, dateRange: DateRangeFilter) {
  if (!Array.isArray(value)) {
    dateRange.onFromDateChange(toInputDate(value));
    dateRange.onToDateChange("");
    return;
  }

  dateRange.onFromDateChange(toInputDate(value[0]));
  dateRange.onToDateChange(toInputDate(value[1]));
}

export default function FilterBar({
  selects = [],
  search,
  dateRange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        {selects.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {selects.map((select) => (
              <CustomSelect
                key={select.key}
                options={select.options}
                value={select.value}
                onChange={select.onChange}
              />
            ))}
          </div>
        )}

        {dateRange && (
          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-3 text-gray-500 dark:text-gray-400">
              <i className="far fa-calendar-range"></i>
            </div>

            <DatePicker
              range
              rangeHover
              value={getRangeValue(dateRange)}
              onChange={(value) => handleRangeChange(value, dateRange)}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              className="red"
              containerClassName="w-full"
              inputClass="block h-[42px] w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 ps-10 pe-10 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
              placeholder={dateRange.placeholder ?? "بازه تاریخ"}
              format="YYYY/MM/DD"
              editable={false}
            />

            {(dateRange.fromDate || dateRange.toDate) && (
              <button
                type="button"
                aria-label={dateRange.clearLabel ?? "پاک کردن بازه تاریخ"}
                onClick={() => {
                  dateRange.onFromDateChange("");
                  dateRange.onToDateChange("");
                }}
                className="absolute inset-y-0 end-0 z-10 flex w-9 items-center justify-center rounded-e-lg text-gray-400 transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:text-gray-200"
              >
                <i className="far fa-times"></i>
              </button>
            )}
          </div>
        )}
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

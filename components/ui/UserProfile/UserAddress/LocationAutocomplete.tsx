"use client";
// components/ui/UserProfile/UserAddress/LocationAutocomplete.tsx
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FieldError, fieldClass } from "@/src/utils/form.validation";

export type LocationAutocompleteOption = {
  id: string;
  name: string;
  parentId?: string;
};

type LocationAutocompleteProps = {
  label: string;
  value: string;
  options: readonly LocationAutocompleteOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onClearError?: () => void;
};

export default function LocationAutocomplete({
  label,
  value,
  options,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  onClearError,
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const filteredOptions = useMemo(() => {
    const query = value.trim();
    if (!query) return options;
    return options.filter((option) => option.name.includes(query));
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (option: LocationAutocompleteOption) => {
    onChange(option.name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const nextValue = e.target.value;
          onChange(nextValue);
          onClearError?.();
          setIsOpen(true);
        }}
        onFocus={() => !disabled && setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-invalid={Boolean(error)}
        className={[
          fieldClass(Boolean(error)),
          "appearance-none rounded-lg px-4 py-2 pe-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      />
      <FieldError message={error} />

      {isOpen && !disabled && filteredOptions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-zinc-900"
        >
          {filteredOptions.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={option.name === value}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectOption(option);
                }}
                className="w-full px-4 py-2 text-start text-sm text-gray-700 transition hover:bg-primary/10 dark:text-gray-200 dark:hover:bg-primary/20"
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

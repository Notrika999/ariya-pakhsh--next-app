import type { ReactNode } from "react";

export type FieldErrorProps = {
  message?: string | null;
};

export function FieldError({ message }: FieldErrorProps): ReactNode {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function fieldClass(hasError: boolean): string {
  return [
    "mt-1 w-full rounded-md border p-2 dark:bg-custom-dark dark:text-gray-200",
    hasError
      ? "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
      : "dark:border-gray-700",
  ].join(" ");
}

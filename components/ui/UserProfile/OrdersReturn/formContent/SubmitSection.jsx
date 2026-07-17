export default function SubmitSection({ onSubmit, submitting = false, disabled = false }) {
  return (
    <div className="flex flex-col border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 sm:mb-0">
        پس از ثبت درخواست، کد رهگیری ارسال خواهد شد.
      </p>

      <button
        onClick={onSubmit}
        type="button"
        disabled={submitting || disabled}
        className="w-full rounded-lg bg-primary px-8 py-3 text-center font-medium text-white transition duration-200 hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "در حال ثبت..." : "ثبت درخواست مرجوعی"}
      </button>
    </div>
  );
}

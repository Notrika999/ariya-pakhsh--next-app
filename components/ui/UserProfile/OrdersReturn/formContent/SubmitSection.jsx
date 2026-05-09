export default function SubmitSection({ onSubmit }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
        پس از ثبت درخواست، کد رهگیری ارسال خواهد شد.
      </p>

      <button
        onClick={onSubmit}
        type="button"
        className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 font-medium w-full sm:w-auto text-center"
      >
        ثبت درخواست مرجوعی
      </button>
    </div>
  );
}

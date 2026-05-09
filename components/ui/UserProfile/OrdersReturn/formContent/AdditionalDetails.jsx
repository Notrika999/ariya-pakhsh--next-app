export default function AdditionalDetails({ value, onChange }) {
  return (
    <div>
      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
        توضیحات تکمیلی
      </h3>

      <textarea
        rows="4"
        className="w-full appearance-none border rounded-lg px-4 pe-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
        placeholder="لطفاً توضیحات کامل‌تری ارائه دهید..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        توضیحات دقیق به ما در بررسی سریع‌تر درخواست کمک می‌کند.
      </p>
    </div>
  );
}

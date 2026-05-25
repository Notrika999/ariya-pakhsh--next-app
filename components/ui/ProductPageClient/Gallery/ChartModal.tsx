export default function ChartModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/40">
      <div className="bg-white dark:bg-custom-dark rounded-lg shadow-lg w-full max-w-6xl border dark:border-gray-700">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl dark:text-white">نمودار قیمت</h3>

          <button onClick={onClose} className="text-gray-500 text-2xl">
            ✕
          </button>
        </div>

        <div className="p-6">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              نمودار قیمت محصول
            </h1>

            <p className="text-gray-600 mt-2 dark:text-gray-400">
              تغییرات قیمت محصول در ۱۲ ماه گذشته
            </p>
          </header>

          <div className="relative h-80">
            <canvas id="priceChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

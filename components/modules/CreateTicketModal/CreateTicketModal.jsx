export default function CreateTicketModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      department: formData.get("department"),
      priority: formData.get("priority"),
      status: "open",
      message: formData.get("message"),
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-custom-dark rounded-xl shadow-xl w-full max-w-lg p-6 z-10 animate-[modalFade_0.2s_ease]">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          ایجاد تیکت جدید
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              دپارتمان
            </label>
            <select
              name="department"
              className="mt-1 w-full p-2 rounded-md border dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200"
              required
            >
              <option value="support">پشتیبانی</option>
              <option value="finance">مالی</option>
              <option value="technical">فنی</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              اولویت
            </label>
            <select
              name="priority"
              className="mt-1 w-full p-2 rounded-md border dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200"
              required
            >
              <option value="low">کم</option>
              <option value="medium">متوسط</option>
              <option value="high">زیاد</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              متن پیام
            </label>
            <textarea
              name="message"
              className="mt-1 w-full p-3 rounded-md border dark:border-gray-700 dark:bg-custom-dark dark:text-gray-200"
              rows="4"
              placeholder="متن تیکت را وارد کنید..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              انصراف
            </button>

            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200"
            >
              ایجاد تیکت
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modalFade {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

import ErrorUI from "@/components/ui/ErrorUI/ErrorUI";

export default function NotFound() {
  return (
    <ErrorUI
      variant="not-found"
      statusCode="404"
      title="صفحه یافت نشد"
      message="صفحه‌ای که به دنبال آن هستید وجود ندارد، حذف شده یا آدرس آن تغییر کرده است."
    />
  );
}

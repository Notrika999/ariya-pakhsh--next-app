import ErrorUI from "@/components/ui/ErrorUI/ErrorUI";

export default function MagazineArticleNotFound() {
  return (
    <ErrorUI
      variant="not-found"
      statusCode="404"
      title="مقاله یافت نشد"
      message="این مقاله وجود ندارد، حذف شده یا برای انتشار عمومی در دسترس نیست."
    />
  );
}

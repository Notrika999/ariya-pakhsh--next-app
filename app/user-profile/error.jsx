"use client";

import { useEffect } from "react";
import ErrorUI from "@/components/ui/ErrorUI/ErrorUI";

export default function UserProfileError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="lg:col-span-3">
      <ErrorUI
        variant="server"
        statusCode="500"
        title="خطا در بارگذاری پنل کاربری"
        message="دریافت اطلاعات پنل کاربری با مشکل مواجه شد."
        description="لطفا دوباره تلاش کنید. در صورت تداوم مشکل، از بخش پشتیبانی اقدام کنید."
        onRetry={reset}
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ErrorUI from "@/components/ui/ErrorUI/ErrorUI";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    console.error(error);
  }, [error]);

  const errorMessage = error.message ?? "";
  const isNetworkError =
    errorMessage.includes("Network failure") ||
    errorMessage.includes("Request timeout") ||
    errorMessage.includes("fetch failed") ||
    errorMessage.includes("TIMEOUT") ||
    errorMessage.includes("NETWORK_ERROR");

  return (
    <ErrorUI
      variant={isNetworkError ? "network" : "server"}
      statusCode={isNetworkError ? "NET" : "500"}
      title={
        isHomePage
          ? "خطا در بارگذاری صفحه اصلی"
          : undefined
      }
      message={
        isHomePage
          ? "دریافت داده‌های صفحه اصلی با مشکل مواجه شد. لطفا دوباره تلاش کنید."
          : isNetworkError
            ? "ارتباط با سرور برقرار نشد یا پاسخ‌دهی سرویس بیش از حد طول کشید."
            : "مشکلی در پردازش درخواست رخ داد."
      }
      onRetry={reset}
      digest={error.digest}
    />
  );
}

"use client";

import ErrorUI from "@/components/ui/ErrorUI/ErrorUI";

export default function ErrorPage({ error, reset }: any) {
  return (
    <ErrorUI
      message={ "مشکلی در پردازش درخواست رخ داد."}
      onRetry={reset}
    />
  );
}

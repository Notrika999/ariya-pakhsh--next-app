import React from "react";

export default function Intro({ product }) {
  const html = product?.description || "";

  return (
    <div className="space-y-5">
      <h2 className="text-2xl pb-3 font-black text-zinc-800 relative before:absolute before:bottom-0 before:right-0 before:h-1 before:w-22 before:bg-secondary-500 before:rounded dark:text-white">
        معرفی تکمیلی
      </h2>

      {html ? (
        <div
          className="text-neutral-700 leading-9 text-justify text-lg dark:text-white [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pe-6 [&_ol]:list-decimal [&_ol]:pe-6 [&_img]:my-5 [&_img]:rounded-xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-neutral-500 leading-8 dark:text-neutral-400">
          توضیح تکمیلی برای این محصول ثبت نشده است.
        </p>
      )}
    </div>
  );
}

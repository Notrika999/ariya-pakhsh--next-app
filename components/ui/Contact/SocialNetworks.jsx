import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SocialNetworks() {
  return (
    <div className="bg-white space-y-4 dark:bg-custom-dark border-gray-200  border dark:border-gray-700 rounded-2xl shadow-lg p-8">
      <TitleAfter title={"شبکه‌های اجتماعی"} />

      <p className="text-gray-600 dark:text-gray-300">
        ما را در شبکه‌های اجتماعی دنبال کنید تا از جدیدترین اخبار و تخفیف‌ها
        مطلع شوید.
      </p>

      <div className="p-4">
        <ul className="flex items-center justify-center space-x-4" role="list">
          <li role="listitem">
            <Link href="">
              <Image
                width={100}
                height={100}
                src="/images/social/rubika.png"
                alt="روبیکا"
                className="size-7"
              />
            </Link>
          </li>
          <li role="listitem">
            <Link href="">
              <Image
                width={100}
                height={100}
                src="/images/social/aparat.png"
                alt="آپارات"
                className="size-7"
              />
            </Link>
          </li>
          <li role="listitem">
            <Link href="">
              <Image
                width={100}
                height={100}
                src="/images/social/bale.png"
                alt="بله"
                className="size-7"
              />
            </Link>
          </li>
          <li role="listitem">
            <Link href="">
              <Image
                width={100}
                height={100}
                src="/images/social/eitta.png"
                alt="ایتا"
                className="size-7"
              />
            </Link>
          </li>
          <li role="listitem">
            <Link href="">
              <Image
                width={100}
                height={100}
                src="/images/social/igap.png"
                alt="ایگپ"
                className="size-7"
              />
            </Link>
          </li>
          <li role="listitem">
            <Link href="">
              <Image
                width={100}
                height={100}
                src="/images/social/sorush.png"
                alt="سروش"
                className="size-7"
              />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

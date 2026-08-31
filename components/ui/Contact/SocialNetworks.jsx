// components/ui/Contact/SocialNetworks.jsx
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const socialMedia = [
  {
    id: 1,
    src: "/images/social/aparat-white.svg",
    link: "https://www.aparat.com/carup24.com",
    alt: "آپارات",
  },
  {
    id: 2,
    src: "/images/social/instagram-white.svg",
    link: "https://www.instagram.com/carup24.ir",
    alt: "اینستاگرام",
  },
  {
    id: 3,
    src: "/images/social/telegram-white.svg",
    link: "https://t.me/carup24",
    alt: "تلگرام",
  },
];

export default function SocialNetworks() {
  return (
    <div className="bg-white space-y-4 dark:bg-custom-dark border-gray-200  border dark:border-gray-700 rounded-2xl shadow-lg p-8">
      <TitleAfter title={"شبکه‌های اجتماعی"} />

      <p className="text-gray-600 dark:text-gray-300">
        ما را در شبکه‌های اجتماعی دنبال کنید تا از جدیدترین اخبار و تخفیف‌ها
        مطلع شوید.
      </p>

      <div className="p-4">
        <ul className="flex items-center justify-center gap-3" role="list">
          {socialMedia.map((social) => (
            <li key={social.id} role="listitem">
              <Link
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:-translate-y-2 dark:bg-primary-600 dark:hover:bg-primary-500"
              >
                <Image
                  width={30}
                  height={30}
                  src={social.src}
                  alt={social.alt}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

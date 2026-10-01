import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SocialMediaItem({
  image,
  link,
<<<<<<< HEAD
  alt,
}: {
  image: string;
  link: string;
  alt: string
=======
}: {
  image: string;
  link: string;
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
}) {
  return (
    <Link
      href={link}
      className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center me-3 transition-transform hover:-translate-y-2 dark:bg-primary-600 dark:hover:bg-primary-500"
    >
      <Image
        width={30}
        height={30}
        src={image ?? "/images/default.png"}
<<<<<<< HEAD
        alt={alt}
=======
        alt=""
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
      />
    </Link>
  );
}

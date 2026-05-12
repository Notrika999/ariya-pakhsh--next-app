import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SocialMediaItem({ image }) {
  return (
    <Link
      href=""
      className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center me-3 transition-transform hover:-translate-y-2 dark:bg-primary-600 dark:hover:bg-primary-500"
    >
      <Image width={20} height={20} src={image} alt="" />
    </Link>
  );
}

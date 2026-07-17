// MegaSubmenu.jsx
import { Category } from "@/src/lib/types/categories/menuType";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function MegaSubmenu({ sections }: { sections: Category[] }) {
  const thumbItem = sections.find((s) => s?.src);
  const list = sections.filter((s) => !s?.src);

  // دسته بندی
  const withChildren = list.filter((s) => !s.isLeaf);
  const leafItems = list.filter((s) => s.isLeaf);

  // ترتیب نهایی
  const orderedSections = [...withChildren, ...leafItems];

  return (
    <div className="grid grid-cols-10 h-100 overflow-y-scroll  m-3">
      <div className="grid grid-cols-8 col-span-8">
        {orderedSections.map((sec) => (
          <div key={sec.id} className="col-span-2">
            <div className="mb-2">
              {sec.isLeaf ? (
                <Link
                  href={`/products/${sec.slug}`}
                  className="text-sm font-bold hover:text-primary"
                >
                  {sec.name}
                </Link>
              ) : (
                <>
                  <Link href={`/products/${sec.slug}`} className="text-sm font-bold">
                    {sec.name}
                  </Link>

                  <div className="mt-3 space-y-2">
                    {sec.children?.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.slug}`}
                        className="text-[.7rem] text-gray-600 block hover:text-primary dark:text-gray-300"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* menu thumbnail banner، همیشه در ستون اول */}
      {/* <div className="col-span-2">
        {thumbItem && (
          <div>
            <Image
              width={160}
              height={120}
              src={thumbItem.src ?? "/images/default.png"}
              alt="banner"
              className="w-full rounded-lg"
              loading="lazy"
            />
          </div>
        )}
      </div> */}
    </div>
  );
}

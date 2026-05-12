// MegaSubmenu.jsx
import Image from "next/image";
import React from "react";

export default function MegaSubmenu({ sections = [] }) {
  // آیتمی که دارای src است را به عنوان thumbnail در نظر بگیرید
  const thumbItem = sections.find((s) => s && s.src);
  // سایر بخش‌ها (بدون آیتم src)
  const list = sections.filter((s) => !s.src);

  return (
    <div className="grid grid-cols-10 h-100 overflow-y-scroll  m-3">
      <div className="grid grid-cols-8 col-span-8">
        {list.map((sec, idx) => (
          <div key={idx} className="col-span-2">
            <div className="mb-2">
              <p className="text-sm font-bold">{sec.title}</p>
              <div className="mt-3 space-y-2">
                {sec.items && sec.items.length > 0
                  ? sec.items.map((item, i) => (
                      <a
                        key={i}
                        href={item.href}
                        className="text-[.7rem] text-gray-600 block hover:text-primary dark:text-gray-300"
                      >
                        {item.label}
                      </a>
                    ))
                  : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* menu thumbnail banner، همیشه در ستون اول */}
      <div className="col-span-2">
        {thumbItem && (
          <div>
            <Image
              width={160}
              height={120}
              src={thumbItem.src}
              alt="banner"
              className="w-full rounded-lg"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}

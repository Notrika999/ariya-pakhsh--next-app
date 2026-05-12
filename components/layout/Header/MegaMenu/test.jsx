// MegaSubmenu.jsx
import React from "react";

export default function MegaSubmenu({ sections = [] }) {
  return (
    // <div className="grid h-[400px] overflow-y-scroll grid-cols-8 gap-10 m-3">
      

      {sections.map((sec, idx) => (
        <div key={idx} className="col-span-2">
          <div className="mb-4">
            <p className="text-sm font-bold">{sec.title}</p>
            <div className="mt-3 space-y-4">
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
  );
}

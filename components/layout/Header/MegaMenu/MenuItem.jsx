import React from "react";

export default function MenuItem({
  menuID,
  activeMegaId,
  setActiveMegaId,
  title,
}) {
  return (
    <li
      onMouseEnter={() => setActiveMegaId(menuID)} // مقدار داینامیک می‌گیره
      className={`px-4 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-[#1f242c] ${
        activeMegaId === menuID ? "bg-gray-100 dark:bg-[#1f242c]" : ""
      }`}
    >
      <a href="#" className="flex items-center justify-between py-3">
        <div className="flex items-center">
          {/* icon */}
          <div className="ms-1">
            <p className="text-xs">{title}</p>
          </div>
        </div>
        <i className="fa-solid fa-chevron-left  text-sm ms-2"></i>
      </a>
    </li>
  );
}

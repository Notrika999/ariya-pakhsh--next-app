"use client";

import { useState, useMemo } from "react";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const allIcons = {
  ...fas,
  ...far,
  ...fab,
};

export default function IconsPage() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const icons = useMemo(() => {
    return Object.entries(allIcons).filter(([name, icon]) => {
      if (!icon.iconName) return false;

      return (
        icon.iconName.toLowerCase().includes(search.toLowerCase()) ||
        name.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  const handleCopy = async (icon) => {
    const tag = `<i className="${icon.prefix} fa-${icon.iconName}"></i>`;

    await navigator.clipboard.writeText(tag);

    setCopied(icon.iconName);
    setTimeout(() => setCopied(""), 1200);
  };

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="جستجوی آیکون..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded-lg mb-6 w-full max-w-md dark:bg-gray-900"
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {icons.map(([name, icon]) => (
          <button
            key={name}
            onClick={() => handleCopy(icon)}
            className="border rounded-xl p-4 flex flex-col items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <FontAwesomeIcon icon={icon} className="text-2xl" />

            <span className="text-xs text-center break-all">
              {icon.iconName}
            </span>

            {copied === icon.iconName && (
              <span className="text-green-600 text-xs">کپی شد</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

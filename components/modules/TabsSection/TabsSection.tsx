"use client";

import { useState } from "react";

type TabItem = {
  key: string;
  label: string;
  iconClass?: string;
};

type TabsProps = {
  tabs: TabItem[];
  defaultTab: string;
  onChange?: (key: string) => void;
};

export default function TabsSection({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleChange = (key: string) => {
    setActiveTab(key);
    onChange?.(key);
  };

  return (
    <div className="bg-white rounded-2xl drop-shadow-lg px-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <button
                key={tab.key}
                onClick={() => handleChange(tab.key)}
                className={`tab-button py-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${
                  isActive
                    ? "border-primary text-primary dark:text-gray-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {tab.iconClass && (
                  <i className={`${tab.iconClass} w-5 h-5 me-2`}></i>
                )}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

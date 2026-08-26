"use client";

export default function TabsNavigation({ tabs, activeTab, onChange }) {
  return (
    <div className="bg-white rounded-2xl drop-shadow-lg px-3 py-2 dark:bg-custom-dark dark:border dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                className={
                  "tab-button py-4 px-1 border-b-2 font-medium text-sm flex items-center " +
                  (isActive
                    ? "border-primary text-primary dark:text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200")
                }
                onClick={() => onChange(tab.id)}
              >
                <i className={`me-2 ${tab.icon} text-base`}></i>
                {tab.title}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

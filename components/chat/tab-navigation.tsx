import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: { id: string; label: string }[];
}

export function TabNavigation({ activeTab, setActiveTab, tabs }: TabNavigationProps) {
  return (
    <div className="flex border-b dark:border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex-1 py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
            activeTab === tab.id && "text-blue-500 dark:text-blue-400 border-b-2 border-blue-500"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

import { Bug, Task, TimeLog } from "@/generated/prisma/";
import { ItemCard } from "./ItemCard";
import { useDashboardStore } from "@/app/zustand/DashboardStore";

interface ItemsListProps {
  items: (Task | Bug)[];
  timeLogs: TimeLog[];
}

export default function ItemsList({ items, timeLogs }: ItemsListProps) {
  const { activeTab, dateSortOrder } = useDashboardStore();
  const getItemRelatedLogs = (itemId: number) => {
    if (activeTab === "tasks") {
      return timeLogs.filter((log) => log.taskId === itemId);
    }
    return timeLogs.filter((log) => log.bugId === itemId);
  };

  if (dateSortOrder === "asc") {
    items.sort((a, b) => {
      const dateA = activeTab === "tasks" ? a.createdAt : a.updatedAt;
      const dateB = activeTab === "tasks" ? b.createdAt : b.updatedAt;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
  } else {
    items.sort((a, b) => {
      const dateA = activeTab === "tasks" ? a.createdAt : a.updatedAt;
      const dateB = activeTab === "tasks" ? b.createdAt : b.updatedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-md shadow-sm">
        {/* Added a simple icon for visual cue */}
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <div className="mt-4 text-gray-500 text-lg font-medium">
          No {activeTab.toLowerCase()} found matching your filters
        </div>
        <p className="mt-2 text-gray-500">
          Try adjusting your filters or&nbsp;
          {/* Changed to a button for a clear call to action */}
          <button
            onClick={() => {}}
            className="text-indigo-600 hover:text-indigo-900 font-medium"
          >
            {/* #TODO */}
            Create a new {activeTab.slice(0, -1).toLowerCase()}.
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto bg-white shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            timeLogs={getItemRelatedLogs(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}

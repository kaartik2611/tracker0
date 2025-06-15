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
          // Added 'group' class for hover effects on child elements
          // <li key={item.id} className="group relative">
          //   <div
          //     // Subtle background change on hover for the entire list item
          //     className="px-4 py-4 sm:px-6 transition-colors duration-200 group-hover:bg-gray-50"
          //   >
          //     <div className="flex items-start justify-between">
          //       {/* Made title larger and bolder for prominence */}
          //       <h3 className="text-xl font-semibold text-gray-900 leading-tight pr-4">
          //         {item.title}
          //       </h3>
          //       {/* Badges moved closer to the title for better visual grouping */}
          //       <div className="flex space-x-2 flex-shrink-0 mt-1 sm:mt-0">
          //         <PriorityBadge priority={item.priority} />
          //         <StatusBadge status={item.status} />
          //       </div>
          //     </div>
          //     {/* Description text slightly darker for readability */}
          //     <p className="mt-2 text-sm text-gray-700 line-clamp-2">
          //       {item.description}
          //     </p>
          //     <div>
          //       <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
          //         <div className="flex items-center space-x-1">
          //           <span className="font-medium">Assignee:</span>
          //           <span>
          //             <svg
          //               xmlns="http://www.w3.org/2000/svg"
          //               fill="none"
          //               viewBox="0 0 24 24"
          //               strokeWidth={2}
          //               stroke="currentColor"
          //               className="size-4"
          //             >
          //               <path
          //                 strokeLinecap="round"
          //                 strokeLinejoin="round"
          //                 d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          //               />
          //             </svg>
          //           </span>
          //           {getName(item.assignedToId)}
          //         </div>
          //         <div className="flex items-center space-x-1">
          //           <span className="font-medium">Created by:</span>
          //           <span>
          //             <svg
          //               xmlns="http://www.w3.org/2000/svg"
          //               fill="none"
          //               viewBox="0 0 24 24"
          //               strokeWidth={2}
          //               stroke="currentColor"
          //               className="size-4"
          //             >
          //               <path
          //                 strokeLinecap="round"
          //                 strokeLinejoin="round"
          //                 d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          //               />
          //             </svg>
          //           </span>
          //           <span>{getName(item.createdById)}</span>
          //         </div>
          //       </div>
          //     </div>
          //     <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          //       <div className="flex space-x-4">
          //         {/* More concise date display, only showing Updated date for brevity */}
          //         {/* You can uncomment or adjust if both dates are crucial */}
          //         <span className="text-gray-600">
          //           Updated: {formatDate(item.updatedAt)}
          //         </span>
          //         <div>
          //           <span className="font-medium">Created:</span>{" "}
          //           {formatDate(item.createdAt)}
          //         </div>
          //       </div>
          //       {/* Action buttons now appear on hover, and have improved styling */}
          //       <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          //         <button
          //           onClick={() => onEdit(item)}
          //           className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
          //           title="Edit"
          //           aria-label={`Edit ${item.title}`} // Added ARIA label for accessibility
          //         >
          //           <PencilIcon />
          //         </button>
          //         {onDelete && (
          //           <button
          //             onClick={() => onDelete(item.id, activeTab)}
          //             className="p-1 text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
          //             title="Delete"
          //             aria-label={`Delete ${item.title}`} // Added ARIA label for accessibility
          //           >
          //             <TrashIcon />
          //           </button>
          //         )}

          //         {timeLogs.length > 0 && (
          //           <button
          //             //TODO
          //             onClick={() => {
          //               setShowLogs(!showLogs);
          //             }}
          //             title="View Logs"
          //             aria-label={`View logs for ${item.title}`}
          //             className="p-1 text-gray-500 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
          //           >
          //             {showLogs ? "Hide Logs" : "View Logs"}
          //           </button>
          //         )}
          //       </div>
          //     </div>

          //     {showLogs ? (
          //       <div className="mt-4 bg-gray-50 p-4 rounded-md shadow-sm">
          //         <h4 className="text-sm font-medium text-gray-900 mb-2">
          //           Logs related to <span className="italic">{item.title}</span>
          //           :
          //         </h4>
          //         <ul className="space-y-2">
          //           <TimeLogsComponent timeLogs={getItemRelatedLogs(item.id)} />
          //         </ul>
          //       </div>
          //     ) : (
          //       <></>
          //     )}
          //   </div>
          // </li>
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

import { Bug, Priority, Status, Task, TimeLog } from "@/generated/prisma";
import { TimeLogsComponent } from "./TimeLogsComponent";
import { useState } from "react";
import { format } from "date-fns";
import { deleteItem } from "@/app/actions/app";
import { useDashboardStore } from "@/app/zustand/DashboardStore";
export const ItemCard = ({
  item,
  timeLogs,
}: {
  item: Task | Bug;
  timeLogs: TimeLog[];
}) => {
  const { developers, activeTab, setEditingItem } = useDashboardStore();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div
        className="flex cursor-pointer items-start justify-between bg-white p-4 hover:bg-gray-50"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-sm ${
                item.priority === Priority.HIGH ||
                item.priority === Priority.BLOCKER
                  ? "bg-red-100 text-red-800"
                  : item.priority === Priority.MEDIUM
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-blue-800"
              }`}
            >
              {item.priority}
            </span>
          </div>

          <p className="text-sm text-gray-600 truncate mb-2">
            {item.description || "No description"}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-1 ${
                  item.status === Status.FIXED || item.status === Status.CLOSED
                    ? "bg-green-500"
                    : item.status === Status.ARCHIVED
                    ? "bg-gray-500"
                    : "bg-blue-500"
                }`}
              ></span>
              {item.status}
            </div>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {developers.find((d) => d.id === item.assignedToId)?.name ||
                "Unassigned"}
            </div>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-xs font-medium px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingItem(item);
            }}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
            aria-label="Edit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <DeleteButton itemId={item.id} activeTab={activeTab} setIsExpanded={setIsExpanded} />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-medium text-gray-500">Created</p>
                <p className="text-gray-700">
                  {format(new Date(item.createdAt), "MMM dd, h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Updated</p>
                <p className="text-gray-700">
                  {format(new Date(item.updatedAt), "MMM dd, h:mm a")}
                </p>
              </div>
            </div>
          </div>

          {/* Time logs section */}
          {timeLogs.length > 0 ? (
            <div>
              <TimeLogsComponent timeLogs={timeLogs} />
            </div>
          ) : (
            <p className="text-sm text-gray-500">No time logs recorded</p>
          )}
        </div>
      )}
    </div>
  );
};

const DeleteButton = ({
  itemId,
  activeTab,
  setIsExpanded,
}: {
  itemId: number;
  activeTab: "tasks" | "bugs";
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteItem(itemId, activeTab);
    setIsDeleting(false);
    setIsConfirmOpen(false);
  };
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(false)
          setIsConfirmOpen(true);
        }}
        className="text-red-500 hover:text-red-700 transition-colors p-1"
        aria-label="Delete"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-xs w-full shadow-xl">
            <div className="mb-3 text-sm font-medium">
              Delete this {activeTab.slice(0, -1)}?
            </div>
            <div className="flex justify-end gap-2 text-sm">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-3 py-1 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

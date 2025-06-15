import { useDashboardStore } from "@/app/zustand/DashboardStore";
import { Status, Priority, User } from "@/generated/prisma/";

export default function FilterBar() {
  const {
    activeTab,
    filterStatus,
    filterPriority,
    filterUser,
    setActiveTab,
    setFilterStatus,
    setFilterPriority,
    setFilterUser,
    developers,
    user,
    dateSortOrder,
    setDateSortOrder,
  } = useDashboardStore();

  return (
    <div className="border-b border-gray-200 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap sm:gap-4">
      <div className="flex flex-col sm:flex-row flex-wrap sm:space-x-2">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`sm:px-4 sm:py-2 p-1 font-medium text-sm rounded-md ${
            activeTab === "tasks"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveTab("bugs")}
          className={`sm:px-4 sm:py-2 p-1 font-medium text-sm rounded-md ${
            activeTab === "bugs"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Bugs
        </button>
      </div>

      <div className="flex flex-wrap space-x-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Status | "ALL")}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-indigo-500"
        >
          <option value="ALL">All Statuses</option>
          {Object.values(Status).map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={filterPriority}
          onChange={(e) =>
            setFilterPriority(e.target.value as Priority | "ALL")
          }
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-indigo-500"
        >
          <option value="ALL">All Priorities</option>
          {Object.values(Priority).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <button
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Sort by Date"
          type="button"
          onClick={() =>
            setDateSortOrder(dateSortOrder === "asc" ? "desc" : "asc")
          }
        >
          <span>
            Sort by Date {dateSortOrder === "asc" ? "↑" : "↓"}
          </span>
        </button>
        {user && user.role === "MANAGER" && (
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value as string | "ALL")}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Users</option>
            {/* Assuming you have a list of users to map through */}
            {developers.map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
        {/* button to sort by date ascending/descening */}
      </div>
    </div>
  );
}

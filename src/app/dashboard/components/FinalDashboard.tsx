"use client";
import { Bug, Task, TimeLog, User } from "@/generated/prisma";
import { useEffect } from "react";
import { Welcome } from "./Welcome";
import { Stats } from "./Stats";
import ItemsList from "./ItemList";
import FilterBar from "./FilterBar";
import { EditModal } from "./Modals";
import { useDashboardStore } from "@/app/zustand/DashboardStore";

type DashboardProps = {
  tasks: Task[];
  bugs: Bug[];
  timeLogs: TimeLog[];
  developers: User[];
  user: User;
};

const FinalDashboard = ({
  tasks,
  bugs,
  user,
  developers,
  timeLogs,
}: DashboardProps) => {
  const initialize = useDashboardStore((state) => state.initialize);
  useEffect(() => {
    initialize(user, developers);
  }, [user, developers, initialize]);

  const { activeTab, filterStatus, filterPriority, filterUser } =
    useDashboardStore();
  const displayedItems = activeTab === "tasks" ? tasks : bugs;

  const filteredItems = displayedItems.filter(
    (item) =>
      (filterStatus === "ALL" || item.status === filterStatus) &&
      (filterPriority === "ALL" || item.priority === filterPriority) &&
      (filterUser === "ALL" || item.assignedToId === Number(filterUser))
  );

  return (
    <div className="mx-18 min-h-screen px-6 py-8 space-y-8 bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Welcome />
      <Stats tasks={tasks} bugs={bugs} />

      <div className="flex sm:flex-grow justify-center mb-4 mx-auto">
        <div className="w-full space-y-4 p-4 bg-white rounded-lg border border-gray-200 shadow">
          <FilterBar />
          <div className="overflow-y-auto max-h-96">
            <ItemsList items={filteredItems} timeLogs={timeLogs} />
          </div>
          <EditModal />
        </div>
      </div>
    </div>
  );
};

export default FinalDashboard;

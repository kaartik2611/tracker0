import { useState } from "react";
import { CreateDeveloperModal, CreateItemModal } from "./Modals";
import { DocumentPlusIcon, UserPlusIcon } from "@/app/ui/Icons";
import { useDashboardStore } from "@/app/zustand/DashboardStore";

export const Welcome = () => {
  const [createItemModalOpen, setCreateItemModalOpen] = useState(false);
  const [createDeveloperModalOpen, setCreateDeveloperModalOpen] =
    useState(false);
  const { user } = useDashboardStore();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Welcome back,{user?.name} 👋
        </h1>
        <p className="text-sm text-gray-500">
          {user?.role === "MANAGER" ? "Team Manager" : "Developer"} Dashboard
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setCreateItemModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <DocumentPlusIcon className="h-4 w-4" />
          New Item
        </button>

        {user?.role === "MANAGER" && (
          <button
            onClick={() => setCreateDeveloperModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <UserPlusIcon className="h-4 w-4" />
            Add Developer
          </button>
        )}
      </div>
      <>
        {createItemModalOpen && (
          <CreateItemModal onClose={() => setCreateItemModalOpen(false)} />
        )}

        {createDeveloperModalOpen && (
          <CreateDeveloperModal
            onClose={() => setCreateDeveloperModalOpen(false)}
          />
        )}
      </>
    </div>
  );
};

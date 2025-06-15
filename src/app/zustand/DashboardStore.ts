import { create } from "zustand";
import { Bug, Priority, Status, Task, User } from "@/generated/prisma";

type DashboardStore = {
  activeTab: "tasks" | "bugs";
  filterStatus: string | "ALL";
  filterPriority: string | "ALL";
  filterUser: string | "ALL";
  item: Task | Bug | null;
  user: User | null;
  developers: User[];
  dateSortOrder: "asc" | "desc";

  setActiveTab: (tab: "tasks" | "bugs") => void;
  setFilterStatus: (status: Status | "ALL") => void;
  setFilterPriority: (priority: Priority | "ALL") => void;
  setFilterUser: (userId: string | "ALL") => void;
  setEditingItem: (item: Task | Bug | null) => void;
  initialize: (user: User, developers: User[]) => void;
  setDateSortOrder: (order: "asc" | "desc") => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeTab: "tasks",
  filterStatus: "ALL",
  filterPriority: "ALL",
  filterUser: "ALL",
  item: null,
  user: null,
  developers: [],
  dateSortOrder: "asc",
  setDateSortOrder: (order) => set({ dateSortOrder: order }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setFilterUser: (userId) => set({ filterUser: userId }),
  setEditingItem: (item) => set({ item: item }),
  initialize: (user, developers) => set({ user, developers }),
}));

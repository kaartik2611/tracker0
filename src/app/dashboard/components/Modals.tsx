import { createDeveloper, createItem, updateItem } from "@/app/actions/app";
import { useActionState, useEffect, useState } from "react";
import { Priority, Status } from "@/generated/prisma";
import { useDashboardStore } from "@/app/zustand/DashboardStore";

interface CreateItemModalProps {
  onClose: () => void;
}
type StatusCheck = {
  [key in Status]: Status[];
};

const StatusTransitions: StatusCheck = {
  [Status.OPEN]: [Status.OPEN, Status.FIXED, Status.CLOSED],
  [Status.FIXED]: [Status.REOPENED, Status.ARCHIVED],
  [Status.CLOSED]: [Status.REOPENED],
  [Status.ARCHIVED]: [Status.REOPENED],
  [Status.REOPENED]: [Status.FIXED, Status.CLOSED],
  [Status.PENDING_APPROVAL]: [Status.PENDING_APPROVAL],
};

export function CreateItemModal({ onClose }: CreateItemModalProps) {
  const [type, setType] = useState<"task" | "bug">("task");
  const [state, formAction] = useActionState(createItem, {
    success: false,
    message: "",
  });
  const { user, developers } = useDashboardStore();

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose, type]);

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-[32rem] max-h-[80vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium text-gray-900">Create New</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 text-sm"
            >
              ✕
            </button>
          </div>

          <form action={formAction} className="space-y-3">
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="createdById" value={user?.id} />

            <div className="flex space-x-2 mb-2">
              <button
                type="button"
                onClick={() => setType("task")}
                className={`px-3 py-1 rounded text-sm ${
                  type === "task"
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Task
              </button>
              <button
                type="button"
                onClick={() => setType("bug")}
                className={`px-3 py-1 rounded text-sm ${
                  type === "bug"
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Bug
              </button>
            </div>

            <div className="space-y-2">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Title*
                </label>
                <input
                  name="title"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Description*
                </label>
                <textarea
                  name="description"
                  rows={2}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Priority*
                  </label>
                  <select
                    name="priority"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    defaultValue={Priority.LOW}
                  >
                    {Object.keys(Priority).map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Assign To*
                  </label>
                  <select
                    name="assignedToId"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    defaultValue={user?.id}
                  >
                    {developers
                      .filter((d) =>
                        user?.role === "MANAGER" ? d.id !== user?.id : true
                      )
                      .map((dev) => (
                        <option key={dev.id} value={dev.id}>
                          {dev.name} {dev.id === user?.id ? "(Me)" : ""}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Status*
                  </label>
                  <select
                    name="status"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    defaultValue={Status.OPEN}
                  >
                    {[Status.OPEN].map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Time (minutes)*
                  </label>
                  <input
                    name="minutes"
                    type="number"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Comments
                </label>
                <textarea
                  name="comments"
                  rows={1}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {state?.message && (
                <div
                  className={`p-2 text-xs rounded ${
                    state.success
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {state.message}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:ring-1 focus:ring-indigo-500"
                >
                  Create {type === "task" ? "Task" : "Bug"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function CreateDeveloperModal({ onClose }: { onClose: () => void }) {
  const [state, formAction] = useActionState(createDeveloper, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      onClose();
    }
    if (state.error) {
      alert(state.error);
    }
  }, [state, onClose]);
  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-[32rem]">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium text-gray-900">
              Create Developer
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 text-sm"
            >
              ✕
            </button>
          </div>

          <form action={formAction} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mt-4">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Developer Name"
              required
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 mt-2"
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Developer Email"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 mt-2"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Generated Password
            </label>
            <input
              type="text"
              name="password"
              value={"Password123"}
              className="w-full px-2 py-1 text-sm border border-gray-900 rounded focus:ring-1 focus:ring-grey-500 mt-2"
              readOnly
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:ring-1 focus:ring-indigo-500"
              >
                Add Dev
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function EditModal() {
  const [state, formAction, isPending] = useActionState(updateItem, {
    success: false,
  });
  const { setEditingItem, item, user, developers, activeTab } =
    useDashboardStore();

  useEffect(() => {
    if (state?.success) {
      setEditingItem(null);
    }
    if (state?.error) {
      alert(state.error);
    }
  }, [state, setEditingItem]);

  const allowedStatuses = StatusTransitions[item?.status as Status] || [];
  return (
    item && (
      <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-[32rem] max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold capitalize text-gray-900">
                Edit {activeTab.slice(0, -1)}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-500 text-sm"
                disabled={isPending}
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="space-y-2">
              <input type="hidden" name="itemId" value={item.id} />
              <input name="title" type="hidden" value={item.title} />
              <input type="hidden" name="itemType" value={activeTab} />
              <input type="hidden" name="userId" value={user?.id} />

              <div className="space-y-1 p-2 bg-gray-50 rounded text-sm">
                <div>
                  <span className="text-xs font-medium text-gray-500">
                    Title:
                  </span>
                  <p className="text-gray-900">{item.title}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">
                    Description:
                  </span>
                  <p className="text-gray-900">{item.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Priority*
                  </label>
                  <select
                    name="priority"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    disabled={isPending}
                    defaultValue={item.priority}
                  >
                    {Object.values(Priority).map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Assign To*
                  </label>
                  <select
                    name="assignedToId"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    disabled={isPending}
                    defaultValue={item.assignedToId}
                  >
                    {developers.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.name} {dev.id === user?.id ? "(Me)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Status*
                  </label>
                  <select
                    name="status"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    disabled={isPending}
                    defaultValue={item.status}
                  >
                    {allowedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Time (minutes)*
                  </label>
                  <input
                    name="minutes"
                    type="number"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Timelog Comments
                </label>
                <textarea
                  name="comments"
                  rows={1}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                  disabled={isPending}
                />
              </div>

              {state?.message && (
                <div
                  className={`p-2 text-xs rounded ${
                    state.success
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {state.message}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:ring-1 focus:ring-indigo-500"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

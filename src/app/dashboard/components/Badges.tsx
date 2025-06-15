import { Priority, Status } from "@/generated/prisma";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const colorMap = {
    LOW: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    BLOCKER: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1.5 rounded text-xs font-semibold ${colorMap[priority]}`}
    >
      {priority}
    </span>
  );
}


export function StatusBadge({ status }: { status: Status }) {
  const colorMap: Record<Status, string> = {
    OPEN: "bg-blue-100 text-blue-800",
    FIXED: "bg-green-100 text-green-800",
    PENDING_APPROVAL: "bg-purple-100 text-purple-800",
    CLOSED: "bg-gray-100 text-gray-800",
    ARCHIVED: "bg-red-100 text-red-800",
    REOPENED: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1.5 rounded text-xs font-semibold ${colorMap[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}


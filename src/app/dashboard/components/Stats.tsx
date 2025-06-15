import { useDashboardStore } from "@/app/zustand/DashboardStore";
import { Bug, Status, Task } from "@/generated/prisma";
import { subDays, format } from "date-fns";
import { useMemo, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
export const Stats = ({ tasks, bugs }: { tasks: Task[]; bugs: Bug[] }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="w-full md:w-3/4">
        <GraphCardComponent
          title="Task & Bug Trend"
          tasks={tasks}
          bugs={bugs}
        />
      </div>
      <div className="w-full md:w-1/4">
        <PieChartComponent
          title={"Task and Bug Status"}
          bugs={bugs}
          tasks={tasks}
        />
      </div>
    </div>
  );
};

function PieChartComponent({
  bugs,
  tasks,
  title,
}: {
  bugs: Bug[];
  tasks: Task[];
  title: string;
}) {
  const {user} = useDashboardStore();
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#F43F5E"];

  console.log("Tasks:", tasks);

  const statusData = [
    {
      name: "Closed",
      value:
        tasks.filter(
          (t) => t.status === Status.FIXED || t.status === Status.CLOSED
        ).length +
        bugs.filter(
          (b) => b.status === Status.FIXED || b.status === Status.CLOSED
        ).length,
    },
    {
      name: "Open",
      value:
        tasks.filter((t) => t.status === "OPEN" || t.status === "REOPENED")
          .length +
        bugs.filter((b) => b.status === "OPEN" || b.status === "REOPENED")
          .length,
    },
    {
      name: "Pending Approval",
      value:
        tasks.filter((t) => t.status === Status.PENDING_APPROVAL).length +
        bugs.filter((b) => b.status === Status.PENDING_APPROVAL).length,
    },
  ];

  if (user?.role !== "MANAGER") {
    statusData.pop()
  }

  const total = statusData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-white flex flex-col items-center w-full p-4 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold text-indigo-600 mb-2 ">{title}</h2>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart title={title}>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            isAnimationActive={true}
          >
            {statusData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="w-full mt-4 mb-2 space-y-2 text-sm">
        {statusData.map((entry, index) => {
          const percent = total ? ((entry.value / total) * 100).toFixed(1) : 0;
          return (
            <div
              key={entry.name}
              className="flex items-center justify-between px-2"
            >
              <div className="flex items-center space-x-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}</span>
              </div>
              <span className="text-gray-600">
                {entry.value} ({percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GraphCardComponent({
  title,
  tasks,
  bugs,
}: {
  title: string;
  tasks: Task[];
  bugs: Bug[];
}) {
  const [days, setDays] = useState<7 | 10 | 30>(7);

  const chartData = useMemo(() => {
    const today = new Date();
    return [...Array(days)].map((_, i) => {
      const date = subDays(today, days - i - 1);
      const dayKey = format(date, "yyyy-MM-dd");

      const taskCount = tasks.filter(
        (t) => format(new Date(t.createdAt), "yyyy-MM-dd") === dayKey
      ).length;

      const bugCount = bugs.filter(
        (b) => format(new Date(b.createdAt), "yyyy-MM-dd") === dayKey
      ).length;

      return {
        date: format(date, "EEE"), // Short weekday name
        tasks: taskCount,
        bugs: bugCount,
      };
    });
  }, [days, tasks, bugs]);

  return (
    <div className="rounded-xl p-6 bg-white border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col space-y-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-indigo-600">{title}</h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value) as 7 | 10 | 30)}
          className="border border-gray-300 text-sm px-3 py-1 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option value={7}>Last 7 Days</option>
          <option value={10}>Last 10 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderRadius: "0.5rem" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="tasks"
            name="Tasks"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="bugs"
            name="Bugs"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

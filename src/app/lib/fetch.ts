"use server";
import { User } from "@/generated/prisma";
import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";
import { startOfWeek } from "date-fns";

export const getUserTasks = unstable_cache(
  async (user: User) => {
    const isManager = user.role === "MANAGER";
    const whereClause = isManager
      ? {}
      : {
          assignedToId: parseInt(user.id.toString()),
        };
    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignedTo: true,
        createdBy: true,
      },
    });

    console.log("Tasks fetched for user:", user.id, tasks.length);

    return tasks;
  },
  ["dashboard-tasks"],
  {
    tags: ["tasks"],
    revalidate: 60,
  }
);

export const getUserBugs = unstable_cache(
  async (user: User) => {
    const isManager = user.role === "MANAGER";
    const whereClause = isManager
      ? {}
      : {
          assignedToId: parseInt(user.id.toString()),
        };
    const bugs = await prisma.bug.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignedTo: true,
        createdBy: true,
      },
    });

    console.log("Bugs fetched for user:", user.id, bugs.length);

    return bugs;
  },
  ["dashboard-bugs"],
  {
    tags: ["bugs"],
    revalidate: 60,
  }
);

export const getUserTimeLogs = unstable_cache(
  async (user: User) => {
    const isManager = user.role === "MANAGER";
    const whereClause = isManager
      ? {}
      : {
          userId: parseInt(user.id.toString()),
        };
    const timeLogs = await prisma.timeLog.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "asc",
      },
      include: {
        user: true,
        task: true,
        bug: true,
      },
    });

    return timeLogs;
  },
  ["dashboard-time-logs"],
  {
    tags: ["timelogs"],
    revalidate: 60,
  }
);

export const getDevelopers = unstable_cache(
  async () => {
    const developers = await prisma.user.findMany({
      where: {
        role: "DEVELOPER",
      },
      orderBy: {
        name: "asc",
      },
    });

    return developers;
  },
  ["dashboard-developers"],
  {
    tags: ["developers"],
    revalidate: 60,
  }
);

export const getTimeLogs = unstable_cache(
  async (user: User) => {
    if (user.role === "MANAGER") {
      return await prisma.timeLog.findMany({
        where: {
          date: {
            gte: startOfWeek(new Date()), // Only show current week's logs
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    } else {
      return await prisma.timeLog.findMany({
        where: {
          userId: user.id,
          date: {
            gte: startOfWeek(new Date()), // Only show current week's logs
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    }
  },
  ["user-timelogs"],
  {
    tags: ["timelogs"],
    revalidate: 60,
  }
);

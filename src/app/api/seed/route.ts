import { User } from "@/generated/prisma";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  async function clearData() {
    await prisma.bug.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.timeLog.deleteMany({});
    await prisma.user.deleteMany({});
    // await prisma.user.deleteMany({});
    console.log("Data cleared successfully");
  }
  await clearData();

  // return Response.json({
  //   message: "Database cleared successfully",
  // });

  async function seedData() {
    const users: User[] = [
      {
        id: 1,
        name: "Kaartik Nayak",
        email: "kaartiknayak@x.com",
        password: "password123",
        role: "DEVELOPER",
      },
      {
        id: 10,
        name: "Thor Odinson",
        email: "x@x.com",
        password: "password123",
        role: "DEVELOPER",
      },
      {
        id: 2,
        name: "Tony Stark",
        email: "tonystart@x.com",
        password: "password123",
        role: "DEVELOPER",
      },
      {
        id: 3,
        name: "The Rock",
        email: "therock@x.com",
        password: "password123",
        role: "DEVELOPER",
      },
      {
        id: 4,
        name: "Bruce Wayne",
        email: "brucewayne@x.com",
        password: "password123",
        role: "DEVELOPER",
      },
      {
        id: 5,
        name: "Steve Rogers",
        email: "steverogers@x.com",
        password: "manager123",
        role: "MANAGER",
      },
    ];

    await prisma.user.createMany({
      data: users,
      skipDuplicates: true, // Skip duplicates if they already exist
    });
    console.log("Users seeded successfully");
    return;

    const tasks = [
      {
        title: "Build login UI",
        description: "Create login form for app",
        assignedToId: 2,
        createdById: 1,
        priority: "MEDIUM",
      },
      {
        title: "Fix navbar overlap",
        description: "UI bug in mobile view",
        assignedToId: 3,
        createdById: 1,
        priority: "HIGH",
      },
      {
        title: "Setup Prisma schema",
        description: "Define models for DB",
        assignedToId: 1,
        createdById: 1,
        priority: "BLOCKER",
      },
      {
        title: "Write tests",
        description: "Jest tests for dashboard",
        assignedToId: 10,
        createdById: 3,
        priority: "LOW",
      },
      {
        title: "Color theme revamp",
        description: "Update Tailwind config",
        assignedToId: 4,
        createdById: 2,
        priority: "MEDIUM",
      },
      {
        title: "Protect API routes",
        description: "Auth middleware",
        assignedToId: 2,
        createdById: 3,
        priority: "HIGH",
      },
      {
        title: "Sort/filter UI",
        description: "Dropdown filters",
        assignedToId: 1,
        createdById: 2,
        priority: "LOW",
      },
      {
        title: "Fix layout shift",
        description: "Dashboard jitter",
        assignedToId: 3,
        createdById: 4,
        priority: "HIGH",
      },
      {
        title: "Create seed script",
        description: "Initial data",
        assignedToId: 1,
        createdById: 1,
        priority: "LOW",
      },
      {
        title: "Implement logout",
        description: "Clear session",
        assignedToId: 2,
        createdById: 3,
        priority: "MEDIUM",
      },
      {
        title: "Pagination on tasks",
        description: "Infinite scroll",
        assignedToId: 10,
        createdById: 2,
        priority: "HIGH",
      },
      {
        title: "Assign task logic",
        description: "Reassignment support",
        assignedToId: 3,
        createdById: 1,
        priority: "BLOCKER",
      },
      {
        title: "Time tracker UI",
        description: "Time entry modal",
        assignedToId: 4,
        createdById: 4,
        priority: "MEDIUM",
      },
      {
        title: "Role-based tabs",
        description: "Hide buttons",
        assignedToId: 2,
        createdById: 3,
        priority: "HIGH",
      },
      {
        title: "Bug report form",
        description: "Frontend page",
        assignedToId: 1,
        createdById: 1,
        priority: "LOW",
      },
    ];

    const bugs = [
      {
        title: "Login fails on reload",
        description: "Session not persisting",
        assignedToId: 2,
        createdById: 1,
        priority: "BLOCKER",
        status: "OPEN",
      },
      {
        title: "Blank screen on mobile",
        description: "Responsive issue",
        assignedToId: 3,
        createdById: 2,
        priority: "HIGH",
        status: "OPEN",
      },
      {
        title: "Tasks not saving",
        description: "POST /tasks 500",
        assignedToId: 1,
        createdById: 1,
        priority: "BLOCKER",
      },
      {
        title: "Wrong user in session",
        description: "Session context mismatch",
        assignedToId: 10,
        createdById: 2,
        priority: "MEDIUM",
      },
      {
        title: "No error message on fail",
        description: "Missing toast",
        assignedToId: 4,
        createdById: 3,
        priority: "LOW",
      },
      {
        title: "Bug can't be closed",
        description: "PATCH /bug/id/status fails",
        assignedToId: 1,
        createdById: 2,
        priority: "HIGH",
      },
      {
        title: "Assign bug dropdown empty",
        description: "Devs not loaded",
        assignedToId: 3,
        createdById: 3,
        priority: "MEDIUM",
      },
      {
        title: "TimeLog shows wrong time",
        description: "Summation error",
        assignedToId: 4,
        createdById: 4,
        priority: "BLOCKER",
      },
      {
        title: "Crash on deleting bug",
        description: "Cascade failure",
        assignedToId: 2,
        createdById: 1,
        priority: "BLOCKER",
      },
      {
        title: "Manager can't see bug",
        description: "Auth condition",
        assignedToId: 1,
        createdById: 3,
        priority: "HIGH",
      },
      {
        title: "Form field not resetting",
        description: "useForm dirty",
        assignedToId: 10,
        createdById: 2,
        priority: "LOW",
      },
      {
        title: "404 on refresh",
        description: "Client route mismatch",
        assignedToId: 1,
        createdById: 3,
        priority: "HIGH",
      },
      {
        title: "CORS error",
        description: "API route headers missing",
        assignedToId: 2,
        createdById: 1,
        priority: "BLOCKER",
      },
      {
        title: "Deleted bug still visible",
        description: "State not cleared",
        assignedToId: 3,
        createdById: 2,
        priority: "HIGH",
      },
      {
        title: "Timelog not showing",
        description: "Component load delay",
        assignedToId: 4,
        createdById: 3,
        priority: "MEDIUM",
      },
    ];

    const timelogs = [
      { taskId: 6, userId: 1, minutes: 30, date: "2025-06-14T03:44:48Z" },
      { taskId: 4, userId: 2, minutes: 15, date: "2025-06-09T03:44:48Z" },
      { taskId: 3, userId: 2, minutes: 15, date: "2025-06-13T03:44:48Z" },
      { taskId: 6, userId: 1, minutes: 15, date: "2025-06-14T03:44:48Z" },
      { taskId: 10, userId: 1, minutes: 15, date: "2025-06-14T03:44:48Z" },
      { taskId: 4, userId: 3, minutes: 30, date: "2025-06-08T03:44:48Z" },
      { taskId: 8, userId: 2, minutes: 30, date: "2025-06-13T03:44:48Z" },
      { taskId: 6, userId: 3, minutes: 15, date: "2025-06-14T03:44:48Z" },
      { taskId: 1, userId: 1, minutes: 60, date: "2025-06-09T03:44:48Z" },
      { taskId: 3, userId: 2, minutes: 30, date: "2025-06-08T03:44:48Z" },

      { bugId: 10, userId: 3, minutes: 20, date: "2025-06-14T03:44:48Z" },
      { bugId: 1, userId: 2, minutes: 20, date: "2025-06-08T03:44:48Z" },
      { bugId: 1, userId: 3, minutes: 60, date: "2025-06-10T03:44:48Z" },
      { bugId: 5, userId: 1, minutes: 10, date: "2025-06-13T03:44:48Z" },
      { bugId: 1, userId: 3, minutes: 20, date: "2025-06-11T03:44:48Z" },
      { bugId: 7, userId: 2, minutes: 40, date: "2025-06-09T03:44:48Z" },
      { bugId: 7, userId: 2, minutes: 10, date: "2025-06-14T03:44:48Z" },
      { bugId: 6, userId: 2, minutes: 60, date: "2025-06-11T03:44:48Z" },
      { bugId: 2, userId: 1, minutes: 80, date: "2025-06-10T03:44:48Z" },
      { bugId: 10, userId: 1, minutes: 100, date: "2025-06-13T03:44:48Z" },
    ];

    const existingTaskIds = (
      await prisma.task.findMany({ select: { id: true } })
    ).map((t) => t.id);
    const existingBugIds = (
      await prisma.bug.findMany({ select: { id: true } })
    ).map((b) => b.id);

    const validTimeLogs = timelogs.filter((log) => {
      return (
        (!log.taskId || existingTaskIds.includes(log.taskId)) &&
        (!log.bugId || existingBugIds.includes(log.bugId))
      );
    });

    await prisma.timeLog.createMany({ data: validTimeLogs });

    // await prisma.timeLog.createMany({
    //   data: timelogs,
    //   skipDuplicates: true,
    // });
    console.log("Timelogs seeded successfully");
  }
  await seedData();
  return new Response("Data seeded successfully");
}

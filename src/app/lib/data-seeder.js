import { prisma } from "./";
// import { Bug, Task,TimeLog } from "@/generated/prisma";

export async function seedData() {
    
    // add tasks
    const tasks = [{
        id: 1,
        title: "Task 1",
        description: "Description for Task 1",
        assignedToId: 1,
        priority:"MEDIUM",
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        title: "Task 2",
        description: "Description for Task 2",
        assignedToId: 2,
        priority:"HIGH",
        status: "IN_PROGRESS",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 3,
        title: "Task 3",
        description: "Description for Task 3",
        assignedToId: 3,
        priority:"LOW",
        status: "CLOSED",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 4,
        title: "Task 4",
        description: "Description for Task 4",
        assignedToId: 1,
        priority:"MEDIUM",
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 5,
        title: "Task 5",
        description: "Description for Task 5",
        assignedToId: 2,
        priority:"HIGH",
        status: "IN_PROGRESS",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    
];

    await prisma.task.createMany({
        data: tasks,
        skipDuplicates: true, // Skip duplicates if they already exist
    });
    console.log("Tasks seeded successfully");


    const bugs= [{
        id: 1,
        title: "Bug 1",
        description: "Description for Bug 1",
        assignedToId: 1,
        priority: "HIGH",
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        title: "Bug 2",
        description: "Description for Bug 2",
        assignedToId: 2,
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 3,
        title: "Bug 3",
        description: "Description for Bug 3",
        assignedToId: 3,
        priority: "LOW",
        status: "CLOSED",
        createdAt: new Date(),
        updatedAt: new Date(),
    },{
        id: 4,
        title: "Bug 4",
        description: "Description for Bug 4",
        assignedToId: 1,
        priority: "HIGH",
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 5,
        title: "Bug 5",
        description: "Description for Bug 5",
        assignedToId: 2,
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        createdAt: new Date(),
        updatedAt: new Date(),
    }]

    await prisma.bug.createMany({
        data: bugs,
        skipDuplicates: true,
    });
    console.log("Bugs seeded successfully");

    // add timelogs

    
    // model TimeLog {
        //     id      Int      @id @default(autoincrement())
        //     taskId  Int?
        //     bugId   Int?
        //     user    User     @relation(fields: [userId], references: [id])
        //     userId  Int
        //     minutes Int
        //     date    DateTime @default(now())
        
        //     task Task? @relation(fields: [taskId], references: [id])
        //     bug  Bug?  @relation(fields: [bugId], references: [id])
        //   }
        // keep taskId or bugId null alternativley, from added bugs and tasks
        const timeLogs = [{
            id: 1,
            taskId: 1,
            bugId: null,
            userId: 1,
            minutes: 30,
            date: new Date("2023-10-01T10:00:00Z"),
        
        },
    {
            id: 2,
            taskId: null,
            bugId: 1,
            userId: 2,
            minutes: 45,
            date: new Date("2023-10-01T11:00:00Z"),
        
        },
        {
            id: 3,
            taskId: 2,
            bugId: null,
            userId: 3,
            minutes: 60,
            date: new Date("2023-10-01T12:00:00Z"),
        
        },
        {
            id: 4,
            taskId: null,
            bugId: 2,
            userId: 1,
            minutes: 20,
            date: new Date("2023-10-01T13:00:00Z"),
        
        },
        {
            id: 5,
            taskId: 3,
            bugId: null,
            userId: 2,
            minutes: 90,
            date: new Date("2023-10-01T14:00:00Z"),
        },
        {
            id: 6,
            taskId: null,
            bugId: 3,
            userId: 3,
            minutes: 15,
            date: new Date("2023-10-01T15:00:00Z"),
        },
        {
            id: 7,
            taskId: 4,
            bugId: null,
            userId: 1,
            minutes: 25,
            date: new Date("2023-10-01T16:00:00Z"),
        },
        {
            id: 8,
            taskId: null,
            bugId: 4,
            userId: 2,
            minutes: 35,
            date: new Date("2023-10-01T17:00:00Z"),
        },
        {
            id: 9,
            taskId: 5,
            bugId: null,
            userId: 3,
            minutes: 50,
            date: new Date("2023-10-01T18:00:00Z"),
        },
        {
            id: 10,
            taskId: null,
            bugId: 5,
            userId: 1,
            minutes: 40,
            date: new Date("2023-10-01T19:00:00Z"),
        }
    ]

    await prisma.timeLog.createMany({
        data: timeLogs,
        skipDuplicates: true,
    });
    console.log("Time logs seeded successfully");
};
seedData();
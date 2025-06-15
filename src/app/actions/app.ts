"use server";

import { revalidateTag } from "next/cache";
import { Status, Role, Priority } from "@/generated/prisma";
import { prisma } from "../lib/prisma";
import { verifySession } from "../lib/session";

type ItemType = "task" | "bug";

// interface ItemInput {
//   type: ItemType;
//   title: string;
//   description: string;
//   priority: "LOW" | "MEDIUM" | "HIGH" | "BLOCKER";
//   status: "OPEN" | "IN_PROGRESS" | "FIXED" | "PENDING_APPROVAL" | "CLOSED";
//   assignedToId: number;
//   minutesSpent: number;
//   comment?: string;
// }
// interface UpdateInput {
//   type: ItemType;
//   id: number;
//   description: string;
//   priority: "LOW" | "MEDIUM" | "HIGH" | "BLOCKER";
//   status: "OPEN" | "IN_PROGRESS" | "FIXED" | "PENDING_APPROVAL" | "CLOSED";
//   assignedToId: number;
//   minutesSpent: number;
//   comment?: string;
// }

type ActionResult = {
  success: boolean;
  error?: boolean;
  message?: string;
};

export async function createDeveloper(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { user } = await verifySession();
  if (!user) return { error: true, success: false, message: "Unauthorized" };
  if (user.role !== "MANAGER") {
    return {
      error: true,
      success: false,
      message: "Only managers can create developers.",
    };
  }
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role: Role = "DEVELOPER";
  const password = formData.get("password") as string;

  console.log(name, email, role, password);

  try {
    const newDev = await prisma.user.create({
      data: {
        id: Number(Math.random() * 1000000), // Generate a random ID for simplicity, replace with proper ID generation in production
        name,
        email,
        role,
        password, // Ensure password is hashed before storing in production
      },
    });

    console.log("New developer created:", newDev);

    revalidateTag("developers");

    return {
      success: true,
      message: `Developer ${newDev.name} created successfully.`,
    };
  } catch (error) {
    return {
      error: true,
      success: false,
      message:
        "Failed to create developer. : " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
}

export async function createItem(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { user } = await verifySession();
  if (!user) return { error: true, success: false, message: "Unauthorized" };

  console.log(formData);

  // FormData {
  //   type: 'bug',
  //   title: 'bug number 1',
  //   description: 'finally lets go',
  //   priority: 'LOW',
  //   status: 'IN_PROGRESS',
  //   assignedToId: '1',
  //   timeLogMinutes: '120',
  //   timeLogComments: 'timelog comment for bug number 1'
  // }

  // Extract form data

  const data = {
    type: formData.get("type") as ItemType,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    priority: formData.get("priority") as Priority,
    status: formData.get("status") as Status,
    assignedToId: Number(formData.get("assignedToId")),
    minutesSpent: Number(formData.get("minutes")),
    userComment: formData.get("comments") as string,
  };

  if (user.role === "MANAGER" && data.assignedToId === user.id) {
    return {
      error: true,
      success: false,
      message: "Manager cannot assign tasks to themselves.",
    };
  }
  const createdById = Number(user.id);
  const isAssignedToSelf = createdById === data.assignedToId;

  if (data.type == "task") {
    try {
      console.log("Creating task with data:");
      const task = await prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          createdBy: { connect: { id: createdById } },
          assignedTo: { connect: { id: data.assignedToId } },
        },
      });

      console.log("Task created:", task);

      // Create initial time log for task creation
      const comment =
        data.userComment ||
        `Created Task #${task.id}: '${data.title}' (${
          data.priority
        } priority). Assigned to ${
          isAssignedToSelf ? "self" : `Dev ID ${data.assignedToId}`
        }.`;

      await prisma.timeLog.create({
        data: {
          taskId: task.id,
          userId: createdById,
          minutes: data.minutesSpent,
          comments: comment,
        },
      });
      console.log("Time log created for task:", task.id);

      revalidateTag("timelogs");
      revalidateTag("tasks");
      // revalidatePath("/dashboard");

      return {
        success: true,
        message: `Task #${task.id} created successfully.`,
      };
    } catch (error) {
      return {
        error: true,
        success: false,
        message:
          "Failed to create task. : " +
          (error instanceof Error ? error.message : String(error)),
      };
    }
  } else {
    try {
      console.log("Creating bug with data:");
      const bug = await prisma.bug.create({
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          createdBy: { connect: { id: createdById } },
          assignedTo: { connect: { id: data.assignedToId } },
        },
      });

      console.log("Bug created:", bug);

      // Create initial time log for bug creation
      const comment =
        data.userComment?.trim() ||
        `Created Bug #${bug.id}: '${data.title}' (${
          data.priority
        } priority). Assigned to ${
          isAssignedToSelf ? "self" : `Dev ID ${data.assignedToId}`
        }.`;

      await prisma.timeLog.create({
        data: {
          bugId: bug.id,
          userId: createdById,
          minutes: data.minutesSpent,
          comments: comment,
        },
      });
      console.log("Time log created for bug:", bug.id);

      revalidateTag("timelogs");
      revalidateTag("bugs");
      // revalidatePath("/dashboard");
      return {
        success: true,
        message: `Bug #${bug.id} created successfully.`,
      };
    } catch (error) {
      return {
        error: true,
        success: false,
        message:
          "Failed to create bug. : " +
          (error instanceof Error ? error.message : String(error)),
      };
    }
  }
}

export async function updateItem(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { user } = await verifySession();
  if (!user) return { error: true, success: false, message: "Unauthorized" };

  const data = {
    title: formData.get("title") as string,
    type: formData.get("itemType") as "tasks" | "bugs",
    itemId: Number(formData.get("itemId")),
    priority: formData.get("priority") as Priority,
    status: formData.get("status") as Status,
    assignedToId: Number(formData.get("assignedToId")),
    minutesSpent: Number(formData.get("minutes")),
    comment: (formData.get("comments") as string) || "", // Ensure comment is a string
  };

  if (user.role === "DEVELOPER" && data.status === "FIXED") {
    data.status = "PENDING_APPROVAL";
  }

  console.log("Updating item with data:", data);

  try {
    if (data.type === "tasks") {
      const task = await prisma.task.findUnique({ where: { id: data.itemId } });
      if (!task) {
        return {
          error: true,
          success: false,
          message: "Task not found.",
        };
      }

      await prisma.task.update({
        where: { id: data.itemId },
        data: {
          title: data.title,
          priority: data.priority,
          status: data.status,
          assignedTo: { connect: { id: data.assignedToId } },
        },
      });

      await prisma.timeLog.create({
        data: {
          taskId: data.itemId,
          userId: user.id,
          minutes: data.minutesSpent,
          comments: data.comment,
        },
      });

      revalidateTag("tasks");
      revalidateTag("timelogs");

      return {
        success: true,
        message: `Task #${data.itemId} updated successfully.`,
      };
    } else {
      const bug = await prisma.bug.findUnique({ where: { id: data.itemId } });
      if (!bug) {
        return {
          error: true,
          success: false,
          message: "Bug not found.",
        };
      }

      await prisma.bug.update({
        where: { id: data.itemId },
        data: {
          title: data.title,
          priority: data.priority,
          status: data.status,
          assignedTo: { connect: { id: data.assignedToId } },
        },
      });

      await prisma.timeLog.create({
        data: {
          bugId: data.itemId,
          userId: user.id,
          minutes: data.minutesSpent,
          comments: data.comment,
        },
      });

      revalidateTag("bugs");
      revalidateTag("timelogs");

      return {
        success: true,
        message: `Bug #${data.itemId} updated successfully.`,
      };
    }
  } catch (error) {
    return {
      error: true,
      success: false,
      message:
        "Failed to update item. : " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
}

export const deleteItem = async (id: number, activeTab: "tasks" | "bugs") => {
  try {
    if (activeTab === "tasks") {
      await prisma.task
        .delete({
          where: {
            id,
          },
        })
        .catch(async (error) => {
          return {
            success: false,
            message:
              "Failed to delete task. " +
              (error instanceof Error ? error.message : String(error)),
          };
        });
    } else {
      await prisma.bug
        .delete({
          where: {
            id,
          },
        })
        .catch(async (error) => {
          return {
            success: false,
            message:
              "Failed to delete bug. " +
              (error instanceof Error ? error.message : String(error)),
          };
        });
    }
    revalidateTag(activeTab);
    return {
      success: true,
      message: `${activeTab.slice(0, -1)} deleted successfully.`,
    };
  } catch (error) {
    console.error("Error deleting item:", error);
    return {
      success: false,
      message:
        "Failed to delete item. " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
};

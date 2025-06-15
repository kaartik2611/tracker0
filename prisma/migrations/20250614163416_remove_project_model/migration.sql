/*
  Warnings:

  - You are about to drop the column `projectId` on the `Bug` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bug" DROP CONSTRAINT "Bug_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- AlterTable
ALTER TABLE "Bug" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "projectId";

-- DropTable
DROP TABLE "Project";

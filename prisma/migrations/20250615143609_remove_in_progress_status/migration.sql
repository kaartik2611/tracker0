/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('OPEN', 'FIXED', 'PENDING_APPROVAL', 'CLOSED', 'ARCHIVED', 'REOPENED');
ALTER TABLE "Bug" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "Bug" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Bug" ALTER COLUMN "status" SET DEFAULT 'OPEN';
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

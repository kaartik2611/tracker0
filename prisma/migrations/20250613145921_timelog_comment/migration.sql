-- AlterTable
ALTER TABLE "TimeLog" ADD COLUMN     "comments" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

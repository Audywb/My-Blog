/*
  Warnings:

  - You are about to drop the `BlogImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlogImage" DROP CONSTRAINT "BlogImage_blogId_fkey";

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';

-- DropTable
DROP TABLE "BlogImage";

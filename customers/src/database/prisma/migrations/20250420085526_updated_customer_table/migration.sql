/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUid]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Register" AS ENUM ('GOOGLE', 'EMAIL', 'GITHUB');

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "firebaseUid" TEXT,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "registeredWith" "Register" NOT NULL DEFAULT 'EMAIL',
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_firebaseUid_key" ON "Auth"("firebaseUid");

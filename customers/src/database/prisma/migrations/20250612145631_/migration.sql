/*
  Warnings:

  - You are about to drop the column `city` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "postalCode",
DROP COLUMN "state",
DROP COLUMN "street";

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "authId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "amount" INTEGER,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "authId" TEXT,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "thumbnailImage" TEXT,
    "price" INTEGER,
    "authId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_id_key" ON "Address"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Address_authId_key" ON "Address"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_authId_key" ON "Orders"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_authId_key" ON "Product"("authId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

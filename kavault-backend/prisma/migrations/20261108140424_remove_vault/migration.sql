/*
  Warnings:

  - You are about to drop the `VaultItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VaultItem" DROP CONSTRAINT "VaultItem_userId_fkey";

-- DropTable
DROP TABLE "VaultItem";

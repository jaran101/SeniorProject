/*
  Warnings:

  - You are about to drop the column `Order_Id` on the `chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `chats` DROP FOREIGN KEY `chats_Order_Id_fkey`;

-- DropIndex
DROP INDEX `chats_Order_Id_fkey` ON `chats`;

-- AlterTable
ALTER TABLE `chats` DROP COLUMN `Order_Id`;

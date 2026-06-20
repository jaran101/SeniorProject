/*
  Warnings:

  - Added the required column `Room_Id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chats` ADD COLUMN `Room_Id` VARCHAR(191) NOT NULL;

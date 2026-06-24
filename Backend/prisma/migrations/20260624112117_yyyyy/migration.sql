/*
  Warnings:

  - You are about to drop the column `Is_Read` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chats` DROP COLUMN `Is_Read`,
    ADD COLUMN `Work_Date_End` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `Work_Date_End` DATETIME(3) NULL;

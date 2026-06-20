/*
  Warnings:

  - You are about to alter the column `Status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `chats` ADD COLUMN `Work_Date` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `Final_Price` DOUBLE NULL,
    ADD COLUMN `Work_Date` DATETIME(3) NULL,
    MODIFY `Status` ENUM('ACCEPTED', 'IN_PROGRESS', 'WAITING_CONFIRM', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACCEPTED';

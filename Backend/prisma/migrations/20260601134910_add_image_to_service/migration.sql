/*
  Warnings:

  - You are about to alter the column `Status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `chats` ADD COLUMN `Is_Read` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `orders` MODIFY `Status` ENUM('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

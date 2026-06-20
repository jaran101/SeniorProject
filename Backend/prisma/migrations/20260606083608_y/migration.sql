/*
  Warnings:

  - Added the required column `Service_Id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chats` ADD COLUMN `Service_Id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` MODIFY `Status` ENUM('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_Service_Id_fkey` FOREIGN KEY (`Service_Id`) REFERENCES `services`(`Service_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

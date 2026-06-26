/*
  Warnings:

  - You are about to drop the `ordermap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ordermap` DROP FOREIGN KEY `ordermap_Order_Id_fkey`;

-- DropForeignKey
ALTER TABLE `ordermap` DROP FOREIGN KEY `ordermap_Users_Id_fkey`;

-- DropTable
DROP TABLE `ordermap`;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

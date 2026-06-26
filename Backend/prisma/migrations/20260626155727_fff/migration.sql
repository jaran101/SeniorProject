-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_Users_Id_fkey`;

-- DropIndex
DROP INDEX `orders_Users_Id_fkey` ON `orders`;

-- CreateTable
CREATE TABLE `ordermap` (
    `Users_Id` INTEGER NOT NULL,
    `Order_Id` INTEGER NOT NULL,

    PRIMARY KEY (`Users_Id`, `Order_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ordermap` ADD CONSTRAINT `ordermap_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordermap` ADD CONSTRAINT `ordermap_Order_Id_fkey` FOREIGN KEY (`Order_Id`) REFERENCES `orders`(`Order_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `profiles` MODIFY `Address` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `technicians` (
    `Technician_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Users_Id` INTEGER NOT NULL,
    `Bio` VARCHAR(191) NULL,
    `Experience_Year` INTEGER NOT NULL DEFAULT 0,
    `Rating` DOUBLE NOT NULL DEFAULT 0,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    UNIQUE INDEX `technicians_Users_Id_key`(`Users_Id`),
    PRIMARY KEY (`Technician_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `Service_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Technician_Id` INTEGER NOT NULL,
    `Title` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NULL,
    `Price` DOUBLE NOT NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Service_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `Order_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Users_Id` INTEGER NOT NULL,
    `Service_Id` INTEGER NOT NULL,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Order_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `Review_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Order_Id` INTEGER NOT NULL,
    `Rating` INTEGER NOT NULL,
    `Comment` VARCHAR(191) NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `reviews_Order_Id_key`(`Order_Id`),
    PRIMARY KEY (`Review_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chats` (
    `Chat_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Sender_Id` INTEGER NOT NULL,
    `Receiver_Id` INTEGER NOT NULL,
    `Message` VARCHAR(191) NOT NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`Chat_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `technicians` ADD CONSTRAINT `technicians_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_Technician_Id_fkey` FOREIGN KEY (`Technician_Id`) REFERENCES `technicians`(`Technician_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_Service_Id_fkey` FOREIGN KEY (`Service_Id`) REFERENCES `services`(`Service_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_Order_Id_fkey` FOREIGN KEY (`Order_Id`) REFERENCES `orders`(`Order_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `service_areas` (
    `Area_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Users_Id` INTEGER NOT NULL,
    `Province` VARCHAR(191) NOT NULL,
    `District` VARCHAR(191) NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`Area_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_areas` ADD CONSTRAINT `service_areas_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

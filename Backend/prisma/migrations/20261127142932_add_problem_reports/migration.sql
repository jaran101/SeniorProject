-- CreateTable
CREATE TABLE `reports` (
    `Report_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Users_Id` INTEGER NOT NULL,
    `Title` VARCHAR(191) NOT NULL,
    `Description` TEXT NOT NULL,
    `Status` ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
    `Admin_Reply` TEXT NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Report_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

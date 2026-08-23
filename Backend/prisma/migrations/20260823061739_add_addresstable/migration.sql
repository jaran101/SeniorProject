/*
  Warnings:

  - You are about to drop the column `Address` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profiles` DROP COLUMN `Address`;

-- CreateTable
CREATE TABLE `addresses` (
    `Address_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Users_Id` INTEGER NOT NULL,
    `Address` VARCHAR(191) NULL,
    `Province` VARCHAR(191) NULL,
    `District` VARCHAR(191) NULL,
    `Subdistrict` VARCHAR(191) NULL,
    `Postal_Code` VARCHAR(191) NULL,
    `Latitude` DOUBLE NOT NULL,
    `Longitude` DOUBLE NOT NULL,
    `Is_Default` BOOLEAN NOT NULL DEFAULT false,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Address_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

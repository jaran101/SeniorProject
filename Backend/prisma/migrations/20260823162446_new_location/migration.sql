-- CreateTable
CREATE TABLE `provinces` (
    `Province_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    UNIQUE INDEX `provinces_Name_key`(`Name`),
    PRIMARY KEY (`Province_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `districts` (
    `District_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Province_Id` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    PRIMARY KEY (`District_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subdistricts` (
    `Subdistrict_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `District_Id` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `Postal_Code` VARCHAR(191) NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Subdistrict_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_Province_Id_fkey` FOREIGN KEY (`Province_Id`) REFERENCES `provinces`(`Province_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subdistricts` ADD CONSTRAINT `subdistricts_District_Id_fkey` FOREIGN KEY (`District_Id`) REFERENCES `districts`(`District_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

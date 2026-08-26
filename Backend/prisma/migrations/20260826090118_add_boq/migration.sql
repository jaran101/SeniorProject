-- CreateTable
CREATE TABLE `boqs` (
    `BOQ_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Order_Id` INTEGER NOT NULL,
    `Total_Amount` DOUBLE NOT NULL DEFAULT 0,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    UNIQUE INDEX `boqs_Order_Id_key`(`Order_Id`),
    PRIMARY KEY (`BOQ_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boq_items` (
    `BOQ_Item_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `BOQ_Id` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NULL,
    `Quantity` DOUBLE NOT NULL,
    `Unit` VARCHAR(191) NOT NULL,
    `Unit_Price` DOUBLE NOT NULL,
    `Total_Price` DOUBLE NOT NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    PRIMARY KEY (`BOQ_Item_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `boqs` ADD CONSTRAINT `boqs_Order_Id_fkey` FOREIGN KEY (`Order_Id`) REFERENCES `orders`(`Order_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boq_items` ADD CONSTRAINT `boq_items_BOQ_Id_fkey` FOREIGN KEY (`BOQ_Id`) REFERENCES `boqs`(`BOQ_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

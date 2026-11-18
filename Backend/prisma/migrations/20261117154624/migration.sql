-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `PromptPay_Id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `payments` (
    `Payment_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Order_Id` INTEGER NOT NULL,
    `Amount` DOUBLE NOT NULL,
    `Slip_Image` VARCHAR(191) NULL,
    `Status` ENUM('PENDING', 'WAITING_CONFIRMATION', 'PAID', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `Reject_Reason` VARCHAR(191) NULL,
    `Paid_At` DATETIME(3) NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payments_Order_Id_key`(`Order_Id`),
    PRIMARY KEY (`Payment_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_Order_Id_fkey` FOREIGN KEY (`Order_Id`) REFERENCES `orders`(`Order_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

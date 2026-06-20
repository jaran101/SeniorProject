/*
  Warnings:

  - You are about to drop the column `Technician_Id` on the `services` table. All the data in the column will be lost.
  - You are about to drop the `technicians` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Users_Id` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `services_Technician_Id_fkey`;

-- DropForeignKey
ALTER TABLE `technicians` DROP FOREIGN KEY `technicians_Users_Id_fkey`;

-- DropIndex
DROP INDEX `services_Technician_Id_fkey` ON `services`;

-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `Bio` VARCHAR(191) NULL,
    ADD COLUMN `Experience_Year` INTEGER NULL;

-- AlterTable
ALTER TABLE `services` DROP COLUMN `Technician_Id`,
    ADD COLUMN `Users_Id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `technicians`;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_login_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `pass_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `replies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `threads` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[Email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Updated_At` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Users_Id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `profile_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `replies` DROP FOREIGN KEY `replies_ibfk_1`;

-- DropForeignKey
ALTER TABLE `replies` DROP FOREIGN KEY `replies_ibfk_2`;

-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `report_thread_id_fkey`;

-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `report_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `threads` DROP FOREIGN KEY `threads_ibfk_1`;

-- DropForeignKey
ALTER TABLE `threads` DROP FOREIGN KEY `threads_ibfk_2`;

-- DropIndex
DROP INDEX `email` ON `users`;

-- DropIndex
DROP INDEX `username` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `created_at`,
    DROP COLUMN `email`,
    DROP COLUMN `last_login_at`,
    DROP COLUMN `pass_hash`,
    DROP COLUMN `role`,
    DROP COLUMN `user_id`,
    DROP COLUMN `username`,
    ADD COLUMN `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `Email` VARCHAR(191) NOT NULL,
    ADD COLUMN `Password` VARCHAR(191) NOT NULL,
    ADD COLUMN `Role` ENUM('USER', 'TECHNICIAN', 'ADMIN') NOT NULL,
    ADD COLUMN `Status` ENUM('ACTIVE', 'INACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `Updated_At` DATETIME(3) NOT NULL,
    ADD COLUMN `Users_Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`Users_Id`);

-- DropTable
DROP TABLE `category`;

-- DropTable
DROP TABLE `profile`;

-- DropTable
DROP TABLE `replies`;

-- DropTable
DROP TABLE `report`;

-- DropTable
DROP TABLE `threads`;

-- CreateTable
CREATE TABLE `profiles` (
    `Profile_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Users_Id` INTEGER NOT NULL,
    `First_Name` VARCHAR(191) NULL,
    `Last_Name` VARCHAR(191) NULL,
    `Phone` VARCHAR(191) NULL,
    `Avatar` VARCHAR(191) NULL,
    `Gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    `Birth_Date` DATETIME(3) NULL,
    `Address` TEXT NULL,
    `Created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_At` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profiles_Users_Id_key`(`Users_Id`),
    PRIMARY KEY (`Profile_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_Email_key` ON `users`(`Email`);

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

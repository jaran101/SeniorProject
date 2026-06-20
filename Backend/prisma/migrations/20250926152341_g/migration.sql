/*
  Warnings:

  - Added the required column `cat_id` to the `threads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `threads` ADD COLUMN `cat_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Category` (
    `cat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cat_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `threads` ADD CONSTRAINT `threads_ibfk_2` FOREIGN KEY (`cat_id`) REFERENCES `Category`(`cat_id`) ON DELETE CASCADE ON UPDATE CASCADE;

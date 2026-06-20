/*
  Warnings:

  - You are about to drop the column `parent_id` on the `replies` table. All the data in the column will be lost.
  - Added the required column `link` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `replies` DROP FOREIGN KEY `replies_ibfk_3`;

-- DropIndex
DROP INDEX `parent_id` ON `replies`;

-- AlterTable
ALTER TABLE `profile` ADD COLUMN `link` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `replies` DROP COLUMN `parent_id`;

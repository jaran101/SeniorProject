/*
  Warnings:

  - You are about to drop the column `Bio` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `Experience_Year` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profiles` DROP COLUMN `Bio`,
    DROP COLUMN `Experience_Year`;

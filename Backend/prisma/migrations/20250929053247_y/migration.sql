-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `report_thread_id_fkey`;

-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `report_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `threads` DROP FOREIGN KEY `threads_ibfk_1`;

-- DropIndex
DROP INDEX `report_thread_id_fkey` ON `report`;

-- DropIndex
DROP INDEX `report_user_id_fkey` ON `report`;

-- AddForeignKey
ALTER TABLE `threads` ADD CONSTRAINT `threads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_thread_id_fkey` FOREIGN KEY (`thread_id`) REFERENCES `threads`(`thread_id`) ON DELETE CASCADE ON UPDATE CASCADE;

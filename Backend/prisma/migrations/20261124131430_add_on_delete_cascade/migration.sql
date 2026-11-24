-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_Users_Id_fkey`;

-- DropForeignKey
ALTER TABLE `boq_items` DROP FOREIGN KEY `boq_items_BOQ_Id_fkey`;

-- DropForeignKey
ALTER TABLE `boqs` DROP FOREIGN KEY `boqs_Order_Id_fkey`;

-- DropForeignKey
ALTER TABLE `chats` DROP FOREIGN KEY `chats_Service_Id_fkey`;

-- DropForeignKey
ALTER TABLE `districts` DROP FOREIGN KEY `districts_Province_Id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_Service_Id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_Tech_Id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_Users_Id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_Order_Id_fkey`;

-- DropForeignKey
ALTER TABLE `profiles` DROP FOREIGN KEY `profiles_Users_Id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_Order_Id_fkey`;

-- DropForeignKey
ALTER TABLE `service_areas` DROP FOREIGN KEY `service_areas_Users_Id_fkey`;

-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `services_Users_Id_fkey`;

-- DropForeignKey
ALTER TABLE `subdistricts` DROP FOREIGN KEY `subdistricts_District_Id_fkey`;

-- DropIndex
DROP INDEX `addresses_Users_Id_fkey` ON `addresses`;

-- DropIndex
DROP INDEX `boq_items_BOQ_Id_fkey` ON `boq_items`;

-- DropIndex
DROP INDEX `chats_Service_Id_fkey` ON `chats`;

-- DropIndex
DROP INDEX `districts_Province_Id_fkey` ON `districts`;

-- DropIndex
DROP INDEX `orders_Service_Id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `orders_Tech_Id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `orders_Users_Id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `service_areas_Users_Id_fkey` ON `service_areas`;

-- DropIndex
DROP INDEX `services_Users_Id_fkey` ON `services`;

-- DropIndex
DROP INDEX `subdistricts_District_Id_fkey` ON `subdistricts`;

-- AddForeignKey
ALTER TABLE `service_areas` ADD CONSTRAINT `service_areas_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_Users_Id_fkey` FOREIGN KEY (`Users_Id`) REFERENCES `users`(`Users_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_Tech_Id_fkey` FOREIGN KEY (`Tech_Id`) REFERENCES `users`(`Users_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_Service_Id_fkey` FOREIGN KEY (`Service_Id`) REFERENCES `services`(`Service_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_Order_Id_fkey` FOREIGN KEY (`Order_Id`) REFERENCES `orders`(`Order_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boqs` ADD CONSTRAINT `boqs_Order_Id_fkey` FOREIGN KEY (`Order_Id`) REFERENCES `orders`(`Order_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boq_items` ADD CONSTRAINT `boq_items_BOQ_Id_fkey` FOREIGN KEY (`BOQ_Id`) REFERENCES `boqs`(`BOQ_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_Order_Id_fkey` FOREIGN KEY (`Order_Id`) REFERENCES `orders`(`Order_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_Service_Id_fkey` FOREIGN KEY (`Service_Id`) REFERENCES `services`(`Service_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_Province_Id_fkey` FOREIGN KEY (`Province_Id`) REFERENCES `provinces`(`Province_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subdistricts` ADD CONSTRAINT `subdistricts_District_Id_fkey` FOREIGN KEY (`District_Id`) REFERENCES `districts`(`District_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

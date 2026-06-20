-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_Order_Id_fkey` FOREIGN KEY (`Order_Id`) REFERENCES `orders`(`Order_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `paymentMethod` VARCHAR(191) NULL DEFAULT 'CREDIT_CARD',
    ADD COLUMN `shippingAddress` TEXT NULL;

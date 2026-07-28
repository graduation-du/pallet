-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('administrator', 'manufacturing', 'warehouse_loader', 'dispatcher', 'delivery_receiver', 'return_collector', 'factory_receiver', 'manager') NOT NULL DEFAULT 'delivery_receiver',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pallets` (
    `id` VARCHAR(191) NOT NULL,
    `pallet_number` VARCHAR(32) NOT NULL,
    `qr_code` VARCHAR(64) NOT NULL,
    `status` ENUM('available', 'loaded', 'in_transit', 'delivered', 'returning', 'damaged', 'under_repair', 'retired', 'lost') NOT NULL DEFAULT 'available',
    `manufacture_date` DATE NOT NULL,
    `material_type` VARCHAR(60) NOT NULL,
    `dimensions` VARCHAR(60) NOT NULL,
    `weight_capacity` DECIMAL(10, 2) NOT NULL,
    `cost` DECIMAL(12, 3) NOT NULL,
    `notes` TEXT NULL,
    `trip_count` INTEGER NOT NULL DEFAULT 0,
    `printed_at` DATETIME(3) NULL,
    `current_user_id` VARCHAR(191) NULL,
    `current_location` VARCHAR(120) NULL,
    `return_due_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pallets_pallet_number_key`(`pallet_number`),
    UNIQUE INDEX `pallets_qr_code_key`(`qr_code`),
    INDEX `pallets_status_idx`(`status`),
    INDEX `pallets_current_user_id_idx`(`current_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movements` (
    `id` VARCHAR(191) NOT NULL,
    `pallet_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `action` ENUM('register', 'load', 'dispatch', 'deliver', 'return_pickup', 'receive_factory', 'mark_damaged', 'begin_repair', 'complete_repair', 'retire', 'mark_lost', 'admin_override') NOT NULL,
    `from_status` ENUM('available', 'loaded', 'in_transit', 'delivered', 'returning', 'damaged', 'under_repair', 'retired', 'lost') NULL,
    `to_status` ENUM('available', 'loaded', 'in_transit', 'delivered', 'returning', 'damaged', 'under_repair', 'retired', 'lost') NULL,
    `payload` JSON NULL,
    `note` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `movements_pallet_id_created_at_idx`(`pallet_id`, `created_at`),
    INDEX `movements_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `damage_records` (
    `id` VARCHAR(191) NOT NULL,
    `pallet_id` VARCHAR(191) NOT NULL,
    `reported_by_id` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `photoUrls` JSON NULL,
    `resolved` BOOLEAN NOT NULL DEFAULT false,
    `resolved_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `damage_records_pallet_id_idx`(`pallet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `type` ENUM('overdue_return', 'damaged_pallet', 'delivery_delayed', 'dwell_time_exceeded', 'new_batch_manufactured', 'inventory_below_threshold', 'system') NOT NULL DEFAULT 'system',
    `title` VARCHAR(120) NOT NULL,
    `message` TEXT NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `link` VARCHAR(120) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_user_id_read_idx`(`user_id`, `read`),
    INDEX `notifications_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `user_email` VARCHAR(190) NULL,
    `action` VARCHAR(80) NOT NULL,
    `entity` VARCHAR(80) NULL,
    `entity_id` VARCHAR(80) NULL,
    `detail` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_created_at_idx`(`created_at`),
    INDEX `audit_logs_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pallets` ADD CONSTRAINT `pallets_current_user_id_fkey` FOREIGN KEY (`current_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movements` ADD CONSTRAINT `movements_pallet_id_fkey` FOREIGN KEY (`pallet_id`) REFERENCES `pallets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movements` ADD CONSTRAINT `movements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `damage_records` ADD CONSTRAINT `damage_records_pallet_id_fkey` FOREIGN KEY (`pallet_id`) REFERENCES `pallets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `damage_records` ADD CONSTRAINT `damage_records_reported_by_id_fkey` FOREIGN KEY (`reported_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

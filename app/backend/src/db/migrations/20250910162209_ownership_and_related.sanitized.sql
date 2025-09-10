-- Ownership types
CREATE TABLE IF NOT EXISTS `ownership_types` (
	`id` uuid PRIMARY KEY NOT NULL,
	`name` varchar(255) NOT NULL,
	`active` tinyint(1) NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_ownership_types_name` ON `ownership_types`(`name`);

-- Extend vehicles
ALTER TABLE `vehicles` ADD COLUMN `ownership_type_id` varchar(255);
ALTER TABLE `vehicles` ADD COLUMN `owner_name` varchar(255);

-- Vehicle plates (history)
CREATE TABLE IF NOT EXISTS `vehicle_plates` (
	`id` uuid PRIMARY KEY NOT NULL,
	`vehicle_id` uuid NOT NULL,
	`plate` varchar(255) NOT NULL,
	`issued_date` date,
	`retired_date` date,
	`reason` varchar(255),
	`is_current` tinyint(1) NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_vehicle_plates_unique` ON `vehicle_plates`(`vehicle_id`,`plate`);
CREATE INDEX IF NOT EXISTS `idx_vehicle_plates_current` ON `vehicle_plates`(`vehicle_id`,`is_current`);

-- Vehicle assignments (resguardo)
CREATE TABLE IF NOT EXISTS `vehicle_assignments` (
	`id` uuid PRIMARY KEY NOT NULL,
	`vehicle_id` uuid NOT NULL,
	`assignee_name` varchar(255),
	`assignee_role` varchar(255),
	`area` varchar(255),
	`unit` varchar(255),
	`start_date` date NOT NULL,
	`end_date` date,
	`is_current` tinyint(1) NOT NULL DEFAULT 0,
	`notes` varchar(255),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `idx_vehicle_assignments_vehicle` ON `vehicle_assignments`(`vehicle_id`,`is_current`);

-- Insurance policies + mapping
CREATE TABLE IF NOT EXISTS `insurance_policies` (
	`id` uuid PRIMARY KEY NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`policy_number` varchar(255) NOT NULL,
	`coverage_type` varchar(255),
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`cost` float,
	`notes` varchar(255),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_insurance_policies_key` ON `insurance_policies`(`provider`,`policy_number`);
CREATE TABLE IF NOT EXISTS `insurance_policy_vehicles` (
	`policy_id` uuid NOT NULL,
	`vehicle_id` uuid NOT NULL,
	PRIMARY KEY (`policy_id`,`vehicle_id`),
	FOREIGN KEY (`policy_id`) REFERENCES `insurance_policies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `idx_policy_vehicles_vehicle` ON `insurance_policy_vehicles`(`vehicle_id`);

-- Vehicle taxes (tenencias)
CREATE TABLE IF NOT EXISTS `vehicle_taxes` (
	`id` uuid PRIMARY KEY NOT NULL,
	`vehicle_id` uuid NOT NULL,
	`type` varchar(255) NOT NULL,
	`year` integer NOT NULL,
	`amount` float,
	`paid` tinyint(1) NOT NULL DEFAULT 0,
	`paid_date` date,
	`receipt_folio` varchar(255),
	`notes` varchar(255),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_vehicle_taxes_unique` ON `vehicle_taxes`(`vehicle_id`,`type`,`year`);

-- Vehicle documents (digital)
CREATE TABLE IF NOT EXISTS `vehicle_documents` (
	`id` uuid PRIMARY KEY NOT NULL,
	`vehicle_id` uuid NOT NULL,
	`doc_type` varchar(255) NOT NULL,
	`issue_date` date,
	`expiry_date` date,
	`file_path` varchar(255) NOT NULL,
	`file_hash` varchar(255),
	`notes` varchar(255),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `idx_vehicle_documents_vehicle` ON `vehicle_documents`(`vehicle_id`,`doc_type`);

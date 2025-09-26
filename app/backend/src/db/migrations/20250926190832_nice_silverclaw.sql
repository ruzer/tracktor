CREATE TABLE `auth` (
	`id` integer PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `configs` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fuel_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`date` text NOT NULL,
	`odometer` integer NOT NULL,
	`fuel_amount` real NOT NULL,
	`cost` real NOT NULL,
	`filled` integer NOT NULL,
	`missed_last` integer NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `insurance_policy_renewals` (
	`id` text PRIMARY KEY NOT NULL,
	`policy_id` text NOT NULL,
	`previous_end_date` text NOT NULL,
	`new_start_date` text NOT NULL,
	`new_end_date` text NOT NULL,
	`notes` text,
	`performed_by` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`policy_id`) REFERENCES `insurance_policies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `insurance_policies` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`insurer` text NOT NULL,
	`policy_number` text NOT NULL,
	`coverage_type` text,
	`notes` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`representative_id` text,
	`created_by` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`representative_id`) REFERENCES `insurance_representatives`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `insurance_representatives` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`email` text,
	`insurer` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `insurances` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`provider` text NOT NULL,
	`policy_number` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`cost` real NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`file_url` text NOT NULL,
	`amount` real,
	`issued_at` text,
	`provider` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `maintenance_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`date` text NOT NULL,
	`odometer` integer NOT NULL,
	`service_center` text NOT NULL,
	`cost` real NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ownership_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ownership_types_name_unique` ON `ownership_types` (`name`);--> statement-breakpoint
CREATE TABLE `pollution_certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`certificate_number` text NOT NULL,
	`issue_date` text NOT NULL,
	`expiry_date` text NOT NULL,
	`testing_center` text NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `service_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`description` text NOT NULL,
	`provider` text,
	`estimated_cost` real,
	`final_cost` real,
	`invoice_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `vehicle_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`assignee_name` text,
	`assignee_role` text,
	`area` text,
	`unit` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_current` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vehicle_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`doc_type` text NOT NULL,
	`issue_date` text,
	`expiry_date` text,
	`file_path` text NOT NULL,
	`file_hash` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vehicle_insurance` (
	`id` text PRIMARY KEY NOT NULL,
	`policy_id` text NOT NULL,
	`vehicle_id` text NOT NULL,
	`assigned_at` text NOT NULL,
	`unassigned_at` text,
	`is_current` integer DEFAULT true NOT NULL,
	`premium_amount` real,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`policy_id`) REFERENCES `insurance_policies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `vehicle_insurance_vehicle_current_idx` ON `vehicle_insurance` (`vehicle_id`,`is_current`);--> statement-breakpoint
CREATE INDEX `vehicle_insurance_policy_current_idx` ON `vehicle_insurance` (`policy_id`,`is_current`);--> statement-breakpoint
CREATE TABLE `vehicle_maintenance` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`title` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`service_order_id` text,
	`invoice_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_order_id`) REFERENCES `service_orders`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `vehicle_plates` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`plate` text NOT NULL,
	`issued_date` text,
	`retired_date` text,
	`reason` text,
	`is_current` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` text PRIMARY KEY NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`year` integer NOT NULL,
	`license_plate` text NOT NULL,
	`vin` text,
	`vin_number` text,
	`engine_number` text,
	`color` text,
	`odometer` integer,
	`tank_size_liters` integer,
	`status` text DEFAULT 'active',
	`ownership_type_id` text,
	`owner_name` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vehicle_taxes` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`type` text NOT NULL,
	`year` integer NOT NULL,
	`amount` real,
	`paid` integer DEFAULT false NOT NULL,
	`paid_date` text,
	`receipt_folio` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);

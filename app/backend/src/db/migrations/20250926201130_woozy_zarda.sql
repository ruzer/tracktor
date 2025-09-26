CREATE TABLE `maintenance_order_history` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`user_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `maintenance_orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `maintenance_order_history_order_idx` ON `maintenance_order_history` (`order_id`);--> statement-breakpoint
CREATE TABLE `maintenance_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`reported_issue` text NOT NULL,
	`status` text DEFAULT 'pending_review' NOT NULL,
	`workshop_id` text,
	`quote_file` text,
	`invoice_file` text,
	`authorized_by` text,
	`authorized_at` text,
	`total_estimated` real,
	`total_final` real,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workshop_id`) REFERENCES `workshops`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `maintenance_order_vehicle_status_idx` ON `maintenance_orders` (`vehicle_id`,`status`);--> statement-breakpoint
CREATE TABLE `workshops` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_name` text,
	`contact_phone` text,
	`contact_email` text,
	`address` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);

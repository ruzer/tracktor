CREATE TABLE `auth` (
	`id` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `fuel_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`date` integer NOT NULL,
	`odometer` integer NOT NULL,
	`fuel_amount` real NOT NULL,
	`cost` real NOT NULL,
	`filled` integer NOT NULL,
	`missed_last` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `insurances` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`provider` text NOT NULL,
	`policy_number` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`cost` real NOT NULL,
	`notes` text,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `maintenance_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`date` integer NOT NULL,
	`odometer` integer NOT NULL,
	`service_center` text NOT NULL,
	`cost` real NOT NULL,
	`notes` text,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pollution_certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`certificate_number` text NOT NULL,
	`issue_date` integer NOT NULL,
	`expiry_date` integer NOT NULL,
	`testing_center` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` text PRIMARY KEY NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`year` integer NOT NULL,
	`license_plate` text NOT NULL,
	`vin` text,
	`color` text,
	`odometer` integer
);

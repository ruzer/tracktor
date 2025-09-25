-- Custom SQL migration file, put your code below! --

-- Create insurance_representatives table
CREATE TABLE `insurance_representatives` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`email` text,
	`insurer` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

-- Create insurance_policies table
CREATE TABLE `insurance_policies` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`insurer` text NOT NULL,
	`policyNumber` text NOT NULL,
	`coverageType` text,
	`notes` text,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`representativeId` text,
	`createdBy` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`representativeId`) REFERENCES `insurance_representatives`(`id`) ON UPDATE no action ON DELETE set null
);

-- Create insurance_policy_renewals table
CREATE TABLE `insurance_policy_renewals` (
	`id` text PRIMARY KEY NOT NULL,
	`policyId` text NOT NULL,
	`previousEndDate` text NOT NULL,
	`newStartDate` text NOT NULL,
	`newEndDate` text NOT NULL,
	`notes` text,
	`performedBy` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`policyId`) REFERENCES `insurance_policies`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Create vehicle_insurance table
CREATE TABLE `vehicle_insurance` (
	`id` text PRIMARY KEY NOT NULL,
	`policyId` text NOT NULL,
	`vehicleId` text NOT NULL,
	`assignedAt` text NOT NULL,
	`unassignedAt` text,
	`isCurrent` integer DEFAULT 1 NOT NULL,
	`premiumAmount` real,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`policyId`) REFERENCES `insurance_policies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Create indexes for vehicle_insurance
CREATE INDEX `vehicle_insurance_vehicle_current_idx` ON `vehicle_insurance` (`vehicleId`,`isCurrent`);
CREATE INDEX `vehicle_insurance_policy_current_idx` ON `vehicle_insurance` (`policyId`,`isCurrent`);

-- Create unique index for policy numbers
CREATE UNIQUE INDEX `insurance_policies_policyNumber_unique` ON `insurance_policies` (`policyNumber`);
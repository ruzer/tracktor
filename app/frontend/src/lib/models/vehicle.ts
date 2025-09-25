export interface NewVehicle {
	make: string | null;
	model: string | null;
	year: number | null;
	licensePlate: string | null;
	vin: string | null;
	color: string | null;
	odometer: number | null;
	ownerName?: string | null;
}

export interface VehicleAssignmentSnapshot {
	id: string;
	assigneeName?: string | null;
	assigneeRole?: string | null;
	area?: string | null;
	unit?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	isCurrent: boolean;
	notes?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface Vehicle {
	id: string;
	make: string;
	model: string;
	year: number;
	licensePlate: string;
	vin?: string | null;
	color?: string | null;
	odometer?: number | null;
	ownerName?: string | null;
	insuranceStatus?: string | null;
	puccStatus?: string | null;
	currentAssignment?: VehicleAssignmentSnapshot | null;
	createdAt?: string;
	updatedAt?: string;
}

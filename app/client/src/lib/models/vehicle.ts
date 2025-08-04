export interface NewVehicle {
	make: string;
	model: string;
	year: number | null;
	licensePlate: string;
	vin?: string;
	color?: string;
	odometer?: number | null;
}

export interface Vehicle extends NewVehicle {
	vehicleType: string;
	id: string;
	insuranceStatus?: string;
	puccStatus?: string;
}

export type VehicleStatus = 'active' | 'in_repair' | 'retired';

export interface NewVehicle {
	make: string | null;
	model: string | null;
	year: number | null;
	licensePlate: string | null;
	vin: string | null;
	vinNumber?: string | null;
	engineNumber?: string | null;
	color: string | null;
	odometer: number | null;
	tankSizeLiters?: number | null;
	status?: VehicleStatus;
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
	vinNumber?: string | null;
	engineNumber?: string | null;
	color?: string | null;
	odometer?: number | null;
	tankSizeLiters?: number | null;
	ownerName?: string | null;
	status?: VehicleStatus;
	insuranceStatus?: string | null;
	puccStatus?: string | null;
	currentAssignment?: VehicleAssignmentSnapshot | null;
	currentPolicy?: {
		id: string;
		insurer: string;
		policyNumber: string;
		endDate: string;
		type: string;
		assignedAt: string;
		premiumAmount?: number | null;
	} | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface VehiclePolicyAssignment {
	id: string;
	assignedAt: string;
	unassignedAt?: string | null;
	isCurrent: boolean;
	premiumAmount?: number | null;
	policy: {
		id: string;
		type: string;
		status: string;
		insurer: string;
		policyNumber: string;
		coverageType?: string | null;
		notes?: string | null;
		startDate: string;
		endDate: string;
		representativeId?: string | null;
		createdAt?: string;
		updatedAt?: string;
	};
}

export interface VehicleLegacyInsurance {
	id: string;
	provider: string;
	policyNumber: string;
	startDate: string;
	endDate: string;
	cost: number;
	notes?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface VehicleMaintenanceSummary {
	total: number;
	completed: number;
	inProgress: number;
	pending: number;
	open: number;
}

export interface VehicleMaintenanceLog {
	id: string;
	date: string;
	odometer: number;
	serviceCenter: string;
	cost: number;
	notes?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface VehicleMaintenanceWorkOrder {
	id: string;
	vehicleId: string;
	title: string;
	notes?: string | null;
	status: 'pending' | 'in_progress' | 'completed';
	serviceOrder: {
		id: string;
		description: string;
		provider?: string | null;
		estimatedCost?: number | null;
		finalCost?: number | null;
		invoiceId?: string | null;
		createdAt?: string;
		updatedAt?: string;
	} | null;
	invoice: {
		id: string;
		fileUrl: string;
		amount?: number | null;
		issuedAt?: string | null;
		provider?: string | null;
		createdAt?: string;
		updatedAt?: string;
	} | null;
	createdAt?: string;
	updatedAt?: string;
}

export type MaintenanceOrderStatus =
	| 'pending_review'
	| 'quotation'
	| 'authorized'
	| 'rejected'
	| 'in_workshop'
	| 'in_repair'
	| 'repaired_pending_payment'
	| 'closed';

export type MaintenancePaymentStatus = 'pending' | 'partial' | 'paid';

export interface MaintenanceOrderHistoryEntry {
	id: string;
	orderId: string;
	status: MaintenanceOrderStatus;
	notes?: string | null;
	userId?: string | null;
	created_at?: string;
	updated_at?: string;
}

export interface MaintenanceOrderWorkshop {
	id: string;
	name: string;
	contactName?: string | null;
	contactPhone?: string | null;
	contactEmail?: string | null;
	address?: string | null;
	notes?: string | null;
	created_at?: string;
	updated_at?: string;
}

export interface MaintenanceOrder {
	id: string;
	vehicleId: string;
	vehicle?: Pick<Vehicle, 'id' | 'licensePlate' | 'make' | 'model' | 'year'> | null;
	reportedIssue: string;
	status: MaintenanceOrderStatus;
	workshopId?: string | null;
	workshop?: MaintenanceOrderWorkshop | null;
	quoteFile?: string | null;
	invoiceFile?: string | null;
	authorizedBy?: string | null;
	authorizedAt?: string | null;
	totalEstimated?: number | null;
	totalFinal?: number | null;
	paymentStatus: MaintenancePaymentStatus;
	createdBy: string;
	created_at?: string;
	updated_at?: string;
	history: MaintenanceOrderHistoryEntry[];
}

export interface VehicleFuelSummary {
	totalLogs: number;
	lastEntry: {
		id: string;
		date: string;
	odometer: number;
		fuelAmount: number;
		cost: number;
		filled: boolean;
		missedLast: boolean;
		createdAt?: string;
	} | null;
}

export interface VehicleDocument {
	id: string;
	docType: string;
	issueDate?: string | null;
	expiryDate?: string | null;
	filePath: string;
	fileHash?: string | null;
	notes?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface VehiclePollutionCertificate {
	id: string;
	certificateNumber: string;
	issueDate: string;
	expiryDate: string;
	testingCenter: string;
	notes?: string | null;
	status: 'active' | 'expired';
	createdAt?: string;
	updatedAt?: string;
}

export interface VehicleTaxRecord {
	id: string;
	type: string;
	year: number;
	amount?: number | null;
	paid: boolean;
	paidDate?: string | null;
	receiptFolio?: string | null;
	notes?: string | null;
	createdAt?: string;
	updatedAt?: string;
}

	export interface VehicleDetail extends Vehicle {
	assignments: VehicleAssignmentSnapshot[];
	insurance: {
		currentPolicy: VehiclePolicyAssignment | null;
		policyAssignments: VehiclePolicyAssignment[];
		legacy: VehicleLegacyInsurance[];
	};
	maintenance: {
		summary: VehicleMaintenanceSummary;
		workOrders: VehicleMaintenanceWorkOrder[];
		recentLogs: VehicleMaintenanceLog[];
		orders: MaintenanceOrder[];
	};
	fuel: VehicleFuelSummary;
	documents: VehicleDocument[];
	pollutionCertificates: VehiclePollutionCertificate[];
	taxes: VehicleTaxRecord[];
}

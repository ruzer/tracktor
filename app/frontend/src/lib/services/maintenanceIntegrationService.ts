import { getApiUrl } from '$lib/utils/api';

export interface MaintenanceLogWithIntegration {
	date: string;
	odometer: number;
	serviceCenter: string;
	cost: number;
	notes?: string;
	autoGenerateOrder?: boolean;
	orderData?: {
		reportedIssue: string;
		createdBy: string;
		workshop?: {
			name: string;
			contactName?: string;
			contactPhone?: string;
			contactEmail?: string;
			address?: string;
		};
	};
}

export interface MaintenanceOrderCloseData {
	orderId: string;
	status: string;
	paymentStatus?: string;
	finalCost?: number;
	finalOdometer?: number;
	completionNotes?: string;
	autoGenerateLog?: boolean;
}

export interface IntegratedMaintenanceResult {
	log?: any;
	order?: any;
	message: string;
}

export interface MaintenanceStatistics {
	totalLogs: number;
	totalOrders: number;
	averageCost: number;
	lastMaintenanceDate?: string;
	upcomingMaintenance?: any[];
	costTrend: {
		period: string;
		amount: number;
	}[];
}

/**
 * Crear un registro de mantenimiento con integración automática
 */
export async function createMaintenanceLogWithIntegration(
	vehicleId: string,
	logData: MaintenanceLogWithIntegration
): Promise<IntegratedMaintenanceResult> {
	const response = await fetch(getApiUrl(`/api/maintenance/integrated/logs`), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			vehicleId,
			...logData
		})
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error al crear el registro de mantenimiento');
	}

	return response.json();
}

/**
 * Cerrar una orden de mantenimiento con integración automática
 */
export async function closeMaintenanceOrderWithIntegration(
	closeData: MaintenanceOrderCloseData
): Promise<IntegratedMaintenanceResult> {
	const response = await fetch(
		getApiUrl(`/api/maintenance/integrated/orders/${closeData.orderId}/close`),
		{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(closeData)
		}
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error al cerrar la orden de mantenimiento');
	}

	return response.json();
}

/**
 * Obtener el historial integrado de mantenimiento
 */
export async function getIntegratedMaintenanceHistory(vehicleId: string): Promise<any[]> {
	const response = await fetch(getApiUrl(`/api/maintenance/integrated/history/${vehicleId}`));

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error al obtener el historial de mantenimiento');
	}

	const result = await response.json();
	return result.data;
}

/**
 * Obtener estadísticas de mantenimiento integrado
 */
export async function getMaintenanceStatistics(vehicleId: string): Promise<MaintenanceStatistics> {
	const response = await fetch(getApiUrl(`/api/maintenance/integrated/statistics/${vehicleId}`));

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error al obtener las estadísticas de mantenimiento');
	}

	const result = await response.json();
	return result.data;
}
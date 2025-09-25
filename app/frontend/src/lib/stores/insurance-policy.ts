import { writable } from 'svelte/store';
import { getApiUrl } from '$lib/utils/api';

type PolicySummary = {
	id: string;
	type: 'individual' | 'collective';
	status: 'active' | 'expired' | 'cancelled';
	insurer: string;
	policyNumber: string;
	coverageType?: string;
	notes?: string;
	startDate: string;
	endDate: string;
	vehiclesCount: number;
	daysToExpire: number;
	representative?: {
		id: string;
		name: string;
		phone?: string;
		email?: string;
	};
	createdAt: string;
	updatedAt: string;
};

type PolicyVehicle = {
	vehicleId: string;
	make: string;
	model: string;
	year: number;
	licensePlate: string;
	color?: string | null;
	assignedAt: string;
	unassignedAt?: string | null;
	isCurrent: boolean;
	premiumAmount?: number | null;
};

type PolicyRenewal = {
	id: string;
	policyId: string;
	previousEndDate: string;
	newStartDate: string;
	newEndDate: string;
	notes?: string | null;
	performedBy?: string | null;
	created_at: string;
	updated_at: string;
};

type PolicyDetail = PolicySummary & {
	vehicles: PolicyVehicle[];
	renewals: PolicyRenewal[];
};

type ReportPayload = {
	vehiclesWithoutPolicy: Array<{
		id: string;
		make: string;
		model: string;
		year: number;
		licensePlate: string;
	}>;
	vehiclesWithExpiredPolicy: Array<{
		vehicleId: string;
		licensePlate: string;
		make: string;
		model: string;
		policyId: string;
		policyNumber: string;
		insurer: string;
		endDate: string;
	}>;
	upcomingExpirations: Array<{
		id: string;
		policyNumber: string;
		insurer: string;
		endDate: string;
		type: string;
	}>;
	expiredPolicies: Array<{
		id: string;
		policyNumber: string;
		insurer: string;
		endDate: string;
		type: string;
	}>;
};

type InsuranceState = {
	loading: boolean;
	error?: string;
	policies: PolicySummary[];
	selected?: PolicyDetail | null;
	reports?: ReportPayload | null;
};

async function apiRequest<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
	const pin = typeof window !== 'undefined' ? localStorage.getItem('userPin') || '' : '';
	const response = await fetch(input, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			'X-User-PIN': pin,
			...(init?.headers ?? {})
		}
	});
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || 'Server error');
	}
	return response.json();
}

const createInsuranceStore = () => {
	const { subscribe, update } = writable<InsuranceState>({
		loading: false,
		policies: [],
		selected: null,
		reports: null
	});

	async function fetchPolicies(params?: { type?: string; status?: string; search?: string }) {
		update((state) => ({ ...state, loading: true, error: undefined }));
		try {
			const qs = new URLSearchParams();
			if (params?.type) qs.set('type', params.type);
			if (params?.status) qs.set('status', params.status);
			if (params?.search) qs.set('search', params.search);
			const data = await apiRequest<PolicySummary[]>(
				getApiUrl(`/api/insurance${qs.toString() ? `?${qs.toString()}` : ''}`)
			);
			update((state) => ({ ...state, policies: data, loading: false }));
		} catch (error) {
			update((state) => ({
				...state,
				loading: false,
				error: error instanceof Error ? error.message : 'Failed to fetch policies'
			}));
		}
	}

	async function fetchPolicy(id: string) {
		update((state) => ({ ...state, loading: true, error: undefined }));
		try {
			const data = await apiRequest<PolicyDetail>(getApiUrl(`/api/insurance/${id}`));
			update((state) => ({ ...state, selected: convertPolicyDetail(data), loading: false }));
		} catch (error) {
			update((state) => ({
				...state,
				loading: false,
				error: error instanceof Error ? error.message : 'Failed to fetch policy'
			}));
		}
	}

	async function createPolicy(payload: Record<string, unknown>) {
		const data = await apiRequest<PolicyDetail>(getApiUrl('/api/insurance'), {
			method: 'POST',
			body: JSON.stringify(payload)
		});
		const converted = convertPolicyDetail(data);
		update((state) => ({
			...state,
			policies: [converted, ...state.policies],
			selected: converted
		}));
		return converted;
	}

	async function updatePolicyRequest(id: string, payload: Record<string, unknown>) {
		const data = await apiRequest<PolicyDetail>(getApiUrl(`/api/insurance/${id}`), {
			method: 'PUT',
			body: JSON.stringify(payload)
		});
		const converted = convertPolicyDetail(data);
		update((state) => ({
			...state,
			policies: state.policies.map((policy) => (policy.id === converted.id ? converted : policy)),
			selected: converted
		}));
		return converted;
	}

	async function renewPolicyRequest(id: string, payload: Record<string, unknown>) {
		const data = await apiRequest<PolicyDetail>(getApiUrl(`/api/insurance/${id}/renew`), {
			method: 'POST',
			body: JSON.stringify(payload)
		});
		const converted = convertPolicyDetail(data);
		update((state) => ({
			...state,
			policies: state.policies.map((policy) => (policy.id === converted.id ? converted : policy)),
			selected: converted
		}));
		return converted;
	}

	async function deletePolicy(id: string) {
		const pin = localStorage.getItem('userPin') || '';
		await fetch(getApiUrl(`/api/insurance/${id}`), {
			method: 'DELETE',
			headers: { 'X-User-PIN': pin }
		});
		update((state) => ({
			...state,
			policies: state.policies.filter((policy) => policy.id !== id),
			selected: state.selected?.id === id ? null : state.selected
		}));
	}

	async function assignVehicles(id: string, vehicles: Array<{ vehicleId: string; premiumAmount?: number }>) {
		await apiRequest(getApiUrl(`/api/insurance/${id}/vehicles`), {
			method: 'POST',
			body: JSON.stringify({ vehicles })
		});
		await fetchPolicy(id);
	}

	async function removeVehicle(id: string, vehicleId: string) {
		const pin = localStorage.getItem('userPin') || '';
		await fetch(getApiUrl(`/api/insurance/${id}/vehicles/${vehicleId}`), {
			method: 'DELETE',
			headers: { 'X-User-PIN': pin }
		});
		await fetchPolicy(id);
	}

	async function fetchReports(params?: { expiresWithinDays?: number }) {
		update((state) => ({ ...state, loading: true, error: undefined }));
		try {
			const qs = new URLSearchParams();
			if (params?.expiresWithinDays) {
				qs.set('expiresWithinDays', String(params.expiresWithinDays));
			}
			const data = await apiRequest<ReportPayload>(
				getApiUrl(`/api/insurance/report${qs.toString() ? `?${qs.toString()}` : ''}`)
			);
			update((state) => ({ ...state, reports: data, loading: false }));
		} catch (error) {
			update((state) => ({
				...state,
				loading: false,
				error: error instanceof Error ? error.message : 'Failed to fetch report'
			}));
		}
	}

	return {
		subscribe,
		fetchPolicies,
		fetchPolicy,
		createPolicy,
		updatePolicy: updatePolicyRequest,
		deletePolicy,
		renewPolicy: renewPolicyRequest,
		assignVehicles,
		removeVehicle,
		fetchReports
	};
};

function convertPolicyDetail(detail: PolicyDetail): PolicyDetail {
	return {
		...detail,
		vehicles: detail.vehicles.map((vehicle) => ({
			...vehicle,
			isCurrent: Boolean(vehicle.isCurrent)
		}))
	};
}

export const insurancePoliciesStore = createInsuranceStore();
export type { PolicySummary, PolicyDetail, PolicyVehicle, PolicyRenewal, ReportPayload };

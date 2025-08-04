import { env } from '$env/dynamic/public';
import type { Vehicle } from '$lib/models/vehicle';
import { simulateNetworkDelay } from '$lib/utils/dev';
import { writable } from 'svelte/store';

const createVehicleModalStore = () => {
	const { subscribe, set } = writable<{
		vehicleToEdit?: any;
		editMode: boolean;
		show: boolean;
	}>({
		vehicleToEdit: undefined,
		editMode: false,
		show: false
	});

	function show(vehicleToEdit?: any, editMode: boolean = false) {
		set({
			vehicleToEdit,
			editMode,
			show: true
		});
	}
	function hide() {
		set({
			vehicleToEdit: undefined,
			editMode: false,
			show: false
		});
	}

	return {
		subscribe,
		show,
		hide
	};
};

const createVehiclesStore = () => {
	const { subscribe, set, update } = writable<{
		loading: boolean;
		error: string;
		vehicles: Vehicle[];
		selectedVehicleId?: string;
	}>({
		loading: true,
		error: '',
		vehicles: [],
		selectedVehicleId: undefined
	});

	async function fetchVehicles() {
		let tempSelection: string | undefined = undefined;
		update((current) => {
			if (current.selectedVehicleId) {
				tempSelection = current.selectedVehicleId;
			}
			return {
				loading: true,
				error: current.error,
				vehicles: [],
				selectedVehicleId: undefined
			};
		});
		// await simulateNetworkDelay(2000); // Simulate network delay for development
		try {
			const response = await fetch(`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles`, {
				headers: {
					'X-User-PIN': localStorage.getItem('userPin') || ''
				}
			});
			if (response.ok) {
				const vehicles = await response.json();
				if (Array.isArray(vehicles)) {
					set({
						loading: false,
						error: '',
						vehicles: vehicles
					});
				} else {
					console.error('Invalid vehicles data format', vehicles);
					set({
						loading: false,
						error: 'Invalid vehicles data format.',
						vehicles: []
					});
				}
			} else {
				console.log('Failed to fetch vehicles', response);
				const data = await response.json();
				const error = data.message || 'Failed to fetch vehicles.';
				set({
					loading: false,
					error,
					vehicles: []
				});
			}
		} catch (e) {
			console.error('Failed to connect to the server.', e);
			set({
				loading: false,
				error: 'Failed to connect to the server.',
				vehicles: []
			});
		}
		update((current) => ({
			loading: current.loading,
			error: '',
			vehicles: current.vehicles,
			selectedVehicleId: tempSelection
		}));
	}

	function selectVehicle(vehicleId: string) {
		update((current) => ({
			...current,
			selectedVehicleId: vehicleId
		}));
	}

	fetchVehicles();

	return {
		subscribe,
		fetchVehicles,
		selectVehicle
	};
};

export const vehicleModelStore = createVehicleModalStore();
export const vehiclesStore = createVehiclesStore();

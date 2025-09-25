import { goto } from '$app/navigation';
import type { Vehicle } from '$lib/models/vehicle';
import { getApiUrl } from '$lib/utils/api';
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
	const { subscribe, update } = writable<{
		loading: boolean;
		error: string;
		vehicles: Vehicle[];
		selectedVehicleId?: string;
		viewMode: 'grid' | 'list';
		search: string;
	}>({
		loading: true,
		error: '',
		vehicles: [],
		selectedVehicleId: undefined,
		viewMode: 'grid',
		search: ''
	});

	async function fetchVehicles(pin: string, search?: string) {
		let tempSelection: string | undefined = undefined;
		let searchTerm = search;
		let viewMode: 'grid' | 'list' = 'grid';
		update((current) => {
			if (current.selectedVehicleId) {
				tempSelection = current.selectedVehicleId;
			}
			viewMode = current.viewMode || 'grid';
			searchTerm = searchTerm ?? current.search;
			return {
				...current,
				loading: true,
				error: current.error,
				vehicles: [],
				selectedVehicleId: undefined,
				search: searchTerm || ''
			};
		});
		// await simulateNetworkDelay(2000); // Simulate network delay for development
		try {
			const query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : '';
			const response = await fetch(getApiUrl(`/api/vehicles${query}`), {
				headers: {
					'X-User-PIN': pin || ''
				}
			});
			if (response.ok) {
				const vehicles = await response.json();
				if (Array.isArray(vehicles)) {
					update((current) => ({
						...current,
						loading: false,
						error: '',
						vehicles,
						viewMode
					}));
				} else {
					console.error('Invalid vehicles data format', vehicles);
					update((current) => ({
						...current,
						loading: false,
						error: 'Invalid vehicles data format.',
						vehicles: []
					}));
				}
			} else {
				if (response.status == 401) {
					goto('/login', { replaceState: true });
				}
				console.log('Failed to fetch vehicles', response);
				const data = await response.json();
				const error = data.message || 'Failed to fetch vehicles.';
				update((current) => ({
					...current,
					loading: false,
					error,
					vehicles: []
				}));
				return;
			}
		} catch (e) {
			console.error('Failed to connect to the server.', e);
			update((current) => ({
				...current,
				loading: false,
				error: 'Failed to connect to the server.',
				vehicles: []
			}));
			return;
		}
		update((current) => ({
			...current,
			error: '',
			selectedVehicleId: tempSelection
		}));
	}

	function selectVehicle(vehicleId: string) {
		update((current) => ({
			...current,
			selectedVehicleId: vehicleId
		}));
	}

	function setViewMode(view: 'grid' | 'list') {
		update((current) => ({
			...current,
			viewMode: view
		}));
	}

	function setSearch(searchValue: string) {
		update((current) => ({
			...current,
			search: searchValue
		}));
	}

	return {
		subscribe,
		fetchVehicles,
		selectVehicle,
		setViewMode,
		setSearch
	};
};

export const vehicleModelStore = createVehicleModalStore();
export const vehiclesStore = createVehiclesStore();

import { writable } from 'svelte/store';

// Store para el modal de log integrado
const createIntegratedLogModalStore = () => {
	const { subscribe, set } = writable<{
		vehicleId?: string;
		show: boolean;
		callback?: () => void;
	}>({
		vehicleId: undefined,
		show: false,
		callback: undefined
	});

	function show(vehicleId: string, callback?: () => void) {
		set({
			vehicleId,
			show: true,
			callback: callback || (() => {})
		});
	}

	function hide() {
		set({
			vehicleId: undefined,
			show: false,
			callback: undefined
		});
	}

	return {
		subscribe,
		show,
		hide
	};
};

// Store para el modal de cierre integrado
const createCloseOrderIntegratedModalStore = () => {
	const { subscribe, set } = writable<{
		vehicleId?: string;
		orderId?: string;
		show: boolean;
		callback?: () => void;
	}>({
		vehicleId: undefined,
		orderId: undefined,
		show: false,
		callback: undefined
	});

	function show(vehicleId: string, orderId: string, callback?: () => void) {
		set({
			vehicleId,
			orderId,
			show: true,
			callback: callback || (() => {})
		});
	}

	function hide() {
		set({
			vehicleId: undefined,
			orderId: undefined,
			show: false,
			callback: undefined
		});
	}

	return {
		subscribe,
		show,
		hide
	};
};

export const integratedLogModalStore = createIntegratedLogModalStore();
export const closeOrderIntegratedModalStore = createCloseOrderIntegratedModalStore();
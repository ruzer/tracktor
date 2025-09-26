import { writable } from 'svelte/store';

interface OrderModalState {
	vehicleId?: string;
	order?: any;
	show: boolean;
	callback?: (reloaded: boolean) => void;
}

const createOrderModalStore = () => {
	const { subscribe, set, update } = writable<OrderModalState>({
		vehicleId: undefined,
		order: undefined,
		show: false,
		callback: undefined
	});

	return {
		subscribe,
		show(vehicleId: string, order: any = undefined, callback?: (reloaded: boolean) => void) {
			set({ vehicleId, order, show: true, callback });
		},
		hide(reloaded = false) {
			let cb: ((reloaded: boolean) => void) | undefined;
			update((state) => {
				cb = state.callback;
				return { vehicleId: undefined, order: undefined, show: false, callback: undefined };
			});
			cb?.(reloaded);
		}
	};
};

interface OrderStatusModalState {
	vehicleId?: string;
	order?: any;
	show: boolean;
	callback?: (reloaded: boolean) => void;
}

const createOrderStatusModalStore = () => {
	const { subscribe, set, update } = writable<OrderStatusModalState>({
		vehicleId: undefined,
		order: undefined,
		show: false,
		callback: undefined
	});

	return {
		subscribe,
		show(vehicleId: string, order: any, callback?: (reloaded: boolean) => void) {
			set({ vehicleId, order, show: true, callback });
		},
		hide(reloaded = false) {
			let cb: ((reloaded: boolean) => void) | undefined;
			update((state) => {
				cb = state.callback;
				return { vehicleId: undefined, order: undefined, show: false, callback: undefined };
			});
			cb?.(reloaded);
		}
	};
};

export const maintenanceOrderModalStore = createOrderModalStore();
export const maintenanceOrderStatusModalStore = createOrderStatusModalStore();

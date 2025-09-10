import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getApiUrl } from '$lib/utils/api';

export interface Config {
	key: string;
	value?: string;
	description?: string;
}

const createConfigStore = () => {
	const { subscribe, set } = writable<Config[]>([]);
	async function fetchConfig() {
		if (browser) {
			try {
				const url = getApiUrl('/api/config');
				console.debug('[config] Fetching:', url);
				const headers: Record<string, string> = {};
				const pin = localStorage.getItem('userPin');
				if (pin) headers['X-User-PIN'] = pin;
				const response = await fetch(url, { headers });
				if (response.ok) {
					const data: Config[] = await response.json();
					set(data);
				} else {
					console.error('Failed to fetch config:', response.status, response.statusText);
				}
			} catch (error) {
				console.error('Error fetching config:', error);
			}
		}
	}

	async function updateConfig(configs: Config[]) {
		if (browser) {
			try {
				const headers: Record<string, string> = {
					'Content-Type': 'application/json',
				};
				const pin = localStorage.getItem('userPin');
				if (pin) headers['X-User-PIN'] = pin;
				const response = await fetch(getApiUrl('/api/config'), {
					method: 'PUT',
					headers,
					body: JSON.stringify(configs)
				});
				if (response.ok) {
					fetchConfig(); // Refresh the config after updating
				} else {
					console.error('Failed to update config');
				}
			} catch (error) {
				console.error('Error updating config:', error);
			}
		}
	}

	fetchConfig();

	return {
		subscribe,
		save: (localConfig: Config[]) => {
			console.log('Saving config:', localConfig);
			updateConfig(localConfig);
		}
	};
};

const createConfigModalStore = () => {
	const { subscribe, set } = writable<{
		show: boolean;
		callback?: any;
	}>({
		show: false,
		callback: undefined
	});

	function show(callback: any = undefined) {
		set({
			show: true,
			callback
		});
	}

	function hide() {
		set({
			show: false
		});
	}

	return {
		subscribe,
		show,
		hide
	};
};

export const configModelStore = createConfigModalStore();
export const config = createConfigStore();

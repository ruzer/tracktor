import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

export interface Config {
	key: string;
	value?: string;
	description?: string;
}

export interface ConfigStore {
	dateFormat: string;
	currency: string;
	theme: string;
	language: string;
}

const defaultConfig: ConfigStore = {
	dateFormat: 'DD/MM/YYYY',
	currency: 'USD',
	theme: 'light',
	language: 'en'
};

// const defaultConfig: ConfigStore = [];

const createConfigStore = () => {
	const { subscribe, set } = writable<Config[]>([]);
	const configJson = writable<ConfigStore>(defaultConfig);

	async function fetchConfig() {
		if (browser) {
			try {
				const response = await fetch(`${env.PUBLIC_API_BASE_URL || ''}/api/config`, {
					headers: {
						'X-User-PIN': localStorage.getItem('userPin') || ''
					}
				});
				if (response.ok) {
					const data: Config[] = await response.json();
					const newConfig: any = {};
					data.forEach((item) => {
						if (item.key && item.value !== undefined) {
							newConfig[item.key] = item.value;
						}
					});
					configJson.set(newConfig);
					set(data);
				} else {
					console.error('Failed to fetch config');
				}
			} catch (error) {
				console.error('Error fetching config:', error);
			}
		}
	}

	async function updateConfig(configs: Config[]) {
		if (browser) {
			try {
				const response = await fetch(`${env.PUBLIC_API_BASE_URL || ''}/api/config`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
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
		configJson,
		save: (localConfig: Config[]) => {
			console.log('Saving config:', localConfig);
			updateConfig(localConfig);
		}
	};
};

export const config = createConfigStore();

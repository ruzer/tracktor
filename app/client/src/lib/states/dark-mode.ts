import { writable } from 'svelte/store';

const createDarkModeStore = () => {
	const { subscribe, set, update } = writable<boolean>(false);

	function loadDarkModePreference() {
		if (typeof window !== 'undefined') {
			const darkMode = localStorage.getItem('darkMode');
			if (darkMode !== null) {
				set(darkMode === 'true');
			} else {
				set(false); // Default to light mode if no preference is set
			}
		}
	}

	return {
		subscribe,
		toggle: () => update((current) => !current),
		enable: () => set(true),
		disable: () => set(false)
	};
};

export const darkModeStore = createDarkModeStore();

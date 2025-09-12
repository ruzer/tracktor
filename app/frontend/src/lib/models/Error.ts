import type { Status } from './status';
import { get } from 'svelte/store';
import { t as tStore } from '$lib/stores/i18n';

export type ApiError = {
	type: string;
	errors: {
		message: string;
		path?: string;
	}[];
};

export const handleApiError = (data: ApiError, _editMode: boolean): Status => {
	console.log(JSON.stringify(data));
	const translate = get(tStore);
	let message = data.errors.map((e) => `${e.path ? e.path + ' : ' : ''}${e.message}`).join('\n');
	return {
		message: message || translate('errors.fetchFailed'),
		type: 'ERROR'
	};
};

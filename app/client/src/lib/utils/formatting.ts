import dayjs from 'dayjs/esm';
import { config } from '$lib/stores/config';

export interface ConfigStore {
	dateFormat: string;
	currency: string;
	unitOfMeasure?: string;
}

const configs: ConfigStore = {
	dateFormat: 'DD/MM/YYYY',
	currency: 'USD',
	unitOfMeasure: 'metric'
};

config.subscribe((value) => {
	if (value && value.length > 0) {
		value.forEach((item) => {
			if (item.key === 'dateFormat') {
				configs.dateFormat = item.value || configs.dateFormat;
			} else if (item.key === 'currency') {
				configs.currency = item.value || configs.currency;
			} else if (item.key === 'unitOfMeasure') {
				configs.unitOfMeasure = item.value || configs.unitOfMeasure;
			}
		});
	}
});

const formatDate = (date: Date | string): string => {
	return dayjs(date).format(configs.dateFormat);
};

const getCurrencySymbol = (): string => {
	return (
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: configs.currency
		})
			.formatToParts(0)
			.find((part) => part.type === 'currency')?.value || ''
	);
};

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: configs.currency
	}).format(amount);
};

const getDistanceUnit = (): string => {
	if (configs.unitOfMeasure === 'metric') {
		return 'km';
	}
	if (configs.unitOfMeasure === 'imperial') {
		return 'mi';
	}
	return '';
};

const formatDistance = (distance: number): string => {
	if (configs.unitOfMeasure === 'metric') {
		return `${distance} km`;
	} else if (configs.unitOfMeasure === 'imperial') {
		return `${distance} mi`;
	}
	return `${distance}`;
};

const formatVolume = (volume: number): string => {
	if (configs.unitOfMeasure === 'metric') {
		return `${volume} l`;
	} else if (configs.unitOfMeasure === 'imperial') {
		return `${volume} gal`;
	}
	return `${volume}`;
};

const getMileageUnit = (): string => {
	if (configs.unitOfMeasure === 'metric') {
		return 'kmpl';
	}
	if (configs.unitOfMeasure === 'imperial') {
		return 'mpg';
	}
	return '';
};

const formatMileage = (mileage: number): string => {
	if (configs.unitOfMeasure === 'metric') {
		return `${mileage} kmpl`;
	} else if (configs.unitOfMeasure === 'imperial') {
		return `${mileage} mpg`;
	}
	return `${mileage}`;
};

export {
	formatDate,
	getCurrencySymbol,
	formatCurrency,
	getDistanceUnit,
	formatDistance,
	formatVolume,
	getMileageUnit,
	formatMileage
};

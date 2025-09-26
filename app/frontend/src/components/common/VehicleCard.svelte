<script lang="ts">
	import {
		BadgeCheck,
		Car,
		Cog,
		Fuel,
		Gauge,
		IdCard,
		Fingerprint,
		Paintbrush,
		Shield
	} from '@lucide/svelte';
	import { formatDistance } from '$lib/utils/formatting';
	import { t } from '$lib/stores/i18n';
	import VehicleActions from './VehicleActions.svelte';
	import { getVolumeUnit } from '$lib/utils/formatting';
	import type { VehicleStatus } from '$lib/models/vehicle';

	const { vehicle, updateCallback } = $props();

	const statusBadgeClass = (status: VehicleStatus | undefined) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
			case 'in_repair':
				return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
			case 'retired':
				return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
			default:
				return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
		}
	};

	const statusBadgeLabel = (status: VehicleStatus | undefined) => {
		switch (status) {
			case 'active':
				return $t('forms.options.vehicleStatus.active');
			case 'in_repair':
				return $t('forms.options.vehicleStatus.inRepair');
			case 'retired':
				return $t('forms.options.vehicleStatus.retired');
			default:
				return null;
		}
	};
</script>

<div
	class="flex min-h-60 flex-col justify-between gap-4 rounded-2xl border-2 border-transparent bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:border-blue-500 hover:shadow-2xl dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-400"
>
	<div class="mb-2 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<Car class="h-7 w-7 text-blue-500 dark:text-blue-400" />
			<span class="text-2xl font-bold text-gray-800 dark:text-gray-100"
				>{vehicle.make} {vehicle.model}</span
			>
		</div>
		<div class="flex flex-col items-end gap-2 text-xs font-semibold">
			<span class="rounded-full bg-blue-600 px-3 py-1 text-white dark:bg-blue-500 dark:text-gray-100"
				>{vehicle.year}</span
			>
			{#if vehicle.status}
				<span class={`rounded-full px-3 py-1 ${statusBadgeClass(vehicle.status)}`}>
					{statusBadgeLabel(vehicle.status)}
				</span>
			{/if}
		</div>
	</div>
	<div class="flex-1 text-gray-600 dark:text-gray-300">
		<p class="flex items-center gap-2">
			<IdCard class="h-5 w-5 text-gray-400 dark:text-gray-500" /><span class="font-semibold"
				>{$t('vehicle.licensePlate')}:</span
			>
			{vehicle.licensePlate}
		</p>
		<p class="flex items-center gap-2">
			<Fingerprint class="h-5 w-5 text-gray-400 dark:text-gray-500" /><span class="font-semibold"
				>{$t('vehicle.vin')}:</span
			>
			{vehicle.vinNumber ?? vehicle.vin ?? '-'}
		</p>

		<p class="flex items-center gap-2">
			<Paintbrush class="h-5 w-5 text-gray-400 dark:text-gray-500" />
			<span class="font-semibold">{$t('vehicle.color')}:</span>
			{#if vehicle.color}
				<span
					class="m-1 h-4 w-8 rounded border-2 border-sky-500 p-2 dark:border-sky-800"
					style={`background-color: ${vehicle.color}`}
				></span>
			{:else}
				<span>-</span>
			{/if}
		</p>
		<p class="flex items-center gap-2">
			<Gauge class="h-5 w-5 text-gray-400 dark:text-gray-500" />
			<span class="font-semibold">{$t('vehicle.odometer')}:</span>
			{vehicle.odometer ? formatDistance(vehicle.odometer) : '-'}
		</p>
		<p class="flex items-center gap-2">
			<Cog class="h-5 w-5 text-gray-400 dark:text-gray-500" />
			<span class="font-semibold">{$t('forms.labels.engineNumber')}:</span>
			{vehicle.engineNumber ?? '-'}
		</p>
		<p class="flex items-center gap-2">
			<Fuel class="h-5 w-5 text-gray-400 dark:text-gray-500" />
			<span class="font-semibold">{$t('forms.labels.tankSizeLiters')}:</span>
			{vehicle.tankSizeLiters ? `${vehicle.tankSizeLiters} ${getVolumeUnit()}` : '-'}
		</p>
		{#if vehicle.insuranceStatus}
			<p class="flex items-center gap-2">
				<Shield class="h-5 w-5 text-gray-400 dark:text-gray-500" />
				<span class="font-semibold">{$t('vehicle.insurance')}:</span>
				<span class={vehicle.insuranceStatus === 'Active' ? 'text-green-600' : 'text-red-600'}>
					{vehicle.insuranceStatus === 'Active'
						? $t('vehicle.active')
						: vehicle.insuranceStatus === 'Not Available'
							? $t('common.notAvailable')
							: vehicle.insuranceStatus}
				</span>
			</p>
		{/if}
		{#if vehicle.puccStatus}
			<p class="flex items-center gap-2">
				<BadgeCheck class="h-5 w-5 text-gray-400 dark:text-gray-500" />
				<span class="font-semibold">{$t('vehicle.pucc')}:</span>
				<span class={vehicle.puccStatus === 'Active' ? 'text-green-600' : 'text-red-600'}>
					{vehicle.puccStatus === 'Active'
						? $t('vehicle.active')
						: vehicle.puccStatus === 'Not Available'
							? $t('common.notAvailable')
							: vehicle.puccStatus}
				</span>
			</p>
		{/if}
	</div>
	<VehicleActions {vehicle} {updateCallback} />
</div>

<script lang="ts">
	import { Car, IdCard, Fingerprint, Paintbrush, Gauge, Shield, BadgeCheck } from '@lucide/svelte';
	import { formatDistance } from '$lib/utils/formatting';
	import { t } from '$lib/stores/i18n';
	import VehicleActions from './VehicleActions.svelte';

	const { vehicle, updateCallback } = $props();
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
		<span
			class="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white dark:bg-blue-500 dark:text-gray-100"
			>{vehicle.year}</span
		>
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
			{vehicle.vin ? vehicle.vin : '-'}
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

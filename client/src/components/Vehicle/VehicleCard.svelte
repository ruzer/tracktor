<script lang="ts">
	import {
		Car,
		IdCard,
		Fingerprint,
		Paintbrush,
		Gauge,
		Pencil,
		Trash2,
		Fuel
	} from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';

	export let vehicle: {
		id: number;
		make: string;
		model: string;
		year: number;
		licensePlate: string;
		vin?: string;
		color?: string;
		odometer?: number;
	};

	const dispatch = createEventDispatcher();
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
				>License Plate:</span
			>
			{vehicle.licensePlate}
		</p>
		{#if vehicle.vin}
			<p class="flex items-center gap-2">
				<Fingerprint class="h-5 w-5 text-gray-400 dark:text-gray-500" /><span class="font-semibold"
					>VIN:</span
				>
				{vehicle.vin}
			</p>
		{/if}
		{#if vehicle.color}
			<p class="flex items-center gap-2">
				<Paintbrush class="h-5 w-5 text-gray-400 dark:text-gray-500" /><span class="font-semibold"
					>Color:</span
				>
				{vehicle.color}
			</p>
		{/if}
		{#if vehicle.odometer}
			<p class="flex items-center gap-2">
				<Gauge class="h-5 w-5 text-gray-400 dark:text-gray-500" /><span class="font-semibold"
					>Odometer:</span
				>
				{vehicle.odometer} km
			</p>
		{/if}
	</div>
	<div class="flex justify-end gap-2">
		<button
			type="button"
			class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
			on:click={() => dispatch('editVehicle', { vehicle })}
			aria-label="Edit vehicle"
		>
			<Pencil
				class="h-5 w-5 text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
			/>
		</button>
		<button
			type="button"
			class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
			on:click={() => dispatch('deleteVehicle', { vehicle })}
			aria-label="Delete vehicle"
		>
			<Trash2
				class="h-5 w-5 text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
			/>
		</button>
		<button
			type="button"
			class="rounded-full p-2 transition-colors hover:bg-green-100 dark:hover:bg-green-700"
			on:click={() => dispatch('refillFuel', { vehicle })}
			aria-label="Log fuel refill"
		>
			<!-- Fuel icon from Lucide or fallback SVG -->
			<Fuel class="h-5 w-5 text-green-500 hover:text-green-600 dark:text-green-400" />
		</button>
	</div>
</div>

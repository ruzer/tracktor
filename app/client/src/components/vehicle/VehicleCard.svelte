<script lang="ts">
	import {
		Car,
		IdCard,
		Fingerprint,
		Paintbrush,
		Gauge,
		Pencil,
		Trash2,
		Fuel,
		Wrench,
		Shield,
		BadgeCheck
	} from '@lucide/svelte';
	import { formatDistance } from '$lib/utils/formatting';
	import { vehicleModelStore, vehiclesStore } from '$lib/stores/vehicle';
	import { maintenanceModelStore } from '$lib/stores/maintenance';
	import { fuelLogModelStore } from '$lib/stores/fuel-log';
	import { insuranceModelStore } from '$lib/stores/insurance';
	import { puccModelStore } from '$lib/stores/pucc';

	const { vehicle, updateCallback } = $props();

	async function deleteVehicle(vehicleId: string) {
		if (!confirm('Are you sure you want to delete this vehicle?')) {
			return;
		}
		try {
			const response = await fetch(`http://localhost:3000/api/vehicles/${vehicleId}`, {
				method: 'DELETE',
				headers: {
					'X-User-PIN': localStorage.getItem('userPin') || ''
				}
			});
			if (response.ok) {
				alert('Vehicle deleted successfully.');
				vehicleModelStore.hide();
				vehiclesStore.fetchVehicles();
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to delete vehicle.');
			}
		} catch (e) {
			alert('Failed to connect to the server.');
		}
	}
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
		<p class="flex items-center gap-2">
			<Fingerprint class="h-5 w-5 text-gray-400 dark:text-gray-500" /><span class="font-semibold"
				>VIN:</span
			>
			{vehicle.vin ? vehicle.vin : '-'}
		</p>

		<p class="flex items-center gap-2">
			<Paintbrush class="h-5 w-5 text-gray-400 dark:text-gray-500" /><span class="font-semibold"
				>Color:</span
			>
			{vehicle.color ? vehicle.color : '-'}
		</p>
		<p class="flex items-center gap-2">
			<Gauge class="h-5 w-5 text-gray-400 dark:text-gray-500" />
			<span class="font-semibold">Odometer:</span>
			{vehicle.odometer ? formatDistance(vehicle.odometer) : '-'}
		</p>
		{#if vehicle.insuranceStatus}
			<p class="flex items-center gap-2">
				<Shield class="h-5 w-5 text-gray-400 dark:text-gray-500" />
				<span class="font-semibold">Insurance:</span>
				<span class={vehicle.insuranceStatus === 'Active' ? 'text-green-500' : 'text-red-500'}>
					{vehicle.insuranceStatus}
				</span>
			</p>
		{/if}
		{#if vehicle.puccStatus}
			<p class="flex items-center gap-2">
				<BadgeCheck class="h-5 w-5 text-gray-400 dark:text-gray-500" />
				<span class="font-semibold">PUCC:</span>
				<span class={vehicle.puccStatus === 'Active' ? 'text-green-500' : 'text-red-500'}>
					{vehicle.puccStatus}
				</span>
			</p>
		{/if}
	</div>
	<div class=" flex justify-between">
		<div class="flex justify-start gap-2">
			<button
				type="button"
				class="rounded-full p-2 transition-colors hover:bg-green-100 dark:hover:bg-green-700"
				onclick={() => fuelLogModelStore.show(vehicle.id, null, false, updateCallback)}
				aria-label="Log fuel refill"
			>
				<!-- Fuel icon from Lucide or fallback SVG -->
				<Fuel class="h-5 w-5 text-green-500 hover:text-green-600 dark:text-green-400" />
			</button>
			<button
				type="button"
				class="rounded-full p-2 transition-colors hover:bg-yellow-100 dark:hover:bg-yellow-700"
				onclick={() => maintenanceModelStore.show(vehicle.id, null, false, updateCallback)}
				aria-label="Log maintenance"
			>
				<Wrench class="h-5 w-5 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400" />
			</button>
			<button
				type="button"
				class="rounded-full p-2 transition-colors hover:bg-blue-100 dark:hover:bg-blue-700"
				onclick={() => insuranceModelStore.show(vehicle.id, null, false, updateCallback)}
				aria-label="Add Insurance"
			>
				<Shield class="h-5 w-5 text-blue-500 hover:text-blue-600 dark:text-blue-400" />
			</button>
			<button
				type="button"
				class="rounded-full p-2 transition-colors hover:bg-purple-100 dark:hover:bg-purple-700"
				onclick={() => puccModelStore.show(vehicle.id, null, false, updateCallback)}
				aria-label="Add Pollution Certificate"
			>
				<BadgeCheck class="h-5 w-5 text-purple-500 hover:text-purple-600 dark:text-purple-400" />
			</button>
		</div>
		<div class="flex justify-end gap-2">
			<button
				type="button"
				class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
				onclick={() => {
					vehicleModelStore.show(vehicle, true);
				}}
				aria-label="Edit vehicle"
			>
				<Pencil
					class="h-5 w-5 text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
				/>
			</button>
			<button
				type="button"
				class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
				onclick={() => deleteVehicle(vehicle.id)}
				aria-label="Delete vehicle"
			>
				<Trash2
					class="h-5 w-5 text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
				/>
			</button>
		</div>
	</div>
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { Pencil, Trash2 } from '@lucide/svelte';
	import {
		formatCurrency,
		formatDate,
		formatVolume,
		formatMileage,
		formatDistance
	} from '$lib/utils/formatting';

	import { fuelLogModelStore } from '$lib/stores/fuel-log';

	const { vehicleId } = $props();

	interface FuelLog {
		id: number;
		date: string;
		odometer: number;
		fuelAmount: number;
		cost: number;
		notes?: string;
		mileage?: number;
	}

	let fuelLogs: FuelLog[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	$effect(() => {
		if (!vehicleId) {
			error = 'Vehicle ID is required.';
			loading = false;
		} else {
			fetchFuelLogs();
		}
	});

	async function fetchFuelLogs() {
		loading = true;
		error = '';
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/fuel-logs`,
				{
					headers: {
						'X-User-PIN': localStorage.getItem('userPin') || ''
					}
				}
			);
			if (response.ok) {
				fuelLogs = await response.json();
			} else {
				const data = await response.json();
				error = data.message || 'Failed to fetch fuel logs.';
			}
		} catch (e) {
			console.error('Failed to connect to the server.', e);
			error = 'Failed to connect to the server.';
		}
		loading = false;
	}

	async function deleteFuelLog(logId: number) {
		if (!confirm('Are you sure you want to delete this Fuel log?')) {
			return;
		}
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/fuel-logs/${logId}`,
				{
					method: 'DELETE',
					headers: {
						'X-User-PIN': localStorage.getItem('userPin') || ''
					}
				}
			);
			if (response.ok) {
				fuelLogs = fuelLogs.filter((log) => log.id !== logId);
			} else {
				const data = await response.json();
				error = data.message || 'Failed to delete fuel log.';
			}
		} catch (e) {
			console.error('Failed to connect to the server.', e);
			error = 'Failed to connect to the server.';
		}
	}

	onMount(() => {
		fetchFuelLogs();
	});
</script>

{#if loading}
	<p>Loading fuel logs...</p>
{:else if error}
	<p class="text-red-500">Error: {error}</p>
{:else if fuelLogs.length === 0}
	<p>No fuel refill logs found for this vehicle.</p>
{:else}
	<div class="overflow-x-auto">
		<table class="min-w-full overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
			<thead class="bg-gray-200 dark:bg-gray-700">
				<tr>
					<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Date</th>
					<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300"
						>Odometer</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300"
						>Fuel Amount</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Cost</th>
					<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Mileage</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Notes</th>
					<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Actions</th
					>
				</tr>
			</thead>
			<tbody>
				{#each fuelLogs as log (log.id)}
					<tr class="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
						<td class="px-4 py-2 text-gray-800 dark:text-gray-200">{formatDate(log.date)}</td>
						<td class="px-4 py-2 text-gray-800 dark:text-gray-200"
							>{formatDistance(log.odometer)}</td
						>
						<td class="px-4 py-2 text-gray-800 dark:text-gray-200"
							>{formatVolume(log.fuelAmount)}</td
						>
						<td class="px-4 py-2 text-gray-800 dark:text-gray-200">{formatCurrency(log.cost)}</td>
						<td class="styled-text px-4 py-2 text-gray-800 dark:text-gray-200"
							>{log.mileage ? formatMileage(log.mileage) : '-'}</td
						>
						<td class="px-4 py-2 text-gray-800 dark:text-gray-200">{log.notes || '-'}</td>
						<td class="px-4 py-2 text-gray-800 dark:text-gray-200">
							<button
								class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
								onclick={() =>
									fuelLogModelStore.show(vehicleId, log, true, (status: boolean) => {
										if (status) {
											fetchFuelLogs();
										}
									})}
							>
								<Pencil
									class="h-5 w-5 text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
								/>
							</button>
							<button
								class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
								onclick={() => deleteFuelLog(log.id)}
							>
								<Trash2
									class="h-5 w-5 text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
								/>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

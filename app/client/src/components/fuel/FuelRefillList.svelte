<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import dayjs from 'dayjs';
	import { configJson } from '../../lib/states/config';

	$: formatDate = (date: string) => dayjs(date).format($configJson.dateFormat);
	$: formatCurrency = (amount: number) => `${$configJson.currency} ${amount.toLocaleString()}`;

	export let vehicleId: number;

	interface FuelLog {
		id: number;
		date: string;
		odometer: number;
		fuelAmount: number;
		cost: number;
		notes?: string;
		mileage?: number;
	}

	let fuelLogs: FuelLog[] = [];
	let loading = true;
	let error = '';

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

	onMount(() => {
		fetchFuelLogs();
	});

	// Reactively fetch logs when vehicleId changes
	$: if (vehicleId) {
		fetchFuelLogs();
	}
</script>

<div class="container mx-auto p-4 text-gray-600 dark:text-gray-300">
	<h2 class="mb-4 text-2xl font-bold">Fuel Refill History</h2>

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
							>Fuel Amount (L)</th
						>
						<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Cost</th>
						<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300"
							>Mileage (km/L)</th
						>
						<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Notes</th
						>
					</tr>
				</thead>
				<tbody>
					{#each fuelLogs as log (log.id)}
						<tr class="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
							<td class="px-4 py-2 text-gray-800 dark:text-gray-200">{formatDate(log.date)}</td>
							<td class="px-4 py-2 text-gray-800 dark:text-gray-200">{log.odometer} km</td>
							<td class="px-4 py-2 text-gray-800 dark:text-gray-200">{log.fuelAmount} L</td>
							<td class="px-4 py-2 text-gray-800 dark:text-gray-200">{formatCurrency(log.cost)}</td>
							<td class="px-4 py-2 text-gray-800 dark:text-gray-200"
								>{log.mileage ? log.mileage.toFixed(2) : 'N/A'}</td
							>
							<td class="px-4 py-2 text-gray-800 dark:text-gray-200">{log.notes || 'N/A'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

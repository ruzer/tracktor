<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let vehicleId: number | null = null;

	let fuelRefills: Array<{
		id: number;
		date: string;
		odometer: number;
		fuelAmount: number;
		cost: number;
		mileage: number | null;
		notes?: string;
	}> = [];
	let loading = false;
	let error = '';

	async function fetchFuelRefills() {
		if (!vehicleId) {
			fuelRefills = [];
			return;
		}
		loading = true;
		error = '';
		try {
			const response = await fetch(`http://localhost:3000/api/vehicles/${vehicleId}/fuel-logs`, {
				headers: {
					'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
				}
			});
			if (response.ok) {
				const data = await response.json();
				fuelRefills = data;
			} else {
				error = 'Failed to fetch fuel refills.';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	// Refetch when vehicleId changes
	$: if (vehicleId) {
		fetchFuelRefills();
	}

	onMount(() => {
		if (vehicleId) fetchFuelRefills();
	});
</script>

<div class="mt-8">
	<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Fuel Refill History</h3>
	{#if loading}
		<div class="text-gray-500 dark:text-gray-400">Loading fuel refills...</div>
	{:else if error}
		<div class="text-red-600 dark:text-red-400" role="alert">{error}</div>
	{:else if fuelRefills.length === 0}
		<div class="text-gray-500 dark:text-gray-400">No fuel refills logged for this vehicle.</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="min-w-full rounded border border-gray-200 shadow-sm dark:border-gray-700">
				<thead class="bg-gray-100 dark:bg-gray-800">
					<tr>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200"
							>Date</th
						>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200"
							>Odometer</th
						>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200"
							>Fuel Amount (L)</th
						>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200"
							>Cost</th
						>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200"
							>Mileage (km/L)</th
						>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200"
							>Notes</th
						>
					</tr>
				</thead>
				<tbody>
					{#each fuelRefills as refill}
						<tr class="border-t border-gray-200 dark:border-gray-700">
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
								>{new Date(refill.date).toLocaleDateString()}</td
							>
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{refill.odometer}</td>
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{refill.fuelAmount}</td>
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{refill.cost}</td>
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
								>{refill.mileage !== null ? refill.mileage.toFixed(2) : 'N/A'}</td
							>
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
								>{refill.notes || '-'}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

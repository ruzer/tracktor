<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { formatCurrency, formatDate, formatDistance } from '$lib/utils/formatting';
	import { Pencil, Trash2 } from '@lucide/svelte';
	import { maintenanceModelStore } from '$lib/stores/maintenance';

	let { vehicleId } = $props();

	interface MaintenanceLog {
		id: string;
		date: string;
		odometer: number;
		service: string;
		cost: number;
		notes?: string;
	}

	let maintenanceLogs: MaintenanceLog[] = $state([]);
	let loading = $state(false);
	let error = $state('');

	$effect(() => {
		if (!vehicleId) {
			error = 'Vehicle ID is required.';
			loading = false;
		} else {
			fetchMaintenanceLogs();
		}
	});

	async function fetchMaintenanceLogs() {
		if (!vehicleId) {
			maintenanceLogs = [];
			return;
		}
		loading = true;
		error = '';
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/maintenance-logs`,
				{
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				const data = await response.json();
				maintenanceLogs = data;
			} else {
				error = 'Failed to fetch maintenance logs.';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function deleteMaintenenceLog(logId: string) {
		if (!confirm('Are you sure you want to delete this maintenance log?')) {
			return;
		}
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/maintenance-logs/${logId}`,
				{
					method: 'DELETE',
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				await fetchMaintenanceLogs();
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to delete maintenance log.');
			}
		} catch (err) {
			alert('Network error. Failed to delete maintenance log.');
		}
	}

	onMount(() => {
		fetchMaintenanceLogs();
	});
</script>

{#if loading}
	<div class="text-gray-500 dark:text-gray-400">Loading maintenance logs...</div>
{:else if error}
	<div class="text-red-600 dark:text-red-400" role="alert">{error}</div>
{:else if maintenanceLogs.length === 0}
	<div class="text-gray-500 dark:text-gray-400">No maintenance logs for this vehicle.</div>
{:else}
	<div class="overflow-x-auto">
		<table class="min-w-full overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
			<thead class="bg-gray-200 dark:bg-gray-700">
				<tr>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Date</th>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>Odometer</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Service</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Cost</th>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Notes</th>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">Actions</th
					>
				</tr>
			</thead>
			<tbody>
				{#each maintenanceLogs as log (log.id)}
					<tr class="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
						<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{formatDate(log.date)}</td>
						<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{formatDistance(log.odometer)}</td>
						<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{log.service}</td>
						<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{formatCurrency(log.cost)}</td>
						<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{log.notes || '-'}</td>
						<td class="px-4 py-2 text-gray-800 dark:text-gray-200">
							<button
								class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
								onclick={() =>
									maintenanceModelStore.show(vehicleId, log, true, (status: boolean) => {
										if (status) {
											fetchMaintenanceLogs();
										}
									})}
							>
								<Pencil
									class="h-5 w-5 text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
								/>
							</button>
							<button
								class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
								onclick={() => deleteMaintenenceLog(log.id)}
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

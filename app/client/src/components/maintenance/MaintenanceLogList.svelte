<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import MaintenanceLogForm from './MaintenanceLogForm.svelte';
  import { config } from '../../lib/states/config';
  import dayjs from 'dayjs';

  $: formatDate = (date: string) => dayjs(date).format($config.dateFormat);
  $: formatCurrency = (amount: number) => `${$config.currency} ${amount.toLocaleString()}`

	export let vehicleId: number | null = null;

	interface MaintenanceLogEntry {
		id: number;
		date: string;
		odometer: number;
		service: string;
		cost: number;
		notes?: string;
	}

	let maintenanceLogs: MaintenanceLogEntry[] = [];
	let loading = false;
	let error = '';
	let showEditModal = false;
	let selectedLog: MaintenanceLogEntry | null = null;

	async function fetchMaintenanceLogs() {
		if (!vehicleId) {
			maintenanceLogs = [];
			return;
		}
		loading = true;
		error = '';
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL||""}/api/vehicles/${vehicleId}/maintenance-logs`,
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

	async function handleDelete(logId: number) {
		if (!confirm('Are you sure you want to delete this maintenance log?')) {
			return;
		}
		try {
			const response = await fetch(`${env.PUBLIC_API_BASE_URL}/api/maintenance-logs/${logId}`, {
				method: 'DELETE',
				headers: {
					'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
				}
			});
			if (response.ok) {
				await fetchMaintenanceLogs(); // Refresh the list
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to delete maintenance log.');
			}
		} catch (err) {
			alert('Network error. Failed to delete maintenance log.');
		}
	}

	function handleEdit(log: MaintenanceLogEntry) {
		selectedLog = log;
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		selectedLog = null;
	}

	function handleSuccess() {
		fetchMaintenanceLogs(); // Refresh logs after add/edit
		closeEditModal();
	}

	// Refetch when vehicleId changes
	$: if (vehicleId) {
		fetchMaintenanceLogs();
	}

	onMount(() => {
		if (vehicleId) fetchMaintenanceLogs();
	});
</script>

<div class="mt-8">
	<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Maintenance History</h3>
	{#if loading}
		<div class="text-gray-500 dark:text-gray-400">Loading maintenance logs...</div>
	{:else if error}
		<div class="text-red-600 dark:text-red-400" role="alert">{error}</div>
	{:else if maintenanceLogs.length === 0}
		<div class="text-gray-500 dark:text-gray-400">No maintenance logs for this vehicle.</div>
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
							>Service</th
						>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200"
							>Cost</th
						>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200"
							>Notes</th
						>
						<th class="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody>
					{#each maintenanceLogs as log (log.id)}
						<tr class="border-t border-gray-200 dark:border-gray-700">
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
								>{formatDate(log.date)}</td
							>
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{log.odometer}</td>
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{log.service}</td>
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{formatCurrency(log.cost)}</td>
							<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{log.notes || '-'}</td>
							<td class="px-4 py-2 text-sm">
								<button
									on:click={() => handleEdit(log)}
									class="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
								>
									Edit
								</button>
								<button
									on:click={() => handleDelete(log.id)}
									class="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if showEditModal}
		<MaintenanceLogForm
			{vehicleId}
			showModal={showEditModal}
			closeModal={closeEditModal}
			on:success={handleSuccess}
			initialData={selectedLog}
		/>
	{/if}
</div>

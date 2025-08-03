<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { Shield, Calendar, Hash, DollarSign, Pencil, Trash2 } from '@lucide/svelte';
	import InsuranceForm from './InsuranceForm.svelte';
	import { config } from '../../lib/states/config';
	import dayjs from 'dayjs';

	$: formatDate = (date: string) => dayjs(date).format($config.dateFormat);
	$: formatCurrency = (amount: number) => `${$config.currency} ${amount.toLocaleString()}`;

	export let vehicleId: number | null = null;

	interface InsuranceDetails {
		id: number;
		provider: string;
		policyNumber: string;
		startDate: string;
		endDate: string;
		cost: number;
	}

	let insurance: InsuranceDetails | null = null;
	let loading = false;
	let error = '';
	let showInsuranceFormModal = false;

	async function fetchInsuranceDetails() {
		if (!vehicleId) {
			insurance = null;
			return;
		}
		loading = true;
		error = '';
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL||""}/api/vehicles/${vehicleId}/insurance`,
				{
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				insurance = await response.json();
			} else {
				insurance = null;
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function handleDeleteInsurance() {
		if (!insurance) return;
		if (!confirm('Are you sure you want to delete these insurance details?')) {
			return;
		}
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL||""}/api/vehicles/${vehicleId}/insurance`,
				{
					method: 'DELETE',
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				insurance = null;
				alert('Insurance details deleted successfully.');
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to delete insurance details.');
			}
		} catch (err) {
			alert('Network error. Failed to delete insurance details.');
		}
	}

	function handleEditInsurance() {
		showInsuranceFormModal = true;
	}

	function handleAddInsurance() {
		showInsuranceFormModal = true;
	}

	function closeInsuranceFormModal() {
		showInsuranceFormModal = false;
		fetchInsuranceDetails(); // Refresh details after form submission
	}

	// Refetch when vehicleId changes
	$: if (vehicleId) {
		fetchInsuranceDetails();
	}

	onMount(() => {
		if (vehicleId) fetchInsuranceDetails();
	});
</script>

<div class="mt-8 text-gray-600 dark:text-gray-300">
	<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Insurance Details</h3>
	{#if loading}
		<div class="text-gray-500 dark:text-gray-400">Loading insurance details...</div>
	{:else if error}
		<div class="text-red-600 dark:text-red-400" role="alert">{error}</div>
	{:else if insurance}
		<div
			class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Shield class="h-6 w-6 text-blue-500 dark:text-blue-400" />
					<span class="text-xl font-bold text-gray-800 dark:text-gray-100"
						>{insurance.provider}</span
					>
				</div>
				<div class="flex gap-2">
					<button
						on:click={handleEditInsurance}
						class="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
					>
						<Pencil class="h-5 w-5" />
					</button>
					<button
						on:click={handleDeleteInsurance}
						class="text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
					>
						<Trash2 class="h-5 w-5" />
					</button>
				</div>
			</div>
			<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="flex items-center gap-2">
					<Hash class="h-5 w-5 text-gray-400 dark:text-gray-500" />
					<span class="font-semibold">Policy Number:</span>
					<span>{insurance.policyNumber}</span>
				</div>
				<div class="flex items-center gap-2">
					<DollarSign class="h-5 w-5 text-gray-400 dark:text-gray-500" />
					<span class="font-semibold">Cost:</span>
					<span>{formatCurrency(insurance.cost)}</span>
				</div>
				<div class="flex items-center gap-2">
					<Calendar class="h-5 w-5 text-gray-400 dark:text-gray-500" />
					<span class="font-semibold">Start Date:</span>
					<span>{formatDate(insurance.startDate)}</span>
				</div>
				<div class="flex items-center gap-2">
					<Calendar class="h-5 w-5 text-gray-400 dark:text-gray-500" />
					<span class="font-semibold">End Date:</span>
					<span>{formatDate(insurance.endDate)}</span>
				</div>
			</div>
		</div>
	{:else}
		<div class="text-center">
			<p class="text-gray-500 dark:text-gray-400">No insurance details found for this vehicle.</p>
			<button
				on:click={handleAddInsurance}
				class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			>
				Add Insurance
			</button>
		</div>
	{/if}

	{#if showInsuranceFormModal}
		<InsuranceForm
			{vehicleId}
			showModal={showInsuranceFormModal}
			closeModal={closeInsuranceFormModal}
			initialData={insurance}
		/>
	{/if}
</div>

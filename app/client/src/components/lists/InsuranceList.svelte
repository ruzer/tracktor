<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { Shield, Calendar, Hash, DollarSign, Pencil, Trash2 } from '@lucide/svelte';
	import { formatCurrency, formatDate } from '$lib/utils/formatting';
	import { insuranceModelStore } from '$lib/stores/insurance';

	let { vehicleId } = $props();

	interface Insurance {
		id: string;
		provider: string;
		policyNumber: string;
		startDate: string;
		endDate: string;
		cost: number;
	}

	let insurances: Insurance[] = $state([]);
	let loading = $state(false);
	let error = $state('');

	$effect(() => {
		if (!vehicleId) {
			error = 'Vehicle ID is required.';
			loading = false;
		} else {
			fetchInsuranceDetails();
		}
	});

	async function fetchInsuranceDetails() {
		if (!vehicleId) {
			insurances = [];
			return;
		}
		loading = true;
		error = '';
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/insurance`,
				{
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				insurances = await response.json();
				console.log('Insurance : ', JSON.stringify(insurances));
			} else {
				error = 'Failed to fetch insurance data.';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function deleteInsurance(insuranceId: string) {
		if (!confirm('Are you sure you want to delete this maintenance log?')) {
			return;
		}
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/insurance/${insuranceId}`,
				{
					method: 'DELETE',
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				await fetchInsuranceDetails();
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to delete insurance details.');
			}
		} catch (err) {
			alert('Network error. Failed to delete insurance details.');
		}
	}

	onMount(() => {
		fetchInsuranceDetails();
	});
</script>

{#if loading}
	<div class="text-gray-500 dark:text-gray-400">Loading insurance details...</div>
{:else if error}
	<div class="text-red-600 dark:text-red-400" role="alert">{error}</div>
{:else if insurances.length === 0}
	<div class="text-gray-500 dark:text-gray-400">No Insurance found for this vehicle.</div>
{:else}
	{#each insurances as ins (ins.id)}
		<div
			class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Shield class="h-6 w-6 text-blue-500 dark:text-blue-400" />
					<span class="text-xl font-bold text-gray-800 dark:text-gray-100">{ins.provider}</span>
				</div>
				<div class="flex gap-2">
					<button
						class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
						onclick={() => {
							insuranceModelStore.show(vehicleId, ins, true, (status: boolean) => {
								if (status) {
									fetchInsuranceDetails();
								}
							});
						}}
					>
						<Pencil
							class="h-5 w-5 text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
						/>
					</button>
					<button
						class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
						onclick={() => {
							deleteInsurance(ins.id);
						}}
					>
						<Trash2
							class="h-5 w-5 text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
						/>
					</button>
				</div>
			</div>
			<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="flex items-center gap-2 text-gray-900 dark:text-gray-100">
					<Hash class="h-5 w-5" />
					<span class="font-semibold">Policy Number:</span>
					<span>{ins.policyNumber}</span>
				</div>
				<div class="flex items-center gap-2 text-gray-900 dark:text-gray-100">
					<DollarSign class="h-5 w-5" />
					<span class="font-semibold">Cost:</span>
					<span>{formatCurrency(ins.cost)}</span>
				</div>
				<div class="flex items-center gap-2 text-gray-900 dark:text-gray-100">
					<Calendar class="h-5 w-5 " />
					<span class="font-semibold">Start Date:</span>
					<span>{formatDate(ins.startDate)}</span>
				</div>
				<div class="flex items-center gap-2 text-gray-900 dark:text-gray-100">
					<Calendar class="h-5 w-5 " />
					<span class="font-semibold">End Date:</span>
					<span>{formatDate(ins.endDate)}</span>
				</div>
			</div>
		</div>
	{/each}
{/if}

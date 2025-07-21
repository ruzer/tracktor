<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	export let vehicleId: number | null = null;
	export let showModal: boolean = false;
	export let closeModal: () => void;
	export let initialData: {
		id?: number;
		provider: string;
		policyNumber: string;
		startDate: string;
		endDate: string;
		cost: number;
	} | null = null;

	let provider = '';
	let policyNumber = '';
	let startDate = '';
	let endDate = '';
	let cost: number | null = null;

	let error = '';
	let success = '';

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (initialData) {
			provider = initialData.provider || '';
			policyNumber = initialData.policyNumber || '';
			startDate = initialData.startDate
				? new Date(initialData.startDate).toISOString().split('T')[0]
				: '';
			endDate = initialData.endDate
				? new Date(initialData.endDate).toISOString().split('T')[0]
				: '';
			cost = initialData.cost || null;
		}
	});

	async function saveInsurance() {
		error = '';
		success = '';

		if (!provider || !policyNumber || !startDate || !endDate || !cost) {
			error = 'All fields are required.';
			return;
		}

		const method = initialData && initialData.id ? 'PUT' : 'POST';

		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL}/api/vehicles/${vehicleId}/insurance`,
				{
					method,
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify({ provider, policyNumber, startDate, endDate, cost })
				}
			);

			if (response.ok) {
				success = `Insurance details ${initialData ? 'updated' : 'added'} successfully!`;
				dispatch('success');
				closeModal();
			} else {
				const data = await response.json();
				error = data.message || 'Failed to save insurance details.';
			}
		} catch (e) {
			error = 'Failed to connect to the server.';
		}
	}
</script>

{#if showModal}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
			<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
				{initialData ? 'Edit' : 'Add'} Insurance Details
			</h2>

			<form on:submit|preventDefault={saveInsurance}>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="md:col-span-2">
						<label for="provider" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Provider</label
						>
						<input
							type="text"
							id="provider"
							bind:value={provider}
							class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
						/>
					</div>
					<div class="md:col-span-2">
						<label
							for="policyNumber"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Policy Number</label
						>
						<input
							type="text"
							id="policyNumber"
							bind:value={policyNumber}
							class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
						/>
					</div>
					<div>
						<label
							for="startDate"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label
						>
						<input
							type="date"
							id="startDate"
							bind:value={startDate}
							class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
						/>
					</div>
					<div>
						<label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>End Date</label
						>
						<input
							type="date"
							id="endDate"
							bind:value={endDate}
							class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
						/>
					</div>
					<div class="md:col-span-2">
						<label for="cost" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Cost</label
						>
						<input
							type="number"
							id="cost"
							bind:value={cost}
							class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
						/>
					</div>
				</div>

				{#if error}
					<div class="mt-4 text-red-600 dark:text-red-400" role="alert">
						{error}
					</div>
				{/if}

				{#if success}
					<div class="mt-4 text-green-600 dark:text-green-400" role="alert">
						{success}
					</div>
				{/if}

				<div class="mt-8 flex justify-end gap-4">
					<button
						type="button"
						on:click={closeModal}
						class="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
						>Cancel</button
					>
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button
					>
				</div>
			</form>
		</div>
	</div>
{/if}

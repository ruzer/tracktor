<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import InsuranceFormComponent from './InsuranceFormComponent.svelte';

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

	let insurance = {
		provider: '',
		policyNumber: '',
		startDate: '',
		endDate: '',
		cost: null
	};

	let error = '';
	let success = '';

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (initialData) {
			insurance = {
				...initialData,
				startDate: initialData.startDate
					? new Date(initialData.startDate).toISOString().split('T')[0]
					: '',
				endDate: initialData.endDate
					? new Date(initialData.endDate).toISOString().split('T')[0]
					: ''
			};
		}
	});

	async function saveInsurance() {
		error = '';
		success = '';

		if (
			!insurance.provider ||
			!insurance.policyNumber ||
			!insurance.startDate ||
			!insurance.endDate ||
			!insurance.cost
		) {
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
					body: JSON.stringify(insurance)
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

			<InsuranceFormComponent
				bind:insurance
				onSubmit={saveInsurance}
				bind:error
				bind:success
				editMode={!!initialData}
				on:close={closeModal}
			/>
		</div>
	</div>
{/if}

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import PollutionCertificateFormComponent from './PollutionCertificateFormComponent.svelte';

	export let vehicleId: number | null = null;
	export let showModal: boolean = false;
	export let closeModal: () => void;
	export let initialData: {
		id?: number;
		certificateNumber: string;
		issueDate: string;
		expiryDate: string;
		testingCenter: string;
		notes?: string;
	} | null = null;

	let certificate = {
		certificateNumber: '',
		issueDate: '',
		expiryDate: '',
		testingCenter: '',
		notes: ''
	};

	let error = '';
	let success = '';

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (initialData) {
			certificate = {
				...initialData,
				issueDate: initialData.issueDate
					? new Date(initialData.issueDate).toISOString().split('T')[0]
					: '',
				expiryDate: initialData.expiryDate
					? new Date(initialData.expiryDate).toISOString().split('T')[0]
					: ''
			};
		}
	});

	async function savePollutionCertificate() {
		error = '';
		success = '';

		if (
			!certificate.certificateNumber ||
			!certificate.issueDate ||
			!certificate.expiryDate ||
			!certificate.testingCenter
		) {
			error = 'All fields are required.';
			return;
		}

		const method = initialData && initialData.id ? 'PUT' : 'POST';

		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL}/api/vehicles/${vehicleId}/pollution-certificate`,
				{
					method,
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify(certificate)
				}
			);

			if (response.ok) {
				success = `Pollution certificate ${initialData ? 'updated' : 'added'} successfully!`;
				dispatch('success');
				closeModal();
			} else {
				const data = await response.json();
				error = data.message || 'Failed to save pollution certificate.';
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
				{initialData ? 'Edit' : 'Add'} Pollution Certificate Details
			</h2>

			<PollutionCertificateFormComponent
				bind:certificate
				onSubmit={savePollutionCertificate}
				bind:error
				bind:success
				editMode={!!initialData}
				on:close={closeModal}
			/>
		</div>
	</div>
{/if}

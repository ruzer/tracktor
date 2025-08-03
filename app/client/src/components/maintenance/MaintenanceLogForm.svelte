<script lang="ts">
	import MaintenanceLogFormComponent from './MaintenanceLogFormComponent.svelte';
	import { env } from '$env/dynamic/public';
	import ModalContainer from '../../components/common/ModalContainer.svelte';

	const { vehicleId, showModal, closeModal, initialData, onSuccess } = $props();

	let log = {
		date: '',
		odometer: null,
		service: '',
		cost: null,
		notes: ''
	};

	let error = '';
	let success = '';

	$effect(() => {
		if (initialData) {
			log = { ...initialData };
		} else {
			log = {
				date: '',
				odometer: null,
				service: '',
				cost: null,
				notes: ''
			};
		}
	});

	async function handleSubmit() {
		error = '';
		success = '';

		if (!log.date || !log.odometer || !log.service || !log.cost) {
			error = 'Date, Odometer, Service, and Cost are required.';
			return;
		}

		const method = initialData && initialData.id ? 'PUT' : 'POST';
		const urlPath =
			initialData && initialData.id
				? `/api/maintenance-logs/${initialData.id}`
				: `/api/vehicles/${vehicleId}/maintenance-logs`;

		try {
			const response = await fetch(`${env.PUBLIC_API_BASE_URL || ''}${urlPath}`, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'X-User-PIN': localStorage.getItem('userPin') || ''
				},
				body: JSON.stringify(log)
			});

			if (response.ok) {
				success = `Maintenance log ${method === 'POST' ? 'added' : 'updated'} successfully!`;
				onSuccess();
				closeModal();
			} else {
				const data = await response.json();
				error =
					data.message || `Failed to ${method === 'POST' ? 'add' : 'update'} maintenance log.`;
			}
		} catch (e) {
			error = 'Failed to connect to the server.';
		}
	}
</script>

{#if showModal}
	<ModalContainer
		onclose={closeModal}
		title={initialData ? 'Edit Maintenance Log' : 'Add Maintenance Log'}
	>
		<MaintenanceLogFormComponent
			bind:log
			onSubmit={handleSubmit}
			bind:error
			bind:success
			editMode={!!initialData}
			on:close={closeModal}
		/>
	</ModalContainer>
{/if}

<script lang="ts">
	import {
		Car,
		Calendar1,
		IdCard,
		Fingerprint,
		Paintbrush,
		Gauge,
		Building2
	} from '@lucide/svelte';
	import FormField from '../common/FormField.svelte';
	import type { NewVehicle, Vehicle } from '$lib/models/vehicle';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import FormSubmitButton from '$components/common/FormSubmitButton.svelte';
	import { simulateNetworkDelay } from '$lib/utils/dev';
	import { vehiclesStore } from '$lib/stores/vehicle';
	import { browser } from '$app/environment';

	let { vehicleToEdit = null, editMode = false, modalVisibility = $bindable(), loading } = $props();

	const vehicle: NewVehicle = $state({
		make: '',
		model: '',
		year: null,
		licensePlate: '',
		vin: '',
		color: '',
		odometer: null
	});

	let status = $state<{
		message: string | null;
		type: 'ERROR' | 'SUCCESS' | null;
	}>({
		message: null,
		type: null
	});

	$effect(() => {
		if (vehicleToEdit) {
			Object.assign(vehicle, vehicleToEdit);
		}
	});

	async function persistVehicle() {
		if (!vehicle.make || !vehicle.model || !vehicle.year || !vehicle.licensePlate) {
			status.message = 'Please fill in all required fields.';
			status.type = 'ERROR';
			return;
		}
		try {
			if (loading) return; // Prevent multiple submissions
			loading = true;
			status.message = null;
			status.type = null;
			// await simulateNetworkDelay(2000); // Simulate network delay for development
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${editMode ? vehicleToEdit.id : ''}`,
				{
					method: editMode ? 'PUT' : 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify(vehicle)
				}
			);

			if (response.ok) {
				status.message = `Vehicle ${editMode ? 'updated' : 'added'} successfully!`;
				status.type = 'SUCCESS';
				Object.assign(vehicle, {
					make: '',
					model: '',
					year: null,
					licensePlate: '',
					vin: '',
					color: '',
					odometer: null
				});
				modalVisibility = false;
				fetchVehicles(); // Refresh the vehicle list after closing the modal
			} else {
				const data = await response.json();
				status.message = data.message || `Failed to ${editMode ? 'update' : 'add'} vehicle.`;
				status.type = 'ERROR';
			}
		} catch (e) {
			status.message = 'Failed to connect to the server.';
			status.type = 'ERROR';
		}
		loading = false;
	}

	const fetchVehicles = () => {
		if (browser) {
			const pin = localStorage.getItem('userPin') || undefined;
			if (pin) vehiclesStore.fetchVehicles(pin);
		}
	};
</script>

<form
	onsubmit={(e) => {
		persistVehicle();
		e.preventDefault();
	}}
	class="space-y-6"
>
	<FormField
		id="make"
		type="text"
		placeholder="Make"
		bind:value={vehicle.make}
		icon={Building2}
		required={true}
		ariaLabel="Vehicle Make"
	/>
	<FormField
		id="model"
		type="text"
		placeholder="Model"
		bind:value={vehicle.model}
		icon={Car}
		required={true}
		ariaLabel="Vehicle Model"
	/>
	<FormField
		id="year"
		type="number"
		placeholder="Year"
		bind:value={vehicle.year}
		icon={Calendar1}
		required={true}
		ariaLabel="Vehicle Year"
	/>
	<FormField
		id="licensePlate"
		type="text"
		placeholder="License Plate"
		bind:value={vehicle.licensePlate}
		icon={IdCard}
		required={true}
		ariaLabel="License Plate"
	/>
	<FormField
		id="vin"
		type="text"
		placeholder="VIN (Optional)"
		bind:value={vehicle.vin}
		icon={Fingerprint}
		ariaLabel="VIN (Optional)"
	/>
	<FormField
		id="color"
		type="text"
		placeholder="Color (Optional)"
		bind:value={vehicle.color}
		icon={Paintbrush}
		ariaLabel="Color (Optional)"
	/>
	<FormField
		id="odometer"
		type="number"
		placeholder="Odometer (Optional)"
		bind:value={vehicle.odometer}
		icon={Gauge}
		ariaLabel="Odometer (Optional)"
	/>
	<FormSubmitButton text={editMode ? 'Save Vehicle' : 'Add Vehicle'} {loading} />

	{#if editMode}
		<input type="hidden" name="id" value={vehicleToEdit?.id || ''} />
	{/if}
</form>
{#if status.message}
	<p
		class={`mt-4 text-center text-sm ${status.type === 'ERROR' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}
	>
		{#if status.type === 'ERROR'}
			<span class="font-semibold">Error:</span> {status.message}
		{:else}
			{status.message}
		{/if}
	</p>
{/if}

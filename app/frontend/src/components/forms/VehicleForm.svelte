<script lang="ts">
	import { Car, Calendar1, IdCard, Fingerprint, Gauge, Building2, Cog, Fuel } from '@lucide/svelte';
	import FormField from '../common/FormField.svelte';
	import type { NewVehicle, VehicleStatus } from '$lib/models/vehicle';
	import { env } from '$env/dynamic/public';
	import { vehiclesStore } from '$lib/stores/vehicle';
	import { browser } from '$app/environment';
	import Button from '$components/common/Button.svelte';
	import StatusBlock from '$components/common/StatusBlock.svelte';
	import type { Status } from '$lib/models/status';
	import { handleApiError, type ApiError } from '$lib/models/Error';
	import { cleanup, getDistanceUnit, getVolumeUnit } from '$lib/utils/formatting';
	import { t } from '$lib/stores/i18n';
	import ColorPicker from '../common/ColorPicker.svelte';

	let { vehicleToEdit = null, editMode = false, modalVisibility = $bindable(), loading } = $props();

	const vehicle: NewVehicle = $state({
		make: null,
		model: null,
		year: null,
		licensePlate: null,
		vin: null,
		vinNumber: null,
		engineNumber: null,
		color: null,
		odometer: null,
		tankSizeLiters: null,
		status: 'active'
	});

	let status = $state<Status>({
		message: undefined,
		type: 'INFO'
	});

	const statusOptions: { value: VehicleStatus; key: string }[] = [
		{ value: 'active', key: 'forms.options.vehicleStatus.active' },
		{ value: 'in_repair', key: 'forms.options.vehicleStatus.inRepair' },
		{ value: 'retired', key: 'forms.options.vehicleStatus.retired' }
	];

	$effect(() => {
		if (vehicleToEdit) {
			Object.assign(vehicle, vehicleToEdit);
		}
	});

	async function persistVehicle() {
		if (!vehicle.make || !vehicle.model || !vehicle.year || !vehicle.licensePlate) {
			status = {
				message: $t('forms.validation.vehicleRequired'),
				type: 'ERROR'
			};
			return;
		}
		try {
			if (loading) return; // Prevent multiple submissions
			loading = true;
			status = {
				message: undefined,
				type: 'INFO'
			};
			// await simulateNetworkDelay(2000); // Simulate network delay for development
			vehicle.vinNumber = vehicle.vinNumber || vehicle.vin || null;
			vehicle.vin = vehicle.vin || vehicle.vinNumber || null;
			if (vehicle.status === null || vehicle.status === undefined) {
				vehicle.status = 'active';
			}
			if (vehicle.tankSizeLiters !== null && vehicle.tankSizeLiters !== undefined) {
				vehicle.tankSizeLiters = Number(vehicle.tankSizeLiters);
			}
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${editMode ? vehicleToEdit.id : ''}`,
				{
					method: editMode ? 'PUT' : 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify(cleanup(vehicle))
				}
			);

			if (response.ok) {
				status = {
					message: editMode ? $t('forms.success.vehicleUpdated') : $t('forms.success.vehicleAdded'),
					type: 'SUCCESS'
				};
				Object.assign(vehicle, {
					make: '',
					model: '',
					year: null,
					licensePlate: '',
					vin: '',
					vinNumber: '',
					engineNumber: '',
					color: '',
					odometer: null,
					tankSizeLiters: null,
					status: 'active'
				});
				modalVisibility = false;
				fetchVehicles(); // Refresh the vehicle list after closing the modal
			} else {
				const data: ApiError = await response.json();
				status = handleApiError(data, editMode);
			}
		} catch (e) {
			console.error('Error persisting vehicle:', e);
			status = {
				message: $t('forms.errors.connectionFailed'),
				type: 'ERROR'
			};
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
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<FormField
			id="make"
			type="text"
			placeholder={$t('forms.placeholders.make')}
			bind:value={vehicle.make}
			icon={Building2}
			label={$t('forms.labels.make')}
			required={true}
			ariaLabel={$t('forms.labels.make')}
		/>
		<FormField
			id="model"
			type="text"
			placeholder={$t('forms.placeholders.model')}
			bind:value={vehicle.model}
			icon={Car}
			label={$t('forms.labels.model')}
			required={true}
			ariaLabel={$t('forms.labels.model')}
		/>
	</div>
	<div class="grid grid-flow-row grid-cols-2 gap-4">
		<FormField
			id="year"
			type="number"
			placeholder={$t('forms.placeholders.year')}
			bind:value={vehicle.year}
			icon={Calendar1}
			label={$t('forms.labels.year')}
			required={true}
			ariaLabel={$t('forms.labels.year')}
		/>
		<!-- Reemplazar el FormField de color con: -->
		<ColorPicker
			bind:value={vehicle.color}
			label={$t('forms.labels.color')}
			required
			on:change={(e) => (vehicle.color = e.detail)}
		/>
	</div>

	<FormField
		id="licensePlate"
		type="text"
		placeholder={$t('forms.placeholders.licensePlate')}
		bind:value={vehicle.licensePlate}
		icon={IdCard}
		label={$t('forms.labels.licensePlate')}
		required={true}
		ariaLabel={$t('forms.labels.licensePlate')}
	/>
	<FormField
		id="vinNumber"
		type="text"
		placeholder={$t('forms.placeholders.vinNumber')}
		bind:value={vehicle.vinNumber}
		onInput={() => (vehicle.vin = vehicle.vinNumber)}
		icon={Fingerprint}
		label={$t('forms.labels.vinNumber')}
		ariaLabel={$t('forms.labels.vinNumber')}
	/>

	<div class="grid grid-flow-row grid-cols-2 gap-4">
		<FormField
			id="engineNumber"
			type="text"
			placeholder={$t('forms.placeholders.engineNumber')}
			bind:value={vehicle.engineNumber}
			icon={Cog}
			label={$t('forms.labels.engineNumber')}
			ariaLabel={$t('forms.labels.engineNumber')}
		/>
		<FormField
			id="tankSize"
			type="number"
			placeholder={`${$t('forms.placeholders.tankSizeLiters')} (${getVolumeUnit()})`}
			bind:value={vehicle.tankSizeLiters}
			icon={Fuel}
			label={$t('forms.labels.tankSizeLiters')}
			ariaLabel={$t('forms.labels.tankSizeLiters')}
		/>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div>
			<label for="vehicle-status" class="pl-2 text-lg text-gray-400"
				>{$t('forms.labels.vehicleStatus')}</label
			>
			<div class="relative">
				<select
					id="vehicle-status"
					bind:value={vehicle.status}
					class="w-full rounded-xl border border-gray-300 bg-white py-3 pr-10 pl-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
				>
					{#each statusOptions as option}
						<option value={option.value}>{$t(option.key)}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<FormField
		id="odometer"
		type="number"
		placeholder={`${$t('forms.placeholders.odometerReading')} ( ${getDistanceUnit()} )`}
		bind:value={vehicle.odometer}
		icon={Gauge}
		label={$t('forms.labels.odometer')}
		ariaLabel={$t('forms.labels.odometer')}
	/>
	<Button
		type="submit"
		variant="primary"
		text={editMode ? $t('forms.buttons.update') : $t('forms.buttons.add')}
	/>

	{#if editMode}
		<input type="hidden" name="id" value={vehicleToEdit?.id || ''} />
	{/if}
</form>
<StatusBlock message={status.message} type={status.type} />

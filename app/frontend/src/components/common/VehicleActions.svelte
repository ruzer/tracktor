<script lang="ts">
	import type { Vehicle } from '$lib/models/vehicle';
	import { BadgeCheck, Eye, Fuel, Pencil, Shield, Trash2, Wrench } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import IconButton from '$components/common/IconButton.svelte';
	import DeleteConfirmation from '$components/common/DeleteConfirmation.svelte';
	import { fuelLogModelStore } from '$lib/stores/fuel-log';
	import { maintenanceModelStore } from '$lib/stores/maintenance';
	import { insuranceModelStore } from '$lib/stores/insurance';
	import { puccModelStore } from '$lib/stores/pucc';
	import { vehicleModelStore, vehiclesStore } from '$lib/stores/vehicle';
	import { t } from '$lib/stores/i18n';

	const {
		vehicle,
		updateCallback = () => {},
		dense = false
	}: {
		vehicle: Vehicle;
		updateCallback?: (status: boolean) => void;
		dense?: boolean;
	} = $props();

let deleteDialog = $state(false);
let currentPath = $derived(page.url.pathname);
const isDetailView = $derived(currentPath.startsWith('/vehicles/'));

const groupSpacing = dense ? 'gap-2' : 'gap-3';
const buttonSpacing = dense ? 'gap-1' : 'gap-2';

	const fetchVehicles = () => {
		if (browser) {
			const pin = localStorage.getItem('userPin') || undefined;
			if (pin) vehiclesStore.fetchVehicles(pin);
		}
	};

	const openDetail = () => {
		goto(`/vehicles/${vehicle.id}`);
	};

	async function deleteVehicle(vehicleId: string) {
		try {
			const response = await fetch(`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}`, {
				method: 'DELETE',
				headers: {
					'X-User-PIN': localStorage.getItem('userPin') || ''
				}
			});
			if (response.ok) {
				alert($t('vehicle.deleteSuccess'));
				vehicleModelStore.hide();
				fetchVehicles();
				updateCallback(true);
			} else {
				const data = await response.json();
				alert(data.message || $t('vehicle.deleteError'));
			}
		} catch (e) {
			console.log(e);
			alert($t('vehicle.connectionError'));
		}
	}
</script>

<div class={`flex flex-col ${groupSpacing} sm:flex-row sm:items-center sm:justify-between`}>
	<div class={`flex ${buttonSpacing}`}>
	{#if !isDetailView}
		<IconButton
			buttonStyles="hover:bg-blue-100 dark:hover:bg-blue-700"
			iconStyles=" text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-200"
			icon={Eye}
			onclick={openDetail}
			ariaLabel={$t('vehicle.viewDetails')}
		/>
	{/if}
		<IconButton
			buttonStyles="hover:bg-green-100 dark:hover:bg-green-700"
			iconStyles=" text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-200"
			icon={Fuel}
			onclick={() => fuelLogModelStore.show(vehicle.id, null, false, updateCallback)}
			ariaLabel={$t('vehicle.logFuel')}
		/>
		<IconButton
			buttonStyles="hover:bg-amber-100 dark:hover:bg-amber-700"
			iconStyles=" text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-200"
			icon={Wrench}
			onclick={() => maintenanceModelStore.show(vehicle.id, null, false, updateCallback)}
			ariaLabel={$t('navigation.maintenance')}
		/>
		<IconButton
			buttonStyles="hover:bg-sky-100 dark:hover:bg-sky-700"
			iconStyles=" text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-200"
			icon={Shield}
			onclick={() => insuranceModelStore.show(vehicle.id, null, false, updateCallback)}
			ariaLabel={$t('navigation.insurance')}
		/>
		<IconButton
			buttonStyles="hover:bg-fuchsia-100 dark:hover:bg-fuchsia-700"
			iconStyles=" text-fuchsia-500 hover:text-fuchsia-600 dark:text-fuchsia-400 dark:hover:text-fuchsia-200"
			icon={BadgeCheck}
			onclick={() => puccModelStore.show(vehicle.id, null, false, updateCallback)}
			ariaLabel={$t('navigation.pollutionCertificate')}
		/>
	</div>
	<div class={`flex ${buttonSpacing}`}>
		<IconButton
			buttonStyles="hover:bg-gray-200 dark:hover:bg-gray-700"
			iconStyles="text-gray-600 dark:text-gray-100 hover:text-sky-500"
			icon={Pencil}
			onclick={() => {
				vehicleModelStore.show(vehicle, true);
			}}
			ariaLabel={$t('common.edit')}
		/>
		<IconButton
			buttonStyles="hover:bg-gray-200 dark:hover:bg-gray-700"
			iconStyles="text-gray-600 dark:text-gray-100 hover:text-red-500"
			icon={Trash2}
			onclick={() => (deleteDialog = true)}
			ariaLabel={$t('common.delete')}
		/>
	</div>
</div>
<DeleteConfirmation onConfirm={() => deleteVehicle(vehicle.id)} bind:open={deleteDialog} />

<script lang="ts">
	import { LayoutGrid, PlusCircle, Rows, Search } from '@lucide/svelte';
	import FuelLogModal from '$components/modals/FuelLogModal.svelte';
	import VehicleModal from '$components/modals/VehicleModal.svelte';
	import VehicleList from '$components/lists/VehicleList.svelte';
	import type { Vehicle } from '$lib/models/vehicle';
	import { Jumper } from 'svelte-loading-spinners';
	import MaintenanceLogModal from '$components/modals/MaintenanceLogModal.svelte';
	import TabHeader from '$components/tabs/TabHeader.svelte';
	import DashboardTab from '$components/tabs/DashboardTab.svelte';
	import FuelLogTab from '$components/tabs/FuelLogTab.svelte';
	import MaintenenceLogTab from '$components/tabs/MaintenenceLogTab.svelte';
	import InsuranceTab from '$components/tabs/InsuranceTab.svelte';
	import PollutionTab from '$components/tabs/PollutionTab.svelte';
	import PlatesTab from '$components/tabs/PlatesTab.svelte';
	import AssignmentsTab from '$components/tabs/AssignmentsTab.svelte';
	import TaxesTab from '$components/tabs/TaxesTab.svelte';
	import { vehicleModelStore, vehiclesStore } from '$lib/stores/vehicle';
	import PollutionCertificateModal from '$components/modals/PollutionCertificateModal.svelte';
	import InsuranceModal from '$components/modals/InsuranceModal.svelte';
	import { browser } from '$app/environment';
	import ConfigModal from '$components/modals/ConfigModal.svelte';
	import Button from '$components/common/Button.svelte';
	import { t } from '$lib/stores/i18n';
	import { onDestroy } from 'svelte';

	let vehicles = $state<Vehicle[]>([]);
	let loading = $state(true);
	let error = $state('');

	let selectedVehicleId = $state<string | undefined>(undefined);

	let activeTab = $state('dashboard');
	let viewMode = $state<'grid' | 'list'>('grid');
	let searchTerm = $state('');
	let searchTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

	vehiclesStore.subscribe((data) => {
		vehicles = data.vehicles;
		loading = data.loading;
		error = data.error;
		selectedVehicleId = data.selectedVehicleId;
		viewMode = data.viewMode;
		searchTerm = data.search;
		if (vehicles.length > 0) {
			selectedVehicleId = selectedVehicleId || vehicles[0].id;
		} else {
			selectedVehicleId = undefined;
		}
	});

	function updateCallback(status: boolean) {
		if (status) {
			fetchVehicles();
		}
	}

	const fetchVehicles = (search?: string) => {
		if (browser) {
			const pin = localStorage.getItem('userPin') || undefined;
			if (pin) vehiclesStore.fetchVehicles(pin, search);
		}
	};

	function changeViewMode(mode: 'grid' | 'list') {
		viewMode = mode;
		vehiclesStore.setViewMode(mode);
	}

	function handleSearchInput(event: Event) {
		const value = (event.currentTarget as HTMLInputElement).value;
		searchTerm = value;
		vehiclesStore.setSearch(value);
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			fetchVehicles(value);
		}, 300);
	}

	function clearSearch() {
		searchTerm = '';
		vehiclesStore.setSearch('');
		if (searchTimeout) {
			clearTimeout(searchTimeout);
			searchTimeout = undefined;
		}
		fetchVehicles('');
	}

	onDestroy(() => {
		if (searchTimeout) clearTimeout(searchTimeout);
	});

	fetchVehicles();
</script>

<div class="container mx-auto bg-gray-100 p-6 transition-colors dark:bg-gray-900">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
			{$t('dashboard.title')}
		</h1>
		<Button
			type="button"
			variant="hero"
			text={$t('dashboard.addVehicle')}
			icon={PlusCircle}
			onclick={() => vehicleModelStore.show()}
		/>
	</div>
	<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div class="flex w-full flex-col gap-3 md:flex-row md:items-center">
			<div class="relative w-full md:max-w-md">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
				/>
				<input
					type="search"
					class="w-full rounded-full border border-gray-300 bg-white py-2 pr-12 pl-11 text-sm text-gray-700 shadow-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900"
					placeholder={$t('vehicle.searchPlaceholder')}
					value={searchTerm}
					oninput={handleSearchInput}
				/>
				{#if searchTerm}
					<button
						type="button"
						class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
						onclick={clearSearch}
					>
						{$t('common.clear')}
					</button>
				{/if}
			</div>
		</div>
		<div class="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
			<div
				class="flex items-center rounded-full border border-gray-300 bg-white p-1 shadow-sm dark:border-gray-600 dark:bg-gray-800"
			>
				<button
					type="button"
					class={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
						viewMode === 'grid'
							? 'bg-blue-600 text-white shadow'
							: 'text-gray-600 hover:text-blue-600 dark:text-gray-300'
					}`}
					onclick={() => changeViewMode('grid')}
					aria-pressed={viewMode === 'grid'}
				>
					<LayoutGrid class="h-4 w-4" />
					{$t('vehicle.view.grid')}
				</button>
				<button
					type="button"
					class={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
						viewMode === 'list'
							? 'bg-blue-600 text-white shadow'
							: 'text-gray-600 hover:text-blue-600 dark:text-gray-300'
					}`}
					onclick={() => changeViewMode('list')}
					aria-pressed={viewMode === 'list'}
				>
					<Rows class="h-4 w-4" />
					{$t('vehicle.view.list')}
				</button>
			</div>
		</div>
	</div>
	{#if loading}
		<p class="flex items-center justify-center gap-5 text-lg text-gray-500 dark:text-gray-400">
			<Jumper size="40" color="#155dfc" unit="px" duration="2s" />
			{$t('dashboard.loadingVehicles')}
		</p>
	{:else if error}
		<p class="text-lg text-red-500 dark:text-red-400">{$t('common.error')}: {error}</p>
	{:else}
		<VehicleList {vehicles} {selectedVehicleId} {updateCallback} {viewMode} />
	{/if}

	{#if selectedVehicleId}
		<div class="mt-12">
			<div class="mb-4 border-b border-gray-200 dark:border-gray-700">
				<TabHeader bind:activeTab />
			</div>
			<div id="default-tab-content">
				{#if activeTab === 'dashboard'}
					<DashboardTab vehicleId={selectedVehicleId} />
				{:else if activeTab === 'fuel'}
					<FuelLogTab vehicleId={selectedVehicleId} />
				{:else if activeTab === 'maintenance'}
					<MaintenenceLogTab vehicleId={selectedVehicleId} />
				{:else if activeTab === 'insurance'}
					<InsuranceTab vehicleId={selectedVehicleId} />
				{:else if activeTab === 'pollution'}
					<PollutionTab vehicleId={selectedVehicleId} />
				{:else if activeTab === 'plates'}
					<PlatesTab vehicleId={selectedVehicleId} />
				{:else if activeTab === 'assignments'}
					<AssignmentsTab vehicleId={selectedVehicleId} />
				{:else if activeTab === 'taxes'}
					<TaxesTab vehicleId={selectedVehicleId} />
				{/if}
			</div>
		</div>
	{:else if vehicles.length > 0 && !loading}
		<div class="py-12 text-center">
			<p class="text-lg text-gray-500 dark:text-gray-400">
				{$t('dashboard.selectVehicle')}
			</p>
		</div>
	{/if}

	<VehicleModal />
	<FuelLogModal />
	<MaintenanceLogModal />
	<PollutionCertificateModal />
	<InsuranceModal />
	<ConfigModal />
</div>

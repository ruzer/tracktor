<script lang="ts">
	import { onMount } from 'svelte';
	import { Line } from 'svelte5-chartjs';
	import { Chart, registerables } from 'chart.js';
	import { Plus } from '@lucide/svelte';
	import { env } from '$env/dynamic/public';
	import ChartCard from '$components/chart/ChartCard.svelte';
	import FuelLogModal from '$components/fuel/FuelLogModal.svelte';
	import FuelLogList from '$components/fuel/FuelLogList.svelte';
	import InsuranceDetails from '$components/insurance/InsuranceDetails.svelte';
	import MaintenanceLogForm from '$components/maintenance/MaintenanceLogForm.svelte';
	import MaintenanceLogList from '$components/maintenance/MaintenanceLogList.svelte';
	import PollutionCertificateDetails from '$components/pucc/PollutionCertificateDetails.svelte';
	import VehicleModal from '$components/vehicle/VehicleModal.svelte';
	import VehicleList from '$components/vehicle/VehicleList.svelte';
	import { config } from '$lib/states/config';
	import dayjs from 'dayjs';
	import type { NewVehicle, Vehicle } from '$lib/models/vehicle';
	import { darkModeStore } from '$lib/states/dark-mode';
	import { formatDate, getCurrencySymbol, getMileageUnit } from '$lib/utils/formatting';
	import { Jumper } from 'svelte-loading-spinners';
	import { simulateNetworkDelay } from '$lib/utils/dev';

	$effect(() => {
		Chart.register(...registerables);
	});

	let vehicles = $state<Vehicle[]>([]);
	let loading = $state(true);
	let error = $state('');

	let showVehicleModal = $state(false);
	let vehicleToEdit = $state<Vehicle | null>(null);

	let selectedVehicleId = $state<string | null>(null);

	let fuelCostData: any = $state({});
	let mileageData: any = $state({});

	let showFuelRefillModal = $state(false);
	let showMaintenanceLogModal = $state(false);
	let activeTab = $state('dashboard');

	// Dark mode chart options
	let isDarkMode = $state(false);
	darkModeStore.subscribe((isDarkMode) => {
		isDarkMode = isDarkMode;
	});
	let chartOptions = $derived({});

	function handleVehicleSelect(vehicleId: string) {
		selectedVehicleId = vehicleId;
		fetchChartData(selectedVehicleId);
	}

	$effect(() => {
		chartOptions = {
			responsive: true,
			cubicInterpolationMode: 'monotone',
			plugins: {
				legend: {
					labels: {
						color: isDarkMode ? '#e5e7eb' : '#374151' // Tailwind gray-200 or gray-700
					}
				}
			},
			scales: {
				x: {
					ticks: { color: isDarkMode ? '#e5e7eb' : '#374151' },
					grid: { color: isDarkMode ? '#374151' : '#e5e7eb' }
				},
				y: {
					ticks: { color: isDarkMode ? '#e5e7eb' : '#374151' },
					grid: { color: isDarkMode ? '#374151' : '#e5e7eb' }
				}
			}
		};
	});

	async function fetchVehicles() {
		loading = true;
		// await simulateNetworkDelay(2000); // Simulate network delay for development
		error = '';
		try {
			const response = await fetch(`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles`, {
				headers: {
					'X-User-PIN': localStorage.getItem('userPin') || ''
				}
			});
			if (response.ok) {
				vehicles = await response.json();
			} else {
				console.log('Failed to fetch vehicles', response);
				const data = await response.json();
				error = data.message || 'Failed to fetch vehicles.';
			}
		} catch (e) {
			console.error('Failed to connect to the server.', e);
			error = 'Failed to connect to the server.';
		}
		loading = false;
	}

	function openAddVehicleModal() {
		showVehicleModal = true;
	}

	function handleEditVehicle(vehicle: Vehicle) {
		vehicleToEdit = vehicle;
		showVehicleModal = true;
	}

	function handleDeleteVehicle(vehicle: Vehicle) {
		if (confirm('Are you sure you want to delete this vehicle?')) {
			deleteVehicle(vehicle.id);
		}
	}

	async function deleteVehicle(vehicleId: string) {
		try {
			const response = await fetch(`http://localhost:3000/api/vehicles/${vehicleId}`, {
				method: 'DELETE',
				headers: {
					'X-User-PIN': localStorage.getItem('userPin') || ''
				}
			});
			if (response.ok) {
				await fetchVehicles();
				if (vehicles.length > 0) {
					selectedVehicleId = vehicles[0].id;
					fetchChartData(selectedVehicleId);
				}
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to delete vehicle.');
			}
		} catch (e) {
			alert('Failed to connect to the server.');
		}
	}

	onMount(async () => {
		await fetchVehicles();
		if (vehicles.length > 0) {
			selectedVehicleId = vehicles[0].id;
			fetchChartData(selectedVehicleId);
		}
	});

	async function fetchChartData(vehicleId: string) {
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/fuel-logs`,
				{
					headers: {
						'X-User-PIN': localStorage.getItem('userPin') || ''
					}
				}
			);
			if (response.ok) {
				const data = await response.json();
				const labels = data.map((log: any) => formatDate(log.date));
				const costData = data.map((log: any) => log.cost);
				const mileageDataPoints = data.map((log: any) => log.mileage);

				fuelCostData = {
					labels,
					datasets: [
						{
							label: `Fuel Cost (${getCurrencySymbol()})`,
							data: costData,
							fill: true,
							borderColor: 'rgb(75, 192, 192)',
							tension: 0.1
						}
					]
				};

				mileageData = {
					labels,
					datasets: [
						{
							label: `Mileage (${getMileageUnit()})`,
							data: mileageDataPoints,
							fill: true,
							borderColor: 'rgb(255, 99, 132)',
							tension: 0.1
						}
					]
				};
			} else {
				console.error('Failed to fetch chart data');
			}
		} catch (e) {
			console.error('Failed to connect to the server.');
		}
	}
</script>

<div class="container mx-auto bg-gray-100 p-6 transition-colors dark:bg-gray-900">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Your Vehicles</h1>
		<button
			type="button"
			class="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-blue-600 bg-transparent px-3 py-1 text-lg font-semibold text-blue-600 shadow-md dark:text-blue-200"
			onclick={openAddVehicleModal}
		>
			<Plus class="h-5 w-5 text-blue-600 dark:text-blue-200" />
			Add Vehicle
		</button>
	</div>
	{#if loading}
		<p class="flex items-center justify-center gap-5 text-lg text-gray-500 dark:text-gray-400">
			<Jumper size="40" color="#155dfc" unit="px" duration="2s" />
			Loading Vehicles...
		</p>
	{:else if error}
		<p class="text-lg text-red-500 dark:text-red-400">Error: {error}</p>
	{:else}
		<VehicleList
			{vehicles}
			{selectedVehicleId}
			onVehicleSelect={handleVehicleSelect}
			onEditVehicle={handleEditVehicle}
			onDeleteVehicle={handleDeleteVehicle}
			onRefillFuel={(vehicle: Vehicle) => {
				selectedVehicleId = vehicle.id;
				showFuelRefillModal = true;
			}}
			onAddMaintenance={(vehicle: Vehicle) => {
				selectedVehicleId = vehicle.id;
				showMaintenanceLogModal = true;
			}}
		/>
	{/if}

	<VehicleModal {vehicleToEdit} {loading} bind:showModal={showVehicleModal} />

	{#if selectedVehicleId}
		<div class="mt-12">
			<div class="mb-4 border-b border-gray-200 dark:border-gray-700">
				<ul
					class="-mb-px flex flex-wrap"
					id="default-tab"
					role="tablist"
					aria-orientation="horizontal"
				>
					<li class="me-2" role="presentation">
						<button
							class="inline-block rounded-t-lg px-4 py-2 text-sm font-medium"
							class:text-blue-600={activeTab === 'dashboard'}
							class:border-blue-600={activeTab === 'dashboard'}
							class:hover:text-gray-600={activeTab !== 'dashboard'}
							class:hover:border-gray-300={activeTab !== 'dashboard'}
							class:dark:text-blue-500={activeTab === 'dashboard'}
							class:dark:border-blue-500={activeTab === 'dashboard'}
							class:dark:hover:text-gray-300={activeTab !== 'dashboard'}
							class:border-transparent={activeTab !== 'dashboard'}
							class:text-gray-500={activeTab !== 'dashboard'}
							class:dark:text-gray-400={activeTab !== 'dashboard'}
							onclick={() => (activeTab = 'dashboard')}
							type="button"
							role="tab"
							aria-controls="dashboard"
							aria-selected={activeTab === 'dashboard'}>Dashboard</button
						>
					</li>
					<li class="me-2" role="presentation">
						<button
							class="inline-block rounded-t-lg px-4 py-2 text-sm font-medium"
							class:text-blue-600={activeTab === 'fuel'}
							class:border-blue-600={activeTab === 'fuel'}
							class:hover:text-gray-600={activeTab !== 'fuel'}
							class:hover:border-gray-300={activeTab !== 'fuel'}
							class:dark:text-blue-500={activeTab === 'fuel'}
							class:dark:border-blue-500={activeTab === 'fuel'}
							class:dark:hover:text-gray-300={activeTab !== 'fuel'}
							class:border-transparent={activeTab !== 'fuel'}
							class:text-gray-500={activeTab !== 'fuel'}
							class:dark:text-gray-400={activeTab !== 'fuel'}
							onclick={() => (activeTab = 'fuel')}
							type="button"
							role="tab"
							aria-controls="fuel-logs"
							aria-selected={activeTab === 'fuel'}>Fuel Logs</button
						>
					</li>
					<li class="me-2" role="presentation">
						<button
							class="inline-block rounded-t-lg px-4 py-2 text-sm font-medium"
							class:text-blue-600={activeTab === 'maintenance'}
							class:border-blue-600={activeTab === 'maintenance'}
							class:hover:text-gray-600={activeTab !== 'maintenance'}
							class:hover:border-gray-300={activeTab !== 'maintenance'}
							class:dark:text-blue-500={activeTab === 'maintenance'}
							class:dark:border-blue-500={activeTab === 'maintenance'}
							class:dark:hover:text-gray-300={activeTab !== 'maintenance'}
							class:border-transparent={activeTab !== 'maintenance'}
							class:text-gray-500={activeTab !== 'maintenance'}
							class:dark:text-gray-400={activeTab !== 'maintenance'}
							onclick={() => (activeTab = 'maintenance')}
							type="button"
							role="tab"
							aria-controls="maintenance-logs"
							aria-selected={activeTab === 'maintenance'}>Maintenance</button
						>
					</li>
					<li class="me-2" role="presentation">
						<button
							class="inline-block rounded-t-lg px-4 py-2 text-sm font-medium"
							class:text-blue-600={activeTab === 'insurance'}
							class:border-blue-600={activeTab === 'insurance'}
							class:hover:text-gray-600={activeTab !== 'insurance'}
							class:hover:border-gray-300={activeTab !== 'insurance'}
							class:dark:text-blue-500={activeTab === 'insurance'}
							class:dark:border-blue-500={activeTab === 'insurance'}
							class:dark:hover:text-gray-300={activeTab !== 'insurance'}
							class:border-transparent={activeTab !== 'insurance'}
							class:text-gray-500={activeTab !== 'insurance'}
							class:dark:text-gray-400={activeTab !== 'insurance'}
							onclick={() => (activeTab = 'insurance')}
							type="button"
							role="tab"
							aria-controls="insurance-details"
							aria-selected={activeTab === 'insurance'}>Insurance</button
						>
					</li>
					<li class="me-2" role="presentation">
						<button
							class="inline-block rounded-t-lg px-4 py-2 text-sm font-medium"
							class:text-blue-600={activeTab === 'pollution'}
							class:border-blue-600={activeTab === 'pollution'}
							class:hover:text-gray-600={activeTab !== 'pollution'}
							class:hover:border-gray-300={activeTab !== 'pollution'}
							class:dark:text-blue-500={activeTab === 'pollution'}
							class:dark:border-blue-500={activeTab === 'pollution'}
							class:dark:hover:text-gray-300={activeTab !== 'pollution'}
							class:border-transparent={activeTab !== 'pollution'}
							class:text-gray-500={activeTab !== 'pollution'}
							class:dark:text-gray-400={activeTab !== 'pollution'}
							onclick={() => (activeTab = 'pollution')}
							type="button"
							role="tab"
							aria-controls="pollution-certificate"
							aria-selected={activeTab === 'pollution'}>Pollution Certificate</button
						>
					</li>
				</ul>
			</div>
			<div id="default-tab-content">
				{#if activeTab === 'dashboard'}
					<div
						class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
						role="tabpanel"
						aria-labelledby="dashboard-tab"
					>
						<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
							Fuel Cost & Mileage Trends
						</h2>
						<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
							{#if fuelCostData?.datasets?.length > 0 && mileageData?.datasets?.length > 0}
								<ChartCard
									title="Fuel Cost Over Time"
									chartData={fuelCostData}
									ChartComponent={Line}
									options={chartOptions}
								/>
								<ChartCard
									title="Mileage Over Time"
									chartData={mileageData}
									ChartComponent={Line}
									options={chartOptions}
								/>
							{:else}
								<div class="col-span-2 py-12 text-center">
									<p class="text-lg text-gray-500 dark:text-gray-400">
										No fuel or mileage data available for this vehicle.
									</p>
								</div>
							{/if}
						</div>
					</div>
				{:else if activeTab === 'fuel'}
					<div
						class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
						role="tabpanel"
						aria-labelledby="fuel-logs-tab"
					>
						<FuelLogList vehicleId={selectedVehicleId} />
					</div>
				{:else if activeTab === 'maintenance'}
					<div
						class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
						role="tabpanel"
						aria-labelledby="maintenance-logs-tab"
					>
						<MaintenanceLogList vehicleId={selectedVehicleId} />
					</div>
				{:else if activeTab === 'insurance'}
					<div
						class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
						role="tabpanel"
						aria-labelledby="insurance-details-tab"
					>
						<InsuranceDetails vehicleId={selectedVehicleId} />
					</div>
				{:else if activeTab === 'pollution'}
					<div
						class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
						role="tabpanel"
						aria-labelledby="pollution-certificate-tab"
					>
						<PollutionCertificateDetails vehicleId={selectedVehicleId} />
					</div>
				{/if}
			</div>
		</div>
		<FuelLogModal vehicleId={selectedVehicleId} bind:showModal={showFuelRefillModal} {loading} />
		<MaintenanceLogForm
			initialData={{ vehicleId: selectedVehicleId }}
			vehicleId={selectedVehicleId}
			showModal={showMaintenanceLogModal}
			closeModal={() => (showMaintenanceLogModal = false)}
			onSuccess={() => {
				showMaintenanceLogModal = false;
			}}
		/>
	{:else if vehicles.length > 0 && !loading}
		<div class="py-12 text-center">
			<p class="text-lg text-gray-500 dark:text-gray-400">
				Select a vehicle to view fuel and mileage data.
			</p>
		</div>
	{/if}
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Line } from 'svelte5-chartjs';
	import { Chart, registerables } from 'chart.js';
	import { Plus } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { derived } from 'svelte/store';
	import { env } from '$env/dynamic/public';
	import ChartCard from '../../components/chart/ChartCard.svelte';
	import FuelRefillForm from '../../components/fuel/FuelRefillForm.svelte';
	import FuelRefillList from '../../components/fuel/FuelRefillList.svelte';
	import InsuranceDetails from '../../components/insurance/InsuranceDetails.svelte';
	import MaintenanceLogForm from '../../components/maintenance/MaintenanceLogForm.svelte';
	import MaintenanceLogList from '../../components/maintenance/MaintenanceLogList.svelte';
	import PollutionCertificateDetails from '../../components/pucc/PollutionCertificateDetails.svelte';
	import AddVehicleForm from '../../components/vehicle/AddVehicleForm.svelte';
	import VehicleList from '../../components/vehicle/VehicleList.svelte';
	import { config } from '../../lib/states/config';
	import dayjs from 'dayjs';

	Chart.register(...registerables);

	interface Vehicle {
		id: number;
		make: string;
		model: string;
		year: number;
		licensePlate: string;
		vin?: string;
		color?: string;
		odometer?: number;
		insuranceStatus?: string;
		puccStatus?: string;
	}

	let vehicles = $state<Vehicle[]>([]);
	let loading = $state(true);
	let error = $state('');

	let newVehicle = $state({
		vehicleType: 'car',
		make: '',
		model: '',
		year: null,
		licensePlate: '',
		vin: '',
		color: '',
		odometer: null
	});

	let addVehicleError = $state('');
	let addVehicleSuccess = $state('');

	let showAddVehicleModal = $state(false);

	let editVehicle = $state<Vehicle | null>(null);
	let showEditVehicleModal = $state(false);

	let selectedVehicleId = $state<number | null>(null);

	function handleVehicleSelect(event: CustomEvent<{ vehicleId: number }>) {
		selectedVehicleId = event.detail.vehicleId;
		fetchChartData(selectedVehicleId);
	}

	let fuelCostData: any = $state({});
	let mileageData: any = $state({});

	let showFuelRefillModal = $state(false);
	let showMaintenanceLogModal = $state(false);
	let activeTab = $state('dashboard'); // 'dashboard', 'fuel', 'maintenance', 'insurance', 'pollution'

	// Dark mode chart options
	let isDarkMode = false;
	if (browser) {
		isDarkMode = document.documentElement.classList.contains('dark');
	}

	let chartOptions = $derived({});

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

	async function addVehicle() {
		addVehicleError = '';
		addVehicleSuccess = '';
		try {
			const response = await fetch(`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-User-PIN': localStorage.getItem('userPin') || ''
				},
				body: JSON.stringify(newVehicle)
			});

			if (response.ok) {
				addVehicleSuccess = 'Vehicle added successfully!';
				newVehicle = {
					make: '',
					model: '',
					year: null,
					licensePlate: '',
					vin: '',
					color: '',
					odometer: null
				};
				fetchVehicles();
				showAddVehicleModal = false;
			} else {
				const data = await response.json();
				addVehicleError = data.message || 'Failed to add vehicle.';
			}
		} catch (e) {
			addVehicleError = 'Failed to connect to the server.';
		}
	}

	function openAddVehicleModal() {
		addVehicleError = '';
		addVehicleSuccess = '';
		showAddVehicleModal = true;
	}

	function handleEditVehicle(event: CustomEvent<{ vehicle: Vehicle }>) {
		editVehicle = { ...event.detail.vehicle };
		showEditVehicleModal = true;
	}

	async function updateVehicle() {
		addVehicleError = '';
		addVehicleSuccess = '';
		try {
			if (!editVehicle) return;
			const response = await fetch(`http://localhost:3000/api/vehicles/${editVehicle.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'X-User-PIN': localStorage.getItem('userPin') || ''
				},
				body: JSON.stringify(editVehicle)
			});
			if (response.ok) {
				addVehicleSuccess = 'Vehicle updated successfully!';
				showEditVehicleModal = false;
				editVehicle = null;
				await fetchVehicles();
			} else {
				const data = await response.json();
				addVehicleError = data.message || 'Failed to update vehicle.';
			}
		} catch (e) {
			addVehicleError = 'Failed to connect to the server.';
		}
	}

	function handleDeleteVehicle(event: CustomEvent<{ vehicle: Vehicle }>) {
		if (confirm('Are you sure you want to delete this vehicle?')) {
			deleteVehicle(event.detail.vehicle.id);
		}
	}

	async function deleteVehicle(vehicleId: number) {
		addVehicleError = '';
		addVehicleSuccess = '';
		try {
			const response = await fetch(`http://localhost:3000/api/vehicles/${vehicleId}`, {
				method: 'DELETE',
				headers: {
					'X-User-PIN': localStorage.getItem('userPin') || ''
				}
			});
			if (response.ok) {
				addVehicleSuccess = 'Vehicle deleted successfully!';
				await fetchVehicles();
				if (selectedVehicleId === vehicleId) {
					selectedVehicleId = vehicles.length > 0 ? vehicles[0].id : null;
				}
			} else {
				const data = await response.json();
				addVehicleError = data.message || 'Failed to delete vehicle.';
			}
		} catch (e) {
			addVehicleError = 'Failed to connect to the server.';
		}
	}

	onMount(() => {
		fetchVehicles();
		if (vehicles.length > 0) {
			selectedVehicleId = vehicles[0].id;
			fetchChartData(selectedVehicleId);
		}
	});

	async function fetchChartData(vehicleId: number) {
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
				const labels = data.map((log: any) => dayjs(log.date).format($config.dateFormat));
				const costData = data.map((log: any) => log.cost);
				const mileageDataPoints = data.map((log: any) => log.mileage);

				fuelCostData = {
					labels,
					datasets: [
						{
							label: 'Fuel Cost',
							data: costData,
							fill: false,
							borderColor: 'rgb(75, 192, 192)',
							tension: 0.1
						}
					]
				};

				mileageData = {
					labels,
					datasets: [
						{
							label: 'Mileage (km/L)',
							data: mileageDataPoints,
							fill: false,
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
		<p class="text-lg text-gray-500 dark:text-gray-400">Loading vehicles...</p>
	{:else if error}
		<p class="text-lg text-red-500 dark:text-red-400">Error: {error}</p>
	{:else}
		<VehicleList
			{vehicles}
			{selectedVehicleId}
			on:vehicleSelect={handleVehicleSelect}
			on:editVehicle={handleEditVehicle}
			on:deleteVehicle={handleDeleteVehicle}
			on:refillFuel={(e) => {
				selectedVehicleId = e.detail.vehicle.id;
				showFuelRefillModal = true;
			}}
			on:addMaintenance={(e) => {
				selectedVehicleId = e.detail.vehicle.id;
				showMaintenanceLogModal = true;
			}}
		/>
	{/if}

	<AddVehicleForm
		bind:newVehicle
		bind:addVehicleError
		bind:addVehicleSuccess
		bind:showModal={showAddVehicleModal}
		{addVehicle}
	/>

	{#if showEditVehicleModal}
		<AddVehicleForm
			newVehicle={editVehicle}
			addVehicle={updateVehicle}
			{addVehicleError}
			{addVehicleSuccess}
			showModal={showEditVehicleModal}
			editMode={true}
		/>
	{/if}

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
						<FuelRefillList vehicleId={selectedVehicleId} />
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
		<FuelRefillForm
			vehicleId={selectedVehicleId}
			showModal={showFuelRefillModal}
			closeModal={() => (showFuelRefillModal = false)}
			on:success={() => {
				if (selectedVehicleId) fetchChartData(selectedVehicleId);
				showFuelRefillModal = false;
			}}
		/>
		<MaintenanceLogForm
			vehicleId={selectedVehicleId}
			showModal={showMaintenanceLogModal}
			closeModal={() => (showMaintenanceLogModal = false)}
			on:success={() => {
				showMaintenanceLogModal = false;
			}}
		/>
	{:else}
		<div class="py-12 text-center">
			<p class="text-lg text-gray-500 dark:text-gray-400">
				Select a vehicle to view fuel and mileage data.
			</p>
		</div>
	{/if}
</div>

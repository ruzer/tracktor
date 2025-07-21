<script lang="ts">
	import { onMount } from 'svelte';
	import { Line } from 'svelte5-chartjs';
	import { Chart, registerables } from 'chart.js';
	import VehicleList from '../../components/Vehicle/VehicleList.svelte';
	import AddVehicleForm from '../../components/Vehicle/AddVehicleForm.svelte';
	import ChartCard from '../../components/Chart/ChartCard.svelte';
	import FuelRefillForm from '../../components/Fuel/FuelRefillForm.svelte';
	import FuelRefillList from '../../components/Fuel/FuelRefillList.svelte';
	import MaintenanceLogForm from '../../components/Maintenance/MaintenanceLogForm.svelte';
	import MaintenanceLogList from '../../components/Maintenance/MaintenanceLogList.svelte';
	import InsuranceForm from '../../components/Insurance/InsuranceForm.svelte';
	import InsuranceDetails from '../../components/Insurance/InsuranceDetails.svelte';
	import PollutionCertificateDetails from '../../components/PollutionCertificate/PollutionCertificateDetails.svelte';
	import { Plus } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { derived } from 'svelte/store';
	import { env } from '$env/dynamic/public';

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
	}

	let vehicles = $state<Vehicle[]>([]);
	let loading = $state(true);
	let error = $state('');

	let newVehicle = $state({
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
			const response = await fetch(`${env.PUBLIC_API_BASE_URL}/api/vehicles`, {
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
			const response = await fetch(`${env.PUBLIC_API_BASE_URL}/api/vehicles`, {
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
				`${env.PUBLIC_API_BASE_URL}/api/vehicles/${vehicleId}/fuel-logs`,
				{
					headers: {
						'X-User-PIN': localStorage.getItem('userPin') || ''
					}
				}
			);
			if (response.ok) {
				const data = await response.json();
				const labels = data.map((log: any) => new Date(log.date).toLocaleDateString());
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
				on:addMaintenance={() => (showMaintenanceLogModal = true)}
			/>
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

	<h2 class="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
		Fuel Cost & Mileage Trends
	</h2>
	{#if selectedVehicleId}
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
		<!-- Fuel Refill Form and List -->
		<div class="mt-12">
			<FuelRefillList vehicleId={selectedVehicleId} />
		</div>
		<div class="mt-12">
			<MaintenanceLogList vehicleId={selectedVehicleId} />
		</div>
		<div class="mt-12">
			<InsuranceDetails vehicleId={selectedVehicleId} />
		</div>
		<div class="mt-12">
			<PollutionCertificateDetails vehicleId={selectedVehicleId} />
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

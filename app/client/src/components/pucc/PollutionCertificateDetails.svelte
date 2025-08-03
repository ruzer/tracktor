<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { FileText, Calendar, MapPin, Pencil, Trash2 } from '@lucide/svelte';
	import PollutionCertificateForm from './PollutionCertificateForm.svelte';
  import { config } from '../../lib/states/config';
  import dayjs from 'dayjs';

  $: formatDate = (date: string) => dayjs(date).format($config.dateFormat);

	export let vehicleId: number | null = null;

	interface PollutionCertificateDetails {
		id: number;
		certificateNumber: string;
		issueDate: string;
		expiryDate: string;
		testingCenter: string;
		notes?: string;
	}

	let pollutionCertificate: PollutionCertificateDetails | null = null;
	let loading = false;
	let error = '';
	let showPollutionCertificateFormModal = false;

	async function fetchPollutionCertificateDetails() {
		if (!vehicleId) {
			pollutionCertificate = null;
			return;
		}
		loading = true;
		error = '';
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL||""}/api/vehicles/${vehicleId}/pucc`,
				{
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				pollutionCertificate = await response.json();
			} else {
				pollutionCertificate = null;
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function handleDeletePollutionCertificate() {
		if (!pollutionCertificate) return;
		if (!confirm('Are you sure you want to delete this pollution certificate?')) {
			return;
		}
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL||""}/api/vehicles/${vehicleId}/pucc`,
				{
					method: 'DELETE',
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				pollutionCertificate = null;
				alert('Pollution certificate deleted successfully.');
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to delete pollution certificate.');
			}
		} catch (err) {
			alert('Network error. Failed to delete pollution certificate.');
		}
	}

	function handleEditPollutionCertificate() {
		showPollutionCertificateFormModal = true;
	}

	function handleAddPollutionCertificate() {
		showPollutionCertificateFormModal = true;
	}

	function closePollutionCertificateFormModal() {
		showPollutionCertificateFormModal = false;
		fetchPollutionCertificateDetails(); // Refresh details after form submission
	}

	// Refetch when vehicleId changes
	$: if (vehicleId) {
		fetchPollutionCertificateDetails();
	}

	onMount(() => {
		if (vehicleId) fetchPollutionCertificateDetails();
	});
</script>

<div class="mt-8 text-gray-600 dark:text-gray-300">
	<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
		Pollution Certificate Details
	</h3>
	{#if loading}
		<div class="text-gray-500 dark:text-gray-400">Loading pollution certificate details...</div>
	{:else if error}
		<div class="text-red-600 dark:text-red-400" role="alert">{error}</div>
	{:else if pollutionCertificate}
		<div
			class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<FileText class="h-6 w-6 text-green-500 dark:text-green-400" />
					<span class="text-xl font-bold text-gray-800 dark:text-gray-100"
						>{pollutionCertificate.certificateNumber}</span
					>
				</div>
				<div class="flex gap-2">
					<button
						on:click={handleEditPollutionCertificate}
						class="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
					>
						<Pencil class="h-5 w-5" />
					</button>
					<button
						on:click={handleDeletePollutionCertificate}
						class="text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
					>
						<Trash2 class="h-5 w-5" />
					</button>
				</div>
			</div>
			<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="flex items-center gap-2">
					<Calendar class="h-5 w-5 text-gray-400 dark:text-gray-500" />
					<span class="font-semibold">Issue Date:</span>
					<span>{formatDate(pollutionCertificate.issueDate)}</span>
				</div>
				<div class="flex items-center gap-2">
					<Calendar class="h-5 w-5 text-gray-400 dark:text-gray-500" />
					<span class="font-semibold">Expiry Date:</span>
					<span>{formatDate(pollutionCertificate.expiryDate)}</span>
				</div>
				<div class="flex items-center gap-2">
					<MapPin class="h-5 w-5 text-gray-400 dark:text-gray-500" />
					<span class="font-semibold">Testing Center:</span>
					<span>{pollutionCertificate.testingCenter}</span>
				</div>
				{#if pollutionCertificate.notes}
					<div class="flex items-center gap-2 md:col-span-2">
						<FileText class="h-5 w-5 text-gray-400 dark:text-gray-500" />
						<span class="font-semibold">Notes:</span>
						<span>{pollutionCertificate.notes}</span>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="text-center">
			<p class="text-gray-500 dark:text-gray-400">
				No pollution certificate details found for this vehicle.
			</p>
			<button
				on:click={handleAddPollutionCertificate}
				class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			>
				Add Pollution Certificate
			</button>
		</div>
	{/if}

	{#if showPollutionCertificateFormModal}
		<PollutionCertificateForm
			{vehicleId}
			showModal={showPollutionCertificateFormModal}
			closeModal={closePollutionCertificateFormModal}
			initialData={pollutionCertificate}
		/>
	{/if}
</div>

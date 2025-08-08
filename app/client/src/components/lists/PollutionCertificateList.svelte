<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { FileText, Calendar, MapPin, Pencil, Trash2, BadgeCheck } from '@lucide/svelte';
	import { formatDate } from '$lib/utils/formatting';
	import { puccModelStore } from '$lib/stores/pucc';
	import { Jumper } from 'svelte-loading-spinners';

	let { vehicleId } = $props();

	interface PollutionCertificateDetails {
		id: string;
		certificateNumber: string;
		issueDate: string;
		expiryDate: string;
		testingCenter: string;
		notes?: string;
	}

	let pollutionCertificates: PollutionCertificateDetails[] = $state([]);
	let loading = $state(false);
	let error = $state('');

	$effect(() => {
		if (!vehicleId) {
			error = 'Vehicle ID is required.';
			loading = false;
		} else {
			fetchPollutionCertificateDetails();
		}
	});

	async function fetchPollutionCertificateDetails() {
		if (!vehicleId) {
			pollutionCertificates = [];
			return;
		}
		loading = true;
		error = '';
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/pucc`,
				{
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				pollutionCertificates = await response.json();
			} else {
				error = 'Failed to fetch Pollution Certificates.';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function deletePollutionCertificate(puccId: string) {
		if (!confirm('Are you sure you want to delete this pollution certificate?')) {
			return;
		}
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/pucc/${puccId}`,
				{
					method: 'DELETE',
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				await fetchPollutionCertificateDetails();
			} else {
				const data = await response.json();
				alert(data.message || 'Failed to delete pollution certificate.');
			}
		} catch (err) {
			alert('Network error. Failed to delete pollution certificate.');
		}
	}

	onMount(() => {
		fetchPollutionCertificateDetails();
	});
</script>

{#if loading}
	<p class="flex items-center justify-center gap-5 text-lg text-gray-500 dark:text-gray-400">
		<Jumper size="100" color="#155dfc" unit="px" duration="2s" />
	</p>
{:else if error}
	<p class="text-red-500">Error: {error}</p>
{:else if pollutionCertificates.length === 0}
	<div>No maintenance logs for this vehicle.</div>
{:else}
	{#each pollutionCertificates as pucc (pucc.id)}
		<div
			class="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<BadgeCheck class="h-6 w-6 text-purple-500 dark:text-purple-400" />
					<span class="text-xl font-bold text-gray-800 dark:text-gray-100"
						>{pucc.certificateNumber}</span
					>
				</div>
				<div class="flex gap-2">
					<button
						class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
						onclick={() => {
							puccModelStore.show(vehicleId, pucc, true, (status: boolean) => {
								if (status) {
									fetchPollutionCertificateDetails();
								}
							});
						}}
					>
						<Pencil
							class="h-5 w-5 text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
						/>
					</button>
					<button
						class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
						onclick={() => {
							deletePollutionCertificate(pucc.id);
						}}
					>
						<Trash2
							class="h-5 w-5 text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
						/>
					</button>
				</div>
			</div>
			<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="flex items-center gap-2 text-gray-900 dark:text-gray-100">
					<Calendar class="h-5 w-5" />
					<span class="font-semibold">Issue Date:</span>
					<span>{formatDate(pucc.issueDate)}</span>
				</div>
				<div class="flex items-center gap-2 text-gray-900 dark:text-gray-100">
					<Calendar class="h-5 w-5" />
					<span class="font-semibold">Expiry Date:</span>
					<span>{formatDate(pucc.expiryDate)}</span>
				</div>
				<div class="flex items-center gap-2 text-gray-900 dark:text-gray-100">
					<MapPin class="h-5 w-5" />
					<span class="font-semibold">Testing Center:</span>
					<span>{pucc.testingCenter}</span>
				</div>
				{#if pucc.notes}
					<div class="flex items-center gap-2 text-gray-900 md:col-span-2 dark:text-gray-100">
						<FileText class="h-5 w-5" />
						<span class="font-semibold">Notes:</span>
						<span>{pucc.notes}</span>
					</div>
				{/if}
			</div>
		</div>
	{/each}
{/if}

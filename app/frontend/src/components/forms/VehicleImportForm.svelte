<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/stores/i18n';
	import { getApiUrl } from '$lib/utils/api';
	import { UploadCloud } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { type VehicleImportSummary } from '$lib/types/import';

	const dispatch = createEventDispatcher<{ imported: VehicleImportSummary }>();

	let selectedFile = $state<File | null>(null);
	let uploading = $state(false);
	let error = $state('');
	let summary = $state<VehicleImportSummary | null>(null);

	function resetState() {
		error = '';
		summary = null;
	}

	function handleFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		selectedFile = input.files ? (input.files[0] ?? null) : null;
		resetState();
	}

	function downloadTemplate() {
		if (!browser) return;
		const headers = [
			'make',
			'model',
			'year',
			'licensePlate',
			'vin',
			'color',
			'odometer',
			'insuranceProvider',
			'insurancePolicyNumber',
			'insuranceStartDate',
			'insuranceEndDate',
			'insuranceCost',
			'insuranceNotes',
			'assigneeName',
			'assigneeRole',
			'assignmentArea',
			'assignmentUnit',
			'assignmentStartDate',
			'assignmentEndDate',
			'assignmentNotes'
		];
		const sampleRow = [
			'Toyota',
			'Corolla',
			'2022',
			'ABC-123',
			'1NXBR32E54Z123456',
			'Blue',
			'15230',
			'ACME Insurance',
			'POL-4589',
			'2024-01-01',
			'2024-12-31',
			'840',
			'Full coverage',
			'John Doe',
			'Driver',
			'Logistics',
			'Unit 3',
			'2024-02-01',
			'',
			'Seasonal assignment'
		];
		const csvContent = `${headers.join(',')}\n${sampleRow.join(',')}\n`;
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'vehicles-import-template.csv';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	async function handleUpload() {
		if (!selectedFile || uploading) return;
		uploading = true;
		error = '';
		summary = null;
		try {
			const formData = new FormData();
			formData.append('file', selectedFile);
			const response = await fetch(getApiUrl('/api/vehicles/import'), {
				method: 'POST',
				body: formData,
				headers: {
					'X-User-PIN': localStorage.getItem('userPin') || ''
				}
			});
			const result = await response.json();
			if (!response.ok) {
				error = result?.message || $t('vehicle.import.error');
				uploading = false;
				return;
			}
			summary = result;
			if (summary) {
				dispatch('imported', summary);
			}
		} catch (err) {
			error = err instanceof Error ? err.message : $t('vehicle.import.error');
		} finally {
			uploading = false;
		}
	}
</script>

<div class="space-y-5 text-sm">
	<p class="text-gray-600 dark:text-gray-200">{$t('vehicle.import.description')}</p>
	<div class="rounded-xl bg-gray-100 p-4 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
		<p class="font-semibold">{$t('vehicle.import.supportedFormats')}</p>
		<ul class="ml-5 list-disc space-y-1 pt-2">
			<li>{$t('vehicle.import.formatCsv')}</li>
			<li>{$t('vehicle.import.formatExcel')}</li>
		</ul>
	</div>
	<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<label class="flex w-full flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
			<span>{$t('vehicle.import.selectFile')}</span>
			<input
				type="file"
				accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				onchange={handleFileChange}
				disabled={uploading}
				class="w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white p-3 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
			/>
		</label>
		<button
			type="button"
			onclick={downloadTemplate}
			class="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-400 dark:hover:text-blue-300"
		>
			<UploadCloud class="h-4 w-4" />
			{$t('vehicle.import.downloadTemplate')}
		</button>
	</div>
	{#if error}
		<p class="rounded-lg bg-red-100 px-3 py-2 text-red-700 dark:bg-red-900/30 dark:text-red-300">
			{error}
		</p>
	{/if}
	{#if summary}
		<div
			class="space-y-3 rounded-xl border border-gray-200 bg-white p-4 text-sm dark:border-gray-700 dark:bg-gray-900"
		>
			<p class="font-semibold text-gray-800 dark:text-gray-100">{$t('vehicle.import.results')}</p>
			<div class="grid grid-cols-2 gap-3 text-gray-600 dark:text-gray-300">
				<div>
					<p class="text-xs tracking-wide text-gray-400 uppercase dark:text-gray-500">
						{$t('vehicle.import.total')}
					</p>
					<p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{summary.totalRows}</p>
				</div>
				<div>
					<p class="text-xs tracking-wide text-gray-400 uppercase dark:text-gray-500">
						{$t('vehicle.import.successful')}
					</p>
					<p class="text-lg font-semibold text-green-600 dark:text-green-400">{summary.imported}</p>
				</div>
				<div>
					<p class="text-xs tracking-wide text-gray-400 uppercase dark:text-gray-500">
						{$t('vehicle.import.skipped')}
					</p>
					<p class="text-lg font-semibold text-amber-600 dark:text-amber-300">{summary.skipped}</p>
				</div>
			</div>
			{#if summary.warnings.length > 0}
				<div
					class="rounded-lg bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
				>
					<p class="font-semibold">{$t('vehicle.import.warnings')}</p>
					<ul class="ml-5 list-disc space-y-1">
						{#each summary.warnings as warning}
							<li>{warning}</li>
						{/each}
					</ul>
				</div>
			{/if}
			{#if summary.failed.length > 0}
				<div class="rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-200">
					<p class="font-semibold">{$t('vehicle.import.failed')}</p>
					<ul class="ml-5 list-disc space-y-1">
						{#each summary.failed as row}
							<li>{$t('vehicle.import.failedRow', { row: row.row, error: row.error })}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</div>

<div class="mt-8 flex justify-end">
	<button
		type="button"
		onclick={handleUpload}
		disabled={!selectedFile || uploading}
		class={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
			!selectedFile || uploading
				? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
				: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
		}`}
	>
		<UploadCloud class="h-4 w-4" />
		{$t('vehicle.import.start')}
	</button>
</div>

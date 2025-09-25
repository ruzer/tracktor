<script lang="ts">
	import { getApiUrl } from '$lib/utils/api';
	import { t } from '$lib/stores/i18n';
	import Button from '$components/common/Button.svelte';
	import { Jumper } from 'svelte-loading-spinners';
	let { vehicleId } = $props();
	const defaultStartDate = () => new Date().toISOString().slice(0, 10);
	let rows = $state<any[]>([]);
	let showHistory = $state(true);
	const assignments = $derived(showHistory ? rows : rows.filter((row) => row.isCurrent));
	const currentAssignment = $derived(rows.find((row) => row.isCurrent) ?? null);
	let loading = $state(false);
	let error = $state('');
	let form = $state({
		assigneeName: '',
		assigneeRole: '',
		area: '',
		unit: '',
		startDate: defaultStartDate(),
		isCurrent: true,
		notes: ''
	});

	async function load() {
		loading = true;
		error = '';
		try {
			const res = await fetch(getApiUrl(`/api/vehicles/${vehicleId}/assignments`), {
				headers: { 'X-User-PIN': localStorage.getItem('userPin') || '' }
			});
			if (res.ok) rows = await res.json();
			else error = (await res.json()).message || $t('errors.fetchFailed');
		} catch {
			error = $t('errors.networkError');
		}
		loading = false;
	}
	$effect(() => {
		if (vehicleId) load();
	});

	async function add() {
		try {
			const res = await fetch(getApiUrl(`/api/vehicles/${vehicleId}/assignments`), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-User-PIN': localStorage.getItem('userPin') || ''
				},
				body: JSON.stringify(form)
			});
			if (res.ok) {
				form = {
					assigneeName: '',
					assigneeRole: '',
					area: '',
					unit: '',
					startDate: defaultStartDate(),
					isCurrent: true,
					notes: ''
				};
				await load();
			} else error = (await res.json()).message || $t('errors.fetchFailed');
		} catch {
			error = $t('errors.networkError');
		}
	}
	async function closeAssignment(id: string) {
		await fetch(getApiUrl(`/api/vehicles/${vehicleId}/assignments/${id}/close`), {
			method: 'PATCH',
			headers: { 'X-User-PIN': localStorage.getItem('userPin') || '' }
		});
		await load();
	}

	const assignmentRowClasses = (isCurrent: boolean) =>
		`border-b border-gray-200 last:border-b-0 dark:border-gray-700 ${
			isCurrent ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
		}`;
</script>

{#if loading}
	<p class="flex items-center justify-center gap-5 text-lg text-gray-500 dark:text-gray-400">
		<Jumper size="40" color="#155dfc" unit="px" duration="2s" />{$t('common.loading')}
	</p>
{:else}
	{#if error}<p class="text-red-500">{$t('common.error')}: {error}</p>{/if}
	{#if currentAssignment}
		<div
			class="mb-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm dark:border-blue-700/40 dark:bg-gray-800"
		>
			<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<p class="text-xs tracking-wider text-blue-500 uppercase dark:text-blue-300">
						{$t('vehicle.assignment.currentTitle')}
					</p>
					<p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
						{currentAssignment.assigneeName ?? $t('vehicle.assignment.unknownDriver')}
					</p>
					<p class="text-sm text-gray-500 dark:text-gray-300">
						{currentAssignment.assigneeRole ?? $t('common.notAvailable')}
					</p>
				</div>
				<span
					class="self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-200"
				>
					{$t('forms.labels.current')}
				</span>
			</div>
			<div class="mt-4 grid gap-4 sm:grid-cols-2">
				<div>
					<p class="text-xs tracking-wide text-gray-400 uppercase dark:text-gray-500">
						{$t('vehicle.assignment.area')}
					</p>
					<p class="text-base text-gray-800 dark:text-gray-100">{currentAssignment.area ?? '-'}</p>
				</div>
				<div>
					<p class="text-xs tracking-wide text-gray-400 uppercase dark:text-gray-500">
						{$t('vehicle.assignment.unit')}
					</p>
					<p class="text-base text-gray-800 dark:text-gray-100">{currentAssignment.unit ?? '-'}</p>
				</div>
				<div>
					<p class="text-xs tracking-wide text-gray-400 uppercase dark:text-gray-500">
						{$t('vehicle.assignment.since')}
					</p>
					<p class="text-base text-gray-800 dark:text-gray-100">
						{currentAssignment.startDate ?? '-'}
					</p>
				</div>
				{#if currentAssignment.endDate}
					<div>
						<p class="text-xs tracking-wide text-gray-400 uppercase dark:text-gray-500">
							{$t('vehicle.assignment.until')}
						</p>
						<p class="text-base text-gray-800 dark:text-gray-100">{currentAssignment.endDate}</p>
					</div>
				{/if}
			</div>
			{#if currentAssignment.notes}
				<div
					class="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
				>
					{$t('vehicle.assignment.notes')}: {currentAssignment.notes}
				</div>
			{/if}
		</div>
	{:else if rows.length > 0}
		<div
			class="mb-6 rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
		>
			{$t('vehicle.assignment.noCurrent')}
		</div>
	{/if}
	<div class="mb-4 rounded bg-white p-4 shadow dark:bg-gray-800">
		<div class="grid grid-cols-3 gap-4">
			<input
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.assigneeName')}
				bind:value={form.assigneeName}
			/>
			<input
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.assigneeRole')}
				bind:value={form.assigneeRole}
			/>
			<input
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.area')}
				bind:value={form.area}
			/>
			<input
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.unit')}
				bind:value={form.unit}
			/>
			<input
				type="date"
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.startDate')}
				bind:value={form.startDate}
			/>
			<label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
				><input type="checkbox" bind:checked={form.isCurrent} /> {$t('forms.labels.current')}</label
			>
		</div>
		<div class="mt-3">
			<Button type="button" variant="primary" text={$t('forms.buttons.add')} onclick={add} />
		</div>
	</div>
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
			{$t('navigation.assignments')}
		</h3>
		{#if rows.length > 0}
			<button
				type="button"
				class="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
				onclick={() => (showHistory = !showHistory)}
			>
				{showHistory ? $t('vehicle.assignment.hideHistory') : $t('vehicle.assignment.showHistory')}
			</button>
		{/if}
	</div>
	<div class="overflow-x-auto">
		<table class="min-w-full overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
			<thead class="bg-gray-200 dark:bg-gray-700"
				><tr>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.assigneeName')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.assigneeRole')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.area')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.unit')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.startDate')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.endDate')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('table.headers.actions')}</th
					></tr
				></thead
			>
			<tbody>
				{#if assignments.length === 0}
					<tr>
						<td colspan="7" class="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
							{$t('vehicle.assignment.noRecords')}
						</td>
					</tr>
				{:else}
					{#each assignments as r (r.id)}
						<tr class={assignmentRowClasses(r.isCurrent)}>
							<td class="px-4 py-2"
								>{r.assigneeName}{#if r.isCurrent}<span
										class="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-100"
										>{$t('forms.labels.current')}</span
									>{/if}</td
							>
							<td class="px-4 py-2">{r.assigneeRole || '-'}</td>
							<td class="px-4 py-2">{r.area || '-'}</td>
							<td class="px-4 py-2">{r.unit || '-'}</td>
							<td class="px-4 py-2">{r.startDate}</td>
							<td class="px-4 py-2">{r.endDate || '-'}</td>
							<td class="px-4 py-2"
								><Button
									type="button"
									variant="secondary"
									text={$t('forms.labels.close')}
									onclick={() => closeAssignment(r.id)}
								/></td
							>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
{/if}

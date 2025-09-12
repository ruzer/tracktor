<script lang="ts">
	import { getApiUrl } from '$lib/utils/api';
	import { t } from '$lib/stores/i18n';
	import Button from '$components/common/Button.svelte';
	import { Jumper } from 'svelte-loading-spinners';
	let { vehicleId } = $props();
	let rows = $state<any[]>([]);
	let loading = $state(false);
	let error = $state('');
	let form = $state({
		type: 'tenencia',
		year: new Date().getFullYear(),
		amount: undefined,
		paid: false,
		paidDate: '',
		receiptFolio: ''
	});
	async function load() {
		loading = true;
		error = '';
		try {
			const res = await fetch(getApiUrl(`/api/vehicles/${vehicleId}/taxes`), {
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
	async function upsert() {
		try {
			const res = await fetch(getApiUrl(`/api/vehicles/${vehicleId}/taxes`), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-User-PIN': localStorage.getItem('userPin') || ''
				},
				body: JSON.stringify(form)
			});
			if (res.ok) {
				await load();
			} else error = (await res.json()).message || $t('errors.fetchFailed');
		} catch {
			error = $t('errors.networkError');
		}
	}
	async function markPaid(id: string) {
		await fetch(getApiUrl(`/api/vehicles/${vehicleId}/taxes/${id}/paid`), {
			method: 'PATCH',
			headers: { 'X-User-PIN': localStorage.getItem('userPin') || '' }
		});
		await load();
	}
</script>

{#if loading}
	<p class="flex items-center justify-center gap-5 text-lg text-gray-500 dark:text-gray-400">
		<Jumper size="40" color="#155dfc" unit="px" duration="2s" />{$t('common.loading')}
	</p>
{:else}
	{#if error}<p class="text-red-500">{$t('common.error')}: {error}</p>{/if}
	<div class="mb-4 rounded bg-white p-4 shadow dark:bg-gray-800">
		<div class="grid grid-cols-6 gap-4">
			<input
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.taxType')}
				bind:value={form.type}
			/>
			<input
				type="number"
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.year')}
				bind:value={form.year}
			/>
			<input
				type="number"
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.amount')}
				bind:value={form.amount}
			/>
			<input
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.receiptFolio')}
				bind:value={form.receiptFolio}
			/>
			<label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
				><input type="checkbox" bind:checked={form.paid} /> {$t('forms.labels.paid')}</label
			>
			<input
				type="date"
				class="rounded border p-2 dark:bg-gray-700"
				placeholder={$t('forms.labels.paidDate')}
				bind:value={form.paidDate}
			/>
		</div>
		<div class="mt-3">
			<Button type="button" variant="primary" text={$t('forms.buttons.add')} onclick={upsert} />
		</div>
	</div>
	<div class="overflow-x-auto">
		<table class="min-w-full overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
			<thead class="bg-gray-200 dark:bg-gray-700"
				><tr>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.taxType')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.year')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.amount')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.paid')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.paidDate')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('forms.labels.receiptFolio')}</th
					>
					<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
						>{$t('table.headers.actions')}</th
					>
				</tr></thead
			>
			<tbody>
				{#each rows as r (r.id)}
					<tr class="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
						<td class="px-4 py-2">{r.type}</td>
						<td class="px-4 py-2">{r.year}</td>
						<td class="px-4 py-2">{r.amount ?? '-'}</td>
						<td class="px-4 py-2">{r.paid ? $t('common.yes') : $t('common.no')}</td>
						<td class="px-4 py-2">{r.paidDate || '-'}</td>
						<td class="px-4 py-2">{r.receiptFolio || '-'}</td>
						<td class="px-4 py-2"
							><Button
								type="button"
								variant="secondary"
								text={$t('forms.labels.markPaid')}
								onclick={() => markPaid(r.id)}
							/></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

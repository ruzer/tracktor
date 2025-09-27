<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/stores/i18n';
	import Button from '$components/common/Button.svelte';

	let orders = $state([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			// TODO: Implementar la carga de órdenes de mantenimiento
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error desconocido';
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{$t('maintenance.orders')} - Tracktor</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
				{$t('maintenance.orders')}
			</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">
				{$t('maintenance.ordersDescription')}
			</p>
		</div>
		<Button
			type="button"
			text={$t('maintenance.createOrder')}
			variant="primary"
		/>
	</div>

	{#if loading}
		<div class="flex justify-center py-8">
			<div class="text-gray-500 dark:text-gray-400">
				{$t('common.loading')}...
			</div>
		</div>
	{:else if error}
		<div class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
			<p class="text-red-700 dark:text-red-400">
				{$t('common.error')}: {error}
			</p>
		</div>
	{:else}
		<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
			<p class="text-gray-600 dark:text-gray-400">
				{$t('maintenance.noOrders')}
			</p>
		</div>
	{/if}
</div>
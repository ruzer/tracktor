<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { t } from '$lib/stores/i18n';
	import { getApiUrl } from '$lib/utils/api';
	import Button from '$components/common/Button.svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import MaintenanceOrderTable from '$components/maintenance/MaintenanceOrderTable.svelte';
	import { maintenanceOrderModalStore } from '$lib/stores/maintenance-order';
	import { Plus, Download } from '@lucide/svelte';
	import type { MaintenanceOrder } from '$lib/models/vehicle';

	let orders: MaintenanceOrder[] = [];
	let loading = true;
	let error: string | null = null;

	let statusFilter = '';
	let paymentFilter = '';
	let workshopFilter = '';

	const translate = () => get(t);

	async function loadOrders() {
		if (!browser) return;
		const pin = localStorage.getItem('userPin');
		if (!pin) {
			goto('/login', { replaceState: true });
			return;
		}

		loading = true;
		error = null;

		try {
			const response = await fetch(getApiUrl('/api/maintenance/orders'), {
				headers: {
					'X-User-PIN': pin
				}
			});

			const payload = await response.json().catch(() => null);

			if (!response.ok || payload?.success === false) {
				error =
					payload?.error ??
					payload?.message ??
					translate()('maintenance.errors.fetchOrdersFailed');
				orders = [];
				return;
			}

			const list = payload?.data;
			orders = Array.isArray(list) ? list : [];
		} catch (err) {
			console.error('Failed to load maintenance orders', err);
			error = translate()('errors.networkError');
		} finally {
			loading = false;
		}
	}

	function handleCreateOrder() {
		maintenanceOrderModalStore.show('', undefined, (reloaded) => {
			if (reloaded) loadOrders();
		});
	}

	async function exportOrders() {
		if (!browser) return;
		const pin = localStorage.getItem('userPin');
		if (!pin) {
			goto('/login', { replaceState: true });
			return;
		}

		try {
			const response = await fetch(getApiUrl('/api/maintenance/orders/export'), {
				headers: {
					'X-User-PIN': pin
				}
			});

			if (!response.ok) {
				const data = await response.json().catch(() => null);
				throw new Error(
					data?.message ?? translate()('maintenance.errors.exportFailed')
				);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const anchor = document.createElement('a');
			anchor.href = url;
			anchor.download = 'maintenance-orders.csv';
			document.body.appendChild(anchor);
			anchor.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(anchor);
		} catch (err) {
			console.error('Failed to export maintenance orders', err);
			error =
				err instanceof Error
					? err.message
					: translate()('maintenance.errors.exportFailed');
		}
	}

	function clearFilters() {
		statusFilter = '';
		paymentFilter = '';
		workshopFilter = '';
	}

	$: filteredOrders = orders.filter((order) => {
		if (statusFilter && order.status !== statusFilter) return false;
		if (paymentFilter && order.paymentStatus !== paymentFilter) return false;
		if (workshopFilter && order.workshop?.name !== workshopFilter) return false;
		return true;
	});

	$: uniqueWorkshops = [
		...new Set(orders.map((order) => order.workshop?.name).filter(Boolean))
	] as string[];

	onMount(() => {
		if (!browser) return;
		loadOrders();
	});
</script>

<svelte:head>
	<title>{$t('navigation.maintenance')} - Tracktor</title>
</svelte:head>

<div class="container mx-auto px-4 py-6">
	<!-- Header -->
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					{$t('navigation.maintenance')}
				</h1>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
					{$t('maintenance.description')}
				</p>
			</div>
			<div class="flex gap-3">
				<Button
					type="button"
					variant="secondary"
					text={$t('common.export')}
					icon={Download}
					onclick={exportOrders}
				/>
				<Button
					type="button"
					variant="primary"
					text={$t('maintenance.buttons.newOrder')}
					icon={Plus}
					onclick={handleCreateOrder}
				/>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center gap-2 mb-4">
			<h3 class="font-medium text-gray-900 dark:text-gray-100">
				{$t('common.filters')}
			</h3>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div>
				<label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">
					{$t('maintenance.filters.status')}
				</label>
				<select
					id="status-filter"
					bind:value={statusFilter}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">{$t('common.all')}</option>
					<option value="pending_review">{$t('maintenance.status.pendingReview')}</option>
					<option value="quotation">{$t('maintenance.status.quotation')}</option>
					<option value="authorized">{$t('maintenance.status.authorized')}</option>
					<option value="rejected">{$t('maintenance.status.rejected')}</option>
					<option value="in_workshop">{$t('maintenance.status.inWorkshop')}</option>
					<option value="in_repair">{$t('maintenance.status.inRepair')}</option>
					<option value="repaired_pending_payment">{$t('maintenance.status.repairedPendingPayment')}</option>
					<option value="closed">{$t('maintenance.status.closed')}</option>
				</select>
			</div>

			<div>
				<label for="payment-filter" class="block text-sm font-medium text-gray-700 mb-1">
					{$t('maintenance.filters.paymentStatus')}
				</label>
				<select
					id="payment-filter"
					bind:value={paymentFilter}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">{$t('common.all')}</option>
					<option value="pending">{$t('maintenance.payment.pending')}</option>
					<option value="partial">{$t('maintenance.payment.partial')}</option>
					<option value="paid">{$t('maintenance.payment.paid')}</option>
				</select>
			</div>

			<div>
				<label for="workshop-filter" class="block text-sm font-medium text-gray-700 mb-1">
					{$t('maintenance.filters.workshop')}
				</label>
				<select
					id="workshop-filter"
					bind:value={workshopFilter}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">{$t('common.all')}</option>
					{#each uniqueWorkshops as workshopName}
						<option value={workshopName}>{workshopName}</option>
					{/each}
				</select>
			</div>
		</div>
		
		{#if statusFilter || paymentFilter || workshopFilter}
			<div class="mt-4 pt-4 border-t border-gray-200">
				<Button
					type="button"
					variant="secondary"
					text={$t('common.clearFilters')}
					onclick={clearFilters}
				/>
			</div>
		{/if}
	</div>

	<!-- Content -->
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<Jumper size="60" color="#3B82F6" />
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
			<p class="text-red-800">{error}</p>
		</div>
	{:else}
		<MaintenanceOrderTable
			orders={filteredOrders}
			{loading}
			onReload={loadOrders}
		/>
	{/if}
</div>

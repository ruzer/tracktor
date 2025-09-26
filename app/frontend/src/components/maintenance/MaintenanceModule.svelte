<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { t } from '$lib/stores/i18n';
	import { getApiUrl } from '$lib/utils/api';
	import { formatCurrency, formatDate, formatDistance } from '$lib/utils/formatting';
	import { Jumper } from 'svelte-loading-spinners';
	import { Trash2, Plus, Settings, FileText, Wrench } from '@lucide/svelte';
	
	// Components
	import Button from '$components/common/Button.svelte';
	import IconButton from '$components/common/IconButton.svelte';
	import DeleteConfirmation from '$components/common/DeleteConfirmation.svelte';
	import MaintenanceOrdersSection from '$components/maintenance/MaintenanceOrdersSection.svelte';
	
	// Stores
	import { maintenanceModelStore } from '$lib/stores/maintenance';
	import {
		maintenanceOrderModalStore,
		maintenanceOrderStatusModalStore
	} from '$lib/stores/maintenance-order';
	import {
		integratedLogModalStore,
		closeOrderIntegratedModalStore
	} from '$lib/stores/maintenance-integration';
	import {
		maintenanceOrderStatusOptions,
		maintenancePaymentStatusOptions,
		statusColorMap
	} from '$lib/constants/maintenance-orders';

	// Types
	import type { MaintenanceOrder } from '$lib/models/vehicle';

	interface MaintenanceLog {
		id: string;
		date: string;
		odometer: number;
		serviceCenter: string;
		cost: number;
		notes?: string | null;
	}

	interface MaintenanceSummary {
		total: number;
		open: number;
		inProgress: number;
		completed: number;
	}

	// Props
	let {
		vehicleId,
		orders = [],
		summary = { total: 0, open: 0, inProgress: 0, completed: 0 },
		recentLogs = [],
		onReload = (refresh?: boolean) => {}
	} = $props<{
		vehicleId: string;
		orders?: MaintenanceOrder[];
		summary?: MaintenanceSummary;
		recentLogs?: MaintenanceLog[];
		onReload?: (refresh?: boolean) => void;
	}>();

	// State
	let activeView = $state<'summary' | 'orders' | 'logs'>('summary');
	let maintenanceLogs: MaintenanceLog[] = $state([]);
	let loading = $state(false);
	let error = $state('');
	let selectedMaintenanceLog = $state<string>();
	let deleteDialog = $state(false);

	// Reactive computations
	const statusKeyMap: Record<string, string> = {
		pending_review: 'pendingReview',
		quotation: 'quotation',
		authorized: 'authorized',
		rejected: 'rejected',
		in_workshop: 'inWorkshop',
		in_repair: 'inRepair',
		repaired_pending_payment: 'repairedPendingPayment',
		closed: 'closed'
	};

	const paymentKeyMap: Record<string, string> = {
		pending: 'pending',
		partial: 'partial',
		paid: 'paid'
	};

	// Functions
	async function fetchMaintenanceLogs() {
		if (!vehicleId) {
			maintenanceLogs = [];
			return;
		}
		loading = true;
		error = '';
		try {
			const response = await fetch(getApiUrl(`/api/vehicles/${vehicleId}/maintenance-logs`), {
				headers: {
					'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
				}
			});
			if (response.ok) {
				const data = await response.json();
				maintenanceLogs = data;
			} else {
				error = $t('errors.fetchMaintenanceLogsFailed');
			}
		} catch (e) {
			console.error(e);
			error = $t('errors.networkError');
		} finally {
			loading = false;
		}
	}

	async function deleteMaintenanceLog(logId: string | undefined) {
		if (!logId) return;
		
		try {
			const response = await fetch(
				getApiUrl(`/api/vehicles/${vehicleId}/maintenance-logs/${logId}`),
				{
					method: 'DELETE',
					headers: {
						'X-User-PIN': browser ? localStorage.getItem('userPin') || '' : ''
					}
				}
			);
			if (response.ok) {
				await fetchMaintenanceLogs();
				onReload(true);
			} else {
				const data = await response.json();
				error = data.message || $t('errors.deleteMaintenanceFailed');
			}
		} catch (e) {
			console.error(e);
			error = $t('errors.networkError');
		}
	}

	function openCreateOrder() {
		maintenanceOrderModalStore.show(vehicleId, undefined, (reloaded) => reloaded && onReload(true));
	}

	function openCreateLog() {
		maintenanceModelStore.show(vehicleId, undefined, false, () => {
			fetchMaintenanceLogs();
			onReload(true);
		});
	}

	function editOrder(order: MaintenanceOrder) {
		maintenanceOrderModalStore.show(vehicleId, order, (reloaded) => reloaded && onReload(true));
	}

	function updateOrderStatus(order: MaintenanceOrder) {
		maintenanceOrderStatusModalStore.show(vehicleId, order, (reloaded) => reloaded && onReload(true));
	}

	function editLog(log: MaintenanceLog) {
		maintenanceModelStore.show(vehicleId, log, true, () => {
			fetchMaintenanceLogs();
			onReload(true);
		});
	}

	function openIntegratedLog() {
		integratedLogModalStore.show(vehicleId, () => {
			fetchMaintenanceLogs();
			onReload(true);
		});
	}

	function openCloseOrderIntegrated(orderId: string) {
		closeOrderIntegratedModalStore.show(vehicleId, orderId, () => {
			fetchMaintenanceLogs();
			onReload(true);
		});
	}

	// Lifecycle
	onMount(() => {
		if (activeView === 'logs') {
			fetchMaintenanceLogs();
		}
	});

	// Watch for view changes
	$effect(() => {
		if (activeView === 'logs' && maintenanceLogs.length === 0) {
			fetchMaintenanceLogs();
		}
	});
</script>

<section class="space-y-6">
	<!-- Header with navigation -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
			{$t('vehicle.detail.maintenanceSummary')}
		</h2>
		
		<!-- View Toggle -->
		<div class="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
			<button
				class={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
					activeView === 'summary'
						? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
						: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
				}`}
				onclick={() => activeView = 'summary'}
			>
				<FileText size={16} />
				{$t('maintenance.views.summary')}
			</button>
			<button
				class={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
					activeView === 'orders'
						? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
						: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
				}`}
				onclick={() => activeView = 'orders'}
			>
				<Settings size={16} />
				{$t('maintenance.titles.orders')}
			</button>
			<button
				class={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
					activeView === 'logs'
						? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
						: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
				}`}
				onclick={() => activeView = 'logs'}
			>
				<Wrench size={16} />
				{$t('navigation.maintenance')}
			</button>
		</div>
	</div>

	<!-- Content based on active view -->
	{#if activeView === 'summary'}
		<!-- Summary Cards -->
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-gray-200 p-4 text-center shadow-sm dark:border-gray-700">
				<p class="text-sm text-gray-500 dark:text-gray-300">{$t('vehicle.detail.totalWorkOrders')}</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{summary.total}</p>
			</div>
			<div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center shadow-sm dark:border-amber-900 dark:bg-amber-900/30">
				<p class="text-sm text-amber-600 dark:text-amber-200">{$t('vehicle.detail.openOrders')}</p>
				<p class="text-2xl font-bold text-amber-600 dark:text-amber-200">{summary.open}</p>
			</div>
			<div class="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center shadow-sm dark:border-blue-900 dark:bg-blue-900/30">
				<p class="text-sm text-blue-600 dark:text-blue-200">{$t('vehicle.detail.inProgress')}</p>
				<p class="text-2xl font-bold text-blue-600 dark:text-blue-200">{summary.inProgress}</p>
			</div>
			<div class="rounded-xl border border-green-200 bg-green-50 p-4 text-center shadow-sm dark:border-green-900 dark:bg-green-900/30">
				<p class="text-sm text-green-600 dark:text-green-200">{$t('vehicle.detail.completed')}</p>
				<p class="text-2xl font-bold text-green-600 dark:text-green-200">{summary.completed}</p>
			</div>
		</div>

		<!-- Recent Logs -->
		{#if recentLogs.length}
			<div class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
						{$t('vehicle.detail.lastMaintenance')}
					</h3>
					<Button 
						type="button" 
						variant="secondary" 
						text={$t('common.viewAll')} 
						onclick={() => activeView = 'logs'} 
					/>
				</div>
				<ul class="space-y-2">
					{#each recentLogs.slice(0, 3) as log (log.id)}
						<li class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
							<div class="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-200 md:flex-row md:items-center md:justify-between">
								<span class="font-semibold text-gray-900 dark:text-gray-100">{log.serviceCenter}</span>
								<span>{formatDate(log.date)}</span>
							</div>
							<div class="text-sm text-gray-500 dark:text-gray-300">
								{$t('vehicle.odometer')}: {formatDistance(log.odometer)} · {$t('forms.labels.cost')}: {formatCurrency(log.cost)}
							</div>
							{#if log.notes}
								<p class="text-sm text-gray-500 dark:text-gray-300">{log.notes}</p>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Recent Orders -->
		{#if orders.length}
			<div class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
						{$t('maintenance.titles.recentOrders')}
					</h3>
					<Button 
						type="button" 
						variant="secondary" 
						text={$t('common.viewAll')} 
						onclick={() => activeView = 'orders'} 
					/>
				</div>
				<div class="space-y-3">
					{#each orders.slice(0, 2) as order (order.id)}
						<div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
							<div class="flex flex-wrap items-center gap-2 mb-2">
								<span class={`rounded-full px-3 py-1 text-xs font-semibold ${statusColorMap[order.status] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
									{$t(`maintenance.status.${statusKeyMap[order.status] || 'pendingReview'}`)}
								</span>
								<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
									{$t(`maintenance.payment.${paymentKeyMap[order.paymentStatus] || 'pending'}`)}
								</span>
							</div>
							<p class="text-sm text-gray-600 dark:text-gray-300">{order.reportedIssue}</p>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
								{$t('maintenance.labels.createdBy')}: {order.createdBy} · {formatDate(order.created_at)}
							</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Quick Actions -->
		<div class="flex flex-wrap gap-3">
			<Button 
				type="button" 
				variant="primary" 
				text={$t('maintenance.buttons.newOrder')} 
				onclick={openCreateOrder} 
			/>
			<Button 
				type="button" 
				variant="secondary" 
				text={$t('modals.addMaintenance')} 
				onclick={openCreateLog} 
			/>
			<Button 
				type="button" 
				variant="hero" 
				text={$t('maintenance.integration.integratedLog')} 
				onclick={openIntegratedLog} 
			/>
		</div>

	{:else if activeView === 'orders'}
		<!-- Orders Section -->
		<div class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
			<MaintenanceOrdersSection
				{orders}
				{vehicleId}
				{onReload}
			/>
		</div>

	{:else if activeView === 'logs'}
		<!-- Logs Section -->
		<div class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{$t('navigation.maintenance')}
				</h3>
				<Button 
					type="button" 
					variant="secondary" 
					text={$t('modals.addMaintenance')} 
					onclick={openCreateLog} 
				/>
			</div>

			{#if loading}
				<div class="flex items-center justify-center gap-5 py-8 text-lg text-gray-500 dark:text-gray-400">
					<Jumper size="60" color="#155dfc" unit="px" duration="2s" />
				</div>
			{:else if error}
				<p class="text-red-500">{$t('common.error')}: {error}</p>
			{:else if maintenanceLogs.length === 0}
				<p class="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
					{$t('modals.noMaintenanceLogs')}
				</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
						<thead class="bg-gray-200 dark:bg-gray-700">
							<tr>
								<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
									{$t('table.headers.date')}
								</th>
								<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
									{$t('table.headers.odometer')}
								</th>
								<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
									{$t('forms.labels.serviceCenter')}
								</th>
								<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
									{$t('table.headers.cost')}
								</th>
								<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
									{$t('table.headers.notes')}
								</th>
								<th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
									{$t('table.headers.actions')}
								</th>
							</tr>
						</thead>
						<tbody>
							{#each maintenanceLogs as log (log.id)}
								<tr class="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
									<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{formatDate(log.date)}</td>
									<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{formatDistance(log.odometer)}</td>
									<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{log.serviceCenter}</td>
									<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{formatCurrency(log.cost)}</td>
									<td class="px-4 py-2 text-gray-900 dark:text-gray-100">{log.notes || '-'}</td>
									<td class="px-4 py-2 text-gray-800 dark:text-gray-200">
										<div class="flex gap-1">
											<IconButton
												buttonStyles="hover:bg-gray-200 dark:hover:bg-gray-700"
												iconStyles="text-gray-600 dark:text-gray-100 hover:text-blue-500"
												icon={Settings}
												onclick={() => editLog(log)}
												ariaLabel={$t('common.edit')}
											/>
											<IconButton
												buttonStyles="hover:bg-gray-200 dark:hover:bg-gray-700"
												iconStyles="text-gray-600 dark:text-gray-100 hover:text-red-500"
												icon={Trash2}
												onclick={() => {
													selectedMaintenanceLog = log.id;
													deleteDialog = true;
												}}
												ariaLabel={$t('common.delete')}
											/>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Delete Confirmation Dialog -->
	<DeleteConfirmation
		onConfirm={() => deleteMaintenanceLog(selectedMaintenanceLog)}
		bind:open={deleteDialog}
	/>
</section>
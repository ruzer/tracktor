<script lang="ts">
	import type { MaintenanceOrder } from '$lib/models/vehicle';
	import { t } from '$lib/stores/i18n';
	import Button from '$components/common/Button.svelte';
	import {
		maintenanceOrderModalStore,
		maintenanceOrderStatusModalStore
	} from '$lib/stores/maintenance-order';
	import { closeOrderIntegratedModalStore } from '$lib/stores/maintenance-integration';
import {
	maintenanceOrderStatusOptions,
	maintenancePaymentStatusOptions,
	statusColorMap
} from '$lib/constants/maintenance-orders';
	import { formatDate } from '$lib/utils/formatting';

	let {
		orders,
		vehicleId,
		onReload = (refresh?: boolean) => {}
	} = $props<{
		orders: MaintenanceOrder[];
		vehicleId: string;
		onReload?: (refresh?: boolean) => void;
	}>();

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

	function openCreate() {
		maintenanceOrderModalStore.show(vehicleId, undefined, (reloaded) => reloaded && onReload(true));
	}

	function editOrder(order: MaintenanceOrder) {
		maintenanceOrderModalStore.show(vehicleId, order, (reloaded) => reloaded && onReload(true));
	}

	function updateStatus(order: MaintenanceOrder) {
		maintenanceOrderStatusModalStore.show(vehicleId, order, (reloaded) => reloaded && onReload(true));
	}

	function closeOrderIntegrated(order: MaintenanceOrder) {
		closeOrderIntegratedModalStore.show(vehicleId, order.id, () => onReload(true));
	}
</script>

<section class="space-y-4">
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{$t('maintenance.titles.orders')}</h3>
		<Button type="button" variant="secondary" text={$t('maintenance.buttons.newOrder')} onclick={openCreate} />
	</div>

	{#if !orders || orders.length === 0}
		<p class="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
			{$t('maintenance.messages.noOrders')}
		</p>
	{:else}
		<div class="space-y-4">
			{#each orders as order (order.id)}
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
					<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div class="space-y-2">
							<div class="flex flex-wrap items-center gap-2">
					<span class={`rounded-full px-3 py-1 text-xs font-semibold ${statusColorMap[order.status] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
						{$t(`maintenance.status.${statusKeyMap[order.status] || 'pendingReview'}`)}
					</span>
					<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
						{$t(`maintenance.payment.${paymentKeyMap[order.paymentStatus] || 'pending'}`)}
					</span>
							</div>
							<p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{order.reportedIssue}</p>
							<p class="text-sm text-gray-500 dark:text-gray-300">
								{$t('maintenance.labels.createdBy')}: <span class="font-medium">{order.createdBy}</span>
								{#if order.created_at}
									· {formatDate(order.created_at)}
								{/if}
							</p>
							{#if order.workshop?.name}
								<p class="text-sm text-gray-500 dark:text-gray-300">
									{$t('maintenance.labels.workshopName')}: <span class="font-medium">{order.workshop.name}</span>
									{#if order.workshop.contactPhone}
										· {order.workshop.contactPhone}
									{/if}
									{#if order.workshop.contactEmail}
										· {order.workshop.contactEmail}
									{/if}
								</p>
							{/if}
							<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
								{#if order.totalEstimated}
									<div class="rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-900/40 dark:text-gray-200">
										<span class="font-semibold">{$t('maintenance.labels.totalEstimated')}:</span> {order.totalEstimated}
									</div>
								{/if}
								{#if order.totalFinal}
									<div class="rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-900/40 dark:text-gray-200">
										<span class="font-semibold">{$t('maintenance.labels.totalFinal')}:</span> {order.totalFinal}
									</div>
								{/if}
								{#if order.quoteFile}
									<div class="rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-900/40 dark:text-gray-200">
										<span class="font-semibold">{$t('maintenance.labels.quoteFile')}:</span>
										<a class="ml-1 text-blue-600 underline" href={order.quoteFile} target="_blank" rel="noreferrer">{$t('maintenance.links.view')}</a>
									</div>
								{/if}
								{#if order.invoiceFile}
									<div class="rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-900/40 dark:text-gray-200">
										<span class="font-semibold">{$t('maintenance.labels.invoiceFile')}:</span>
										<a class="ml-1 text-blue-600 underline" href={order.invoiceFile} target="_blank" rel="noreferrer">{$t('maintenance.links.view')}</a>
									</div>
								{/if}
							</div>
						</div>
						<div class="flex flex-wrap gap-2">
							<Button type="button" variant="secondary" text={$t('maintenance.buttons.editOrder')} onclick={() => editOrder(order)} />
							<Button type="button" variant="primary" text={$t('maintenance.buttons.updateStatus')} onclick={() => updateStatus(order)} />
							{#if order.status === 'in_repair' || order.status === 'repaired_pending_payment'}
								<Button type="button" variant="hero" text={$t('maintenance.integration.closeIntegrated')} onclick={() => closeOrderIntegrated(order)} />
							{/if}
						</div>
					</div>

					{#if order.history?.length}
						<div class="mt-4 space-y-3">
							<p class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
								{$t('maintenance.labels.history')}
							</p>
							<ul class="space-y-2">
								{#each order.history as entry (entry.id)}
									<li class="rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
										<div class="flex flex-wrap items-center justify-between gap-2">
											<span class={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColorMap[entry.status] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
												{$t(`maintenance.status.${statusKeyMap[entry.status] || 'pendingReview'}`)}
											</span>
											<span class="text-xs text-gray-400">
												{entry.created_at ? formatDate(entry.created_at) : ''}
											</span>
										</div>
										{#if entry.notes}
											<p class="mt-1 text-sm">{entry.notes}</p>
										{/if}
										{#if entry.userId}
											<p class="text-xs text-gray-400">{$t('maintenance.labels.userId')}: {entry.userId}</p>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>

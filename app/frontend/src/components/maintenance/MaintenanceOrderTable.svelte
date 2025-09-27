<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import type { MaintenanceOrder } from '$lib/models/vehicle';
	import { t } from '$lib/stores/i18n';
	import Button from '$components/common/Button.svelte';
	import IconButton from '$components/common/IconButton.svelte';
	import { Edit, Eye, Trash2 } from '@lucide/svelte';
	import {
		maintenanceOrderModalStore,
		maintenanceOrderStatusModalStore
	} from '$lib/stores/maintenance-order';
	import { statusColorMap } from '$lib/constants/maintenance-orders';
	import { getApiUrl } from '$lib/utils/api';
	import { formatDate, formatCurrency } from '$lib/utils/formatting';

	let {
		orders = [],
		loading = false,
		onReload = () => {}
	} = $props<{
		orders?: MaintenanceOrder[];
		loading?: boolean;
		onReload?: () => void;
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

	let feedback = $state<{ type: 'success' | 'error'; message: string } | null>(null);

	function openCreate() {
		maintenanceOrderModalStore.show('', undefined, (reloaded) => reloaded && onReload());
	}

	function editOrder(order: MaintenanceOrder) {
		maintenanceOrderModalStore.show(order.vehicleId || '', order, (reloaded) => reloaded && onReload());
	}

	function updateStatus(order: MaintenanceOrder) {
		maintenanceOrderStatusModalStore.show(order.vehicleId || '', order, (reloaded) => reloaded && onReload());
	}

	function viewOrder(order: MaintenanceOrder) {
		console.log('View order:', order);
	}

	async function deleteOrder(order: MaintenanceOrder) {
		if (!browser) return;
		const translate = get(t);
		feedback = null;

		if (!window.confirm(translate('maintenance.confirmations.deleteOrder'))) {
			return;
		}

		const pin = localStorage.getItem('userPin');
		if (!pin) {
			goto('/login', { replaceState: true });
			return;
		}

		try {
			const response = await fetch(getApiUrl(`/api/maintenance/orders/${order.id}`), {
				method: 'DELETE',
				headers: {
					'X-User-PIN': pin
				}
			});

			const payload = await response.json().catch(() => null);

			if (!response.ok || payload?.success === false) {
				throw new Error(
					payload?.error ?? payload?.message ?? translate('maintenance.errors.updateFailed')
				);
			}

			feedback = {
				type: 'success',
				message: translate('maintenance.messages.orderDeleted')
			};
			onReload();
		} catch (err) {
			console.error('Failed to delete maintenance order', err);
			feedback = {
				type: 'error',
				message:
					err instanceof Error
						? err.message
						: translate('maintenance.errors.updateFailed')
			};
		}
	}
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
			{$t('maintenance.titles.orders')}
		</h2>
		<Button 
			type="button" 
			variant="primary" 
			text={$t('maintenance.buttons.newOrder')} 
			onclick={openCreate} 
		/>
	</div>

	{#if feedback}
		<div
			class={`rounded-lg border px-4 py-3 text-sm ${
				feedback.type === 'success'
					? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/30 dark:text-green-200'
					: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-200'
			}`}
		>
			{feedback.message}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-8">
			<div class="text-gray-500 dark:text-gray-400">{$t('common.loading')}</div>
		</div>
	{:else if !orders || orders.length === 0}
		<div class="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
			<p class="text-gray-500 dark:text-gray-400">{$t('maintenance.messages.noOrders')}</p>
			<div class="mt-4">
				<Button 
					type="button" 
					variant="secondary" 
					text={$t('maintenance.buttons.newOrder')} 
					onclick={openCreate} 
				/>
			</div>
		</div>
	{:else}
		<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-900">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								{$t('maintenance.labels.vehicle')}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								{$t('maintenance.labels.issue')}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								{$t('maintenance.labels.workshop')}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								{$t('maintenance.labels.status')}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								{$t('maintenance.labels.payment')}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								{$t('maintenance.labels.cost')}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								{$t('maintenance.labels.date')}
							</th>
							<th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								{$t('common.actions')}
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
						{#each orders as order (order.id)}
							<tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
									{order.vehicle?.licensePlate || order.vehicleId || '-'}
								</td>
								<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
									<div class="max-w-xs truncate" title={order.reportedIssue}>
										{order.reportedIssue}
									</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
									{order.workshop?.name || '-'}
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span class={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColorMap[order.status] || 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
										{$t(`maintenance.status.${statusKeyMap[order.status] || 'pendingReview'}`)}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span class="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
										{$t(`maintenance.payment.${paymentKeyMap[order.paymentStatus] || 'pending'}`)}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
									{order.totalCost ? formatCurrency(order.totalCost) : '-'}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
									{order.created_at ? formatDate(order.created_at) : '-'}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
									<div class="flex items-center justify-end gap-2">
										<IconButton
											icon={Eye}
											buttonStyles="hover:bg-gray-100 dark:hover:bg-gray-600"
											iconStyles="text-gray-600 dark:text-gray-400"
											ariaLabel={$t('common.view')}
											onclick={() => viewOrder(order)}
										/>
										<IconButton
											icon={Edit}
											buttonStyles="hover:bg-gray-100 dark:hover:bg-gray-600"
											iconStyles="text-gray-600 dark:text-gray-400"
											ariaLabel={$t('common.edit')}
											onclick={() => editOrder(order)}
										/>
										<IconButton
											icon={Trash2}
											buttonStyles="hover:bg-red-100 dark:hover:bg-red-900"
											iconStyles="text-red-600 dark:text-red-400"
											ariaLabel={$t('common.delete')}
											onclick={() => deleteOrder(order)}
										/>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { formatCurrency, formatDate, formatDistance } from '$lib/utils/formatting';
	import { ExternalLink } from '@lucide/svelte';
	import Button from '$components/common/Button.svelte';

	// Types
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
		summary = { total: 0, open: 0, inProgress: 0, completed: 0 },
		recentLogs = []
	} = $props<{
		summary?: MaintenanceSummary;
		recentLogs?: MaintenanceLog[];
	}>();

	// Function to navigate to maintenance section
	function goToMaintenanceSection() {
		window.location.href = '/maintenance';
	}
</script>

<section class="space-y-6">
	<div class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
				{$t('vehicle.detail.maintenanceSummary')}
			</h2>
			<Button 
				type="button" 
				variant="secondary" 
				text={$t('menu.maintenance.label')}
				icon={ExternalLink}
				onclick={goToMaintenanceSection}
			/>
		</div>

		<!-- Summary Cards (Read-only) -->
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

		<!-- Recent Logs (Read-only) -->
		{#if recentLogs.length}
			<div class="mt-6">
				<h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
					{$t('vehicle.detail.lastMaintenance')}
				</h3>
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
				{#if recentLogs.length > 3}
					<div class="mt-4 text-center">
						<Button 
						type="button" 
						variant="secondary" 
						text={$t('common.viewAll')}
						onclick={goToMaintenanceSection}
					/>
					</div>
				{/if}
			</div>
		{:else}
			<div class="mt-6 text-center">
				<p class="text-gray-500 dark:text-gray-300">{$t('vehicle.detail.noMaintenanceLogs')}</p>
				<div class="mt-4">
					<Button 
						type="button" 
						variant="secondary" 
						text={$t('menu.maintenance.label')}
						onclick={goToMaintenanceSection}
					/>
				</div>
			</div>
		{/if}
	</div>
</section>
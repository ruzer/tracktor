<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/stores/i18n';
	import Button from '$components/common/Button.svelte';
	import { BadgeCheck, CalendarClock, FolderEdit } from '@lucide/svelte';
	import type { PolicySummary } from '$lib/stores/insurance-policy';

	const { policies = [], loading = false } = $props<{
		policies: PolicySummary[];
		loading?: boolean;
	}>();

	const dispatch = createEventDispatcher<{
		view: { policy: PolicySummary };
		edit: { policy: PolicySummary };
		renew: { policy: PolicySummary };
	}>();

	function formatStatus(status: PolicySummary['status']) {
		switch (status) {
			case 'active':
				return { label: $t('vehicle.active'), class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' };
			case 'expired':
				return { label: $t('vehicle.expired'), class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
			case 'cancelled':
				return { label: $t('common.notAvailable'), class: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200' };
			default:
				return { label: status, class: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200' };
		}
	}

	function formatType(type: PolicySummary['type']) {
		return type === 'collective'
			? $t('insurance.policies.types.collective')
			: $t('insurance.policies.types.individual');
	}
</script>

{#if loading}
	<p class="flex items-center justify-center gap-4 py-12 text-gray-500 dark:text-gray-300">
		<CalendarClock class="h-5 w-5 animate-spin" /> {$t('common.loading')}
	</p>
{:else if policies.length === 0}
	<div class="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
		{$t('insurance.policies.empty')}
	</div>
{:else}
	<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
			<thead class="bg-gray-50 dark:bg-gray-900/60">
				<tr>
					<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('insurance.forms.fields.policyNumber')}</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('insurance.forms.fields.insurer')}</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('insurance.forms.fields.type')}</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('insurance.forms.fields.endDate')}</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('vehicle.vehicleLabel')}</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('vehicle.insurance')}</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('table.headers.actions')}</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
				{#each policies as policy (policy.id)}
					<tr class="hover:bg-gray-50 dark:hover:bg-gray-900/40">
						<td class="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{policy.policyNumber}</td>
					<td class="px-4 py-3 text-gray-700 dark:text-gray-200">{policy.insurer}</td>
					<td class="px-4 py-3 text-gray-700 dark:text-gray-200">{formatType(policy.type)}</td>
						<td class="px-4 py-3 text-gray-700 dark:text-gray-200">{policy.endDate}</td>
						<td class="px-4 py-3 text-gray-700 dark:text-gray-200">{policy.vehiclesCount}</td>
						<td class="px-4 py-3">
							<span class={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${formatStatus(policy.status).class}`}>
								<BadgeCheck class="h-4 w-4" /> {formatStatus(policy.status).label}
							</span>
						</td>
						<td class="px-4 py-3">
							<div class="flex flex-wrap gap-2">
								<Button
									type="button"
									variant="secondary"
									text={$t('insurance.policies.actions.view')}
									onclick={() => dispatch('view', { policy })}
								/>
								<Button
									type="button"
									variant="ghost"
									icon={FolderEdit}
									onclick={() => dispatch('edit', { policy })}
									ariaLabel={$t('insurance.policies.actions.edit')}
								/>
								<Button
									type="button"
									variant="ghost"
									icon={CalendarClock}
									onclick={() => dispatch('renew', { policy })}
									ariaLabel={$t('insurance.policies.actions.renew')}
								/>
							</div>
						</td>
					</tr>
			{/each}
			</tbody>
		</table>
	</div>
{/if}

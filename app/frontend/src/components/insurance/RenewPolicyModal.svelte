<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import Button from '$components/common/Button.svelte';
	import { t } from '$lib/stores/i18n';
	import type { PolicySummary } from '$lib/stores/insurance-policy';

	let { open = $bindable(false), policy }: { open?: boolean; policy: PolicySummary | null } = $props();

	const dispatch = createEventDispatcher<{
		renew: {
			policyId: string;
			payload: { newStartDate: string; newEndDate: string; notes?: string; extendToVehicles?: boolean };
		};
	}>();

	let form = $state({
		newStartDate: '',
		newEndDate: '',
		notes: '',
		extendToVehicles: true
	});

	$effect(() => {
		if (open && policy) {
			form = {
				newStartDate: policy.startDate,
				newEndDate: policy.endDate,
				notes: '',
				extendToVehicles: true
			};
		}
	});

	function submit() {
		if (!policy) return;
		if (!form.newStartDate || !form.newEndDate) {
			alert($t('insurance.forms.validation.required'));
			return;
		}
		dispatch('renew', {
			policyId: policy.id,
			payload: {
				newStartDate: form.newStartDate,
				newEndDate: form.newEndDate,
				notes: form.notes || undefined,
				extendToVehicles: form.extendToVehicles
			}
		});
		open = false;
	}
</script>

{#if open && policy}
	<ModalContainer title={$t('insurance.forms.renew.title')} onclose={() => (open = false)}>
		<div class="space-y-4">
			<div class="grid grid-cols-1 gap-4">
				<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
					<span>{$t('insurance.forms.renew.startLabel')}</span>
					<input type="date" class="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.newStartDate} />
				</label>
				<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
					<span>{$t('insurance.forms.renew.endLabel')}</span>
					<input type="date" class="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.newEndDate} />
				</label>
				<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
					<span>{$t('insurance.forms.renew.notesLabel')}</span>
					<textarea class="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800" rows={3} bind:value={form.notes}></textarea>
				</label>
				<label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
					<input type="checkbox" bind:checked={form.extendToVehicles} />
					{$t('insurance.forms.renew.extendVehicles')}
				</label>
			</div>

			<div class="flex justify-end gap-3">
				<Button type="button" variant="secondary" text={$t('common.cancel')} onclick={() => (open = false)} />
				<Button type="button" variant="primary" text={$t('insurance.policies.actions.renew')} onclick={submit} />
			</div>
		</div>
	</ModalContainer>
{/if}

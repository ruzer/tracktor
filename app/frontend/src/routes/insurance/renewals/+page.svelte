<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/stores/i18n';
	import PolicyTable from '$components/insurance/PolicyTable.svelte';
	import RenewPolicyModal from '$components/insurance/RenewPolicyModal.svelte';
	import { insurancePoliciesStore } from '$lib/stores/insurance-policy';
	import type { PolicySummary } from '$lib/stores/insurance-policy';

	const policiesStore = insurancePoliciesStore;
	let range = $state(30);
	let renewModalOpen = $state(false);
	let selectedPolicy = $state<PolicySummary | null>(null);

	onMount(async () => {
		await policiesStore.fetchPolicies();
	});

	const soonToExpire = $derived(
		$policiesStore.policies.filter(
			(policy) => policy.status !== 'cancelled' && policy.daysToExpire <= Number(range),
		),
	);

	function openRenew(policy: PolicySummary) {
		selectedPolicy = policy;
		renewModalOpen = true;
	}

	async function handleRenew(event: CustomEvent<{ policyId: string; payload: Record<string, unknown> }>) {
		await policiesStore.renewPolicy(event.detail.policyId, event.detail.payload);
		renewModalOpen = false;
	}
</script>

<section class="container mx-auto flex flex-col gap-6 px-4 py-8">
	<header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
				{$t('insurance.renewals.title')}
			</h1>
			<p class="text-sm text-gray-600 dark:text-gray-300">{$t('insurance.renewals.subtitle')}</p>
		</div>
		<select
			class="w-48 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
			bind:value={range}
		>
			<option value={7}>7 {$t('common.days')}</option>
			<option value={15}>15 {$t('common.days')}</option>
			<option value={30}>30 {$t('common.days')}</option>
			<option value={60}>60 {$t('common.days')}</option>
		</select>
	</header>

	{#if soonToExpire.length === 0}
		<p class="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
			{$t('insurance.renewals.empty')}
		</p>
	{:else}
		<PolicyTable
			policies={soonToExpire}
			loading={$policiesStore.loading}
			on:view={({ detail }) => openRenew(detail.policy)}
			on:edit={({ detail }) => openRenew(detail.policy)}
			on:renew={({ detail }) => openRenew(detail.policy)}
		/>
	{/if}

	<RenewPolicyModal bind:open={renewModalOpen} policy={selectedPolicy} on:renew={handleRenew} />
</section>

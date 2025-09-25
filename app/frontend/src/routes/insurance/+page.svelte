<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/stores/i18n';
	import PolicyTable from '$components/insurance/PolicyTable.svelte';
	import InsurancePolicyModal from '$components/insurance/InsurancePolicyModal.svelte';
	import RenewPolicyModal from '$components/insurance/RenewPolicyModal.svelte';
	import { insurancePoliciesStore } from '$lib/stores/insurance-policy';
	import type { PolicySummary, PolicyDetail } from '$lib/stores/insurance-policy';
	import Button from '$components/common/Button.svelte';

	const policiesStore = insurancePoliciesStore;

	let modalOpen = $state(false);
	let modalMode: 'create' | 'edit' = $state('create');
	let editingPolicy = $state<PolicyDetail | null>(null);
	let renewModalOpen = $state(false);
	let selectedRenewPolicy = $state<PolicySummary | null>(null);

	onMount(() => {
		policiesStore.fetchPolicies();
	});

	async function openCreate() {
		editingPolicy = null;
		modalMode = 'create';
		modalOpen = true;
	}

	async function openPolicy(policy: PolicySummary, _mode: 'view' | 'edit') {
		await policiesStore.fetchPolicy(policy.id);
		editingPolicy = $policiesStore.selected ?? null;
		modalMode = 'edit';
		modalOpen = true;
	}

	function openRenew(policy: PolicySummary) {
		selectedRenewPolicy = policy;
		renewModalOpen = true;
	}

	async function handleSave(event: CustomEvent<{ payload: Record<string, unknown>; policyId?: string }>) {
		const { payload, policyId } = event.detail;
		if (policyId) {
			await policiesStore.updatePolicy(policyId, payload);
		} else {
			await policiesStore.createPolicy(payload);
		}
		modalOpen = false;
	}

	async function handleRenewSubmit(event: CustomEvent<{ policyId: string; payload: Record<string, unknown> }>) {
		await policiesStore.renewPolicy(event.detail.policyId, event.detail.payload);
		renewModalOpen = false;
	}
</script>

<section class="container mx-auto flex flex-col gap-6 px-4 py-8">
	<header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
				{$t('insurance.policies.title')}
			</h1>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				{$t('insurance.policies.subtitle')}
			</p>
		</div>
		<Button type="button" variant="hero" text={$t('insurance.policies.new')} onclick={openCreate} />
	</header>

	<PolicyTable
		policies={$policiesStore.policies}
		loading={$policiesStore.loading}
		on:view={({ detail }) => openPolicy(detail.policy, 'view')}
		on:edit={({ detail }) => openPolicy(detail.policy, 'edit')}
		on:renew={({ detail }) => openRenew(detail.policy)}
	/>

	<InsurancePolicyModal
		bind:open={modalOpen}
		policy={editingPolicy}
		mode={modalMode}
		on:save={handleSave}
	/>

	<RenewPolicyModal
		bind:open={renewModalOpen}
		policy={selectedRenewPolicy}
		on:renew={handleRenewSubmit}
	/>
</section>

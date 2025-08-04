<script lang="ts">
	import FormField from '$components/common/FormField.svelte';
	import FormSubmitButton from '$components/common/FormSubmitButton.svelte';
	import { env } from '$env/dynamic/public';
	import { getCurrencySymbol } from '$lib/utils/formatting';
	import { BadgeDollarSign, Building2, Calendar1, IdCard } from '@lucide/svelte';

	let {
		vehicleId,
		entryToEdit = $bindable(),
		modalVisibility = $bindable(),
		editMode,
		loading,
		callback
	} = $props();

	let insurance = $state({
		provider: '',
		policyNumber: '',
		startDate: '',
		endDate: '',
		cost: null
	});

	let status = $state<{
		message: string | null;
		type: 'ERROR' | 'SUCCESS' | null;
	}>({
		message: null,
		type: null
	});

	$effect(() => {
		if (entryToEdit) {
			Object.assign(insurance, entryToEdit);
		}
	});

	async function persistInsurance() {
		if (
			!insurance.provider ||
			!insurance.policyNumber ||
			!insurance.startDate ||
			!insurance.endDate ||
			!insurance.cost
		) {
			status.message = 'Provider, Policy Number, Start Date, End Date, Cost are required.';
			status.type = 'ERROR';
			return;
		}

		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/insurance/${editMode ? entryToEdit.id : ''}`,
				{
					method: `${editMode ? 'PUT' : 'POST'}`,
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify(insurance)
				}
			);

			if (response.ok) {
				status.message = `Insurance details ${editMode ? 'updated' : 'added'} successfully!`;
				status.type = 'SUCCESS';
				Object.assign(insurance, {
					provider: '',
					policyNumber: '',
					startDate: '',
					endDate: '',
					cost: null
				});
				modalVisibility = false;
			} else {
				const data = await response.json();
				status.message = data.message || 'Failed to save insurance details.';
				status.type = 'ERROR';
			}
		} catch (e) {
			status.message = 'Failed to connect to the server.';
			status.type = 'ERROR';
		}
		loading = false;
		if (status.type === 'SUCCESS') {
			entryToEdit = null;
			callback(true);
		}
	}
</script>

<form
	onsubmit={(e) => {
		persistInsurance();
		e.preventDefault();
	}}
>
	<FormField
		id="provider"
		type="text"
		placeholder="Provider"
		bind:value={insurance.provider}
		icon={Building2}
		required={true}
		ariaLabel="Provider"
	/>
	<FormField
		id="policy-number"
		type="text"
		placeholder="Policy Number"
		bind:value={insurance.policyNumber}
		icon={IdCard}
		required={true}
		ariaLabel="Policy Number"
	/>
	<FormField
		id="start-date"
		type="date"
		placeholder="Start Date"
		bind:value={insurance.startDate}
		icon={Calendar1}
		required={true}
		ariaLabel="Start Date"
	/>
	<FormField
		id="end-date"
		type="date"
		placeholder="End Date"
		bind:value={insurance.endDate}
		icon={Calendar1}
		required={true}
		ariaLabel="End Date"
	/>
	<FormField
		id="cost"
		type="number"
		placeholder="Cost ( {getCurrencySymbol} )"
		bind:value={insurance.cost}
		icon={BadgeDollarSign}
		required={true}
		ariaLabel="Cost"
	/>
	<!-- <FormField
		id="notes"
		type="text"
		placeholder="Notes"
		bind:value={insurance.notes}
		icon={Notebook}
		required={false}
		ariaLabel="Notes"
	/> -->
	<FormSubmitButton text={editMode ? 'Update Insurance' : 'Add Insurance'} {loading} />
</form>

{#if status.message}
	<p
		class={`mt-4 text-center text-sm ${status.type === 'ERROR' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}
	>
		{#if status.type === 'ERROR'}
			<span class="font-semibold">Error:</span> {status.message}
		{:else}
			{status.message}
		{/if}
	</p>
{/if}

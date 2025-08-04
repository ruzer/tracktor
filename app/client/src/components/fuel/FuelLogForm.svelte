<script lang="ts">
	import FormSubmitButton from '$components/common/FormSubmitButton.svelte';
	import { env } from '$env/dynamic/public';
	import { simulateNetworkDelay } from '$lib/utils/dev';
	import { formatDate, getCurrencySymbol } from '$lib/utils/formatting';
	import FormField from '../common/FormField.svelte';
	import { Calendar1, Gauge, Fuel, FileText, BadgeDollarSign } from '@lucide/svelte';

	let {
		vehicleId,
		logToEdit,
		modalVisibility = $bindable(),
		loading = false,
		editMode = false,
		callback
	} = $props();

	let refill = $state({
		date: '',
		odometer: '',
		fuelAmount: '',
		cost: '',
		notes: ''
	});

	let status = $state<{
		message: string | null;
		type: 'ERROR' | 'SUCCESS' | null;
	}>({
		message: null,
		type: null
	});

	async function persistLog() {
		status.message = '';
		if (!vehicleId) {
			status.message = 'No vehicle selected.';
			status.type = 'ERROR';
			return;
		}
		if (!refill.date || !refill.odometer || !refill.fuelAmount || !refill.cost) {
			status.message = 'Please fill in all required fields.';
			status.type = 'ERROR';
			return;
		}
		try {
			if (loading) return; // Prevent multiple submissions
			loading = true;
			status.message = null;
			status.type = null;
			// await simulateNetworkDelay(2000); // Simulate network delay for development
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/fuel-logs/${editMode ? logToEdit.id : ''}`,
				{
					method: `${editMode ? 'PUT' : 'POST'}`,
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify({
						date: refill.date,
						odometer: parseFloat(refill.odometer),
						fuelAmount: parseFloat(refill.fuelAmount),
						cost: parseFloat(refill.cost),
						notes: refill.notes
					})
				}
			);
			if (response.ok) {
				status.message = 'Fuel refill logged successfully.';
				status.type = 'SUCCESS';
				Object.assign(refill, {
					date: '',
					odometer: '',
					fuelAmount: '',
					cost: '',
					notes: ''
				});
			} else {
				const data = await response.json();
				status.message = data?.message || 'Failed to log fuel refill.';
				status.type = 'ERROR';
			}
		} catch (err) {
			status.message = 'Network error. Please try again.';
			status.type = 'ERROR';
		} finally {
			loading = false;
			if (status.type === 'SUCCESS') {
				modalVisibility = false; // Close modal on success
				callback(true);
			}
		}
	}
	$effect(() => {
		Object.assign(refill, logToEdit);
	});
</script>

<form class="space-y-6" onsubmit={persistLog} aria-labelledby="fuel-refill-form-title">
	<FormField
		id="date"
		type="date"
		placeholder="Date"
		bind:value={refill.date}
		icon={Calendar1}
		required={true}
		ariaLabel="Refill Date"
	/>
	<FormField
		id="odometer"
		type="number"
		placeholder="Odometer Reading"
		bind:value={refill.odometer}
		icon={Gauge}
		required={true}
		ariaLabel="Odometer Reading"
		inputClass="step-0.01"
	/>
	<FormField
		id="fuelAmount"
		type="number"
		placeholder="Fuel Amount (Litres)"
		bind:value={refill.fuelAmount}
		icon={Fuel}
		required={true}
		ariaLabel="Fuel Amount"
		inputClass="step-0.01"
	/>
	<FormField
		id="cost"
		type="number"
		placeholder={`Cost ( ${getCurrencySymbol()} )`}
		bind:value={refill.cost}
		icon={BadgeDollarSign}
		required={true}
		ariaLabel="Fuel Cost"
		inputClass="step-0.01"
	/>
	<FormField
		id="notes"
		type="text"
		placeholder="Notes (optional)"
		bind:value={refill.notes}
		icon={FileText}
		ariaLabel="Notes"
	/>
	<FormSubmitButton text={editMode ? 'Save Log' : 'Add Log'} {loading} />
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

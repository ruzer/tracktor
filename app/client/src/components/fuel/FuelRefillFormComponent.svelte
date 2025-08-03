<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FormField from '../common/FormField.svelte';
	import { Calendar1, Gauge, DollarSign, Fuel, FileText } from '@lucide/svelte';
  import { config } from '../../lib/states/config';

  $: formatCurrency = (amount: number) => `${$config.currency} ${amount.toLocaleString()}`

	const dispatch = createEventDispatcher();

	export let refill;
	export let onSubmit;
	export let error = '';
	export let loading = false;
</script>

<form
	class="space-y-6"
	on:submit|preventDefault={onSubmit}
	aria-labelledby="fuel-refill-form-title"
>
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
		placeholder="Fuel Amount (liters)"
		bind:value={refill.fuelAmount}
		icon={Fuel}
		required={true}
		ariaLabel="Fuel Amount"
		inputClass="step-0.01"
	/>
	<FormField
		id="cost"
		type="number"
		placeholder={`Cost (in ${$config.currency})`}
		bind:value={refill.cost}
		icon={DollarSign}
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
	{#if error}
		<div class="text-sm text-red-600 dark:text-red-400" role="alert">
			{error}
		</div>
	{/if}
	<div class="flex justify-center">
		<button
			type="submit"
			class="flex cursor-pointer gap-2 rounded-lg border-2 bg-blue-600 px-3 py-1 text-lg font-semibold text-blue-600 shadow-md dark:text-blue-200"
			disabled={loading}
			aria-busy={loading}
		>
			{loading ? 'Logging...' : 'Log Refill'}
		</button>
	</div>
</form>

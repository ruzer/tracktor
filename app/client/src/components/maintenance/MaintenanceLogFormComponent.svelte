<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  import { config } from '../../lib/states/config';

  $: formatCurrency = (amount: number) => `${$config.currency} ${amount.toLocaleString()}`

	const dispatch = createEventDispatcher();

	export let log;
	export let onSubmit;
	export let error = '';
	export let success = '';
	export let editMode = false;
</script>

<form on:submit|preventDefault={onSubmit}>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="md:col-span-2">
			<label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Date</label
			>
			<input
				type="date"
				id="date"
				bind:value={log.date}
				class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
			/>
		</div>
		<div>
			<label for="odometer" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Odometer</label
			>
			<input
				type="number"
				id="odometer"
				bind:value={log.odometer}
				class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
			/>
		</div>
		<div>
			<label for="cost" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Cost (in {$config.currency})</label
			>
			<input
				type="number"
				id="cost"
				bind:value={log.cost}
				class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
			/>
		</div>
		<div class="md:col-span-2">
			<label for="service" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Service</label
			>
			<input
				type="text"
				id="service"
				bind:value={log.service}
				class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
			/>
		</div>
		<div class="md:col-span-2">
			<label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Notes</label
			>
			<textarea
				id="notes"
				bind:value={log.notes}
				rows="4"
				class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
			></textarea>
		</div>
	</div>

	{#if error}
		<div class="mt-4 text-red-600 dark:text-red-400" role="alert">
			{error}
		</div>
	{/if}

	{#if success}
		<div class="mt-4 text-green-600 dark:text-green-400" role="alert">
			{success}
		</div>
	{/if}

	<div class="mt-8 flex justify-end gap-4">
		<button
			type="button"
			on:click={() => dispatch('close')}
			class="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
			>Cancel</button
		>
		<button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			>{editMode ? 'Update Log' : 'Add Log'}</button
		>
	</div>
</form>

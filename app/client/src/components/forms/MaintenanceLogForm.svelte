<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import FormField from '$components/common/FormField.svelte';
	import { env } from '$env/dynamic/public';
	import { getCurrencySymbol, getDistanceUnit } from '$lib/utils/formatting';
	import { BadgeDollarSign, Calendar1, Gauge, Hammer, Notebook } from '@lucide/svelte';

	let {
		vehicleId,
		logToEdit = $bindable(),
		modalVisibility = $bindable(),
		editMode,
		loading,
		callback
	} = $props();

	let log = $state({
		date: '',
		odometer: null,
		service: '',
		cost: null,
		notes: ''
	});

	let status = $state<{
		message: string | null;
		type: 'ERROR' | 'SUCCESS' | null;
	}>({
		message: null,
		type: null
	});

	$effect(() => {
		if (logToEdit) {
			Object.assign(log, logToEdit);
		}
	});

	async function persistLog() {
		if (!log.date || !log.odometer || !log.service || log.cost === null) {
			status.message = 'Date, Odometer, Service, and Cost are required.';
			status.type = 'ERROR';
			return;
		}

		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/maintenance-logs/${editMode ? logToEdit.id : ''}`,
				{
					method: `${editMode ? 'PUT' : 'POST'}`,
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify(log)
				}
			);

			if (response.ok) {
				status.message = `Maintenance log ${editMode ? 'updated' : 'added'} successfully!`;
				status.type = 'SUCCESS';
				Object.assign(log, {
					date: '',
					odometer: null,
					service: '',
					cost: null,
					notes: ''
				});
				modalVisibility = false;
			} else {
				const data = await response.json();
				status.message =
					data.message || `Failed to ${editMode ? 'update' : 'add'} maintenance log.`;
				status.type = 'ERROR';
			}
		} catch (e) {
			status.message = 'Failed to connect to the server.';
			status.type = 'ERROR';
		}
		loading = false;
		if (status.type === 'SUCCESS') {
			logToEdit = null;
			callback(true);
		}
	}
</script>

<form
	onsubmit={(e) => {
		persistLog();
		e.preventDefault();
	}}
	class="space-y-6"
>
	<FormField
		id="date"
		type="date"
		placeholder="Date"
		bind:value={log.date}
		icon={Calendar1}
		required={true}
		ariaLabel="Log Date"
	/>
	<FormField
		id="odometer"
		type="number"
		placeholder="Odometer ( {getDistanceUnit()} )"
		bind:value={log.odometer}
		icon={Gauge}
		required={true}
		ariaLabel="Odometer Reading"
	/>
	<FormField
		id="cost"
		type="number"
		placeholder="Cost ( {getCurrencySymbol()} )"
		bind:value={log.cost}
		icon={BadgeDollarSign}
		required={true}
		ariaLabel="Service Cost ( {getCurrencySymbol()} )"
	/>
	<FormField
		id="service"
		type="text"
		placeholder="Service"
		bind:value={log.service}
		icon={Hammer}
		required={true}
		ariaLabel="Service Description"
	/>
	<FormField
		id="notes"
		type="textarea"
		placeholder="Notes"
		bind:value={log.notes}
		icon={Notebook}
		required={false}
		ariaLabel="Additional Notes"
	/>
	<Button type="submit" variant="primary" text={editMode ? 'Update' : 'Add'} />
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

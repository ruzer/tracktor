<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import Checkbox from '$components/common/Checkbox.svelte';
	import StatusBlock from '$components/common/StatusBlock.svelte';
	import { env } from '$env/dynamic/public';
	import { handleApiError } from '$lib/models/Error';
	import type { Status } from '$lib/models/status';
	import {
		cleanup,
		getCurrencySymbol,
		getDistanceUnit,
		getVolumeUnit
	} from '$lib/utils/formatting';
	import FormField from '../common/FormField.svelte';
	import {
		Calendar1,
		Gauge,
		Fuel,
		FileText,
		BadgeDollarSign,
		CircleSlash,
		ArrowBigLeftDash
	} from '@lucide/svelte';
	import { t } from '$lib/stores/i18n';

	let {
		vehicleId,
		logToEdit,
		modalVisibility = $bindable(),
		loading = false,
		editMode = false,
		callback
	} = $props();

	let refill = $state({
		date: null,
		odometer: null,
		fuelAmount: null,
		cost: null,
		notes: null,
		missedLast: false,
		filled: true
	});

	let status = $state<Status>({
		message: undefined,
		type: 'INFO'
	});

	$effect(() => {
		Object.assign(refill, logToEdit);
	});

	async function persistLog() {
		if (!vehicleId) {
			status = {
				message: 'No vehicle selected.',
				type: 'ERROR'
			};
			return;
		}
		if (!refill.date || !refill.odometer || !refill.fuelAmount || !refill.cost) {
			status = {
				message: $t('forms.validation.requiredFields'),
				type: 'ERROR'
			};
			return;
		}
		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/fuel-logs/${editMode ? logToEdit.id : ''}`,
				{
					method: `${editMode ? 'PUT' : 'POST'}`,
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify(cleanup(refill))
				}
			);
			if (response.ok) {
				status = {
					message: editMode ? $t('forms.success.fuelLogUpdated') : $t('forms.success.fuelLogAdded'),
					type: 'SUCCESS'
				};
				Object.assign(refill, {
					date: '',
					odometer: '',
					fuelAmount: '',
					cost: '',
					notes: '',
					missedLast: false,
					filled: true
				});
			} else {
				const data = await response.json();
				status = handleApiError(data, editMode);
			}
		} catch (e) {
			console.error(e);
			status = {
				message: $t('forms.errors.connectionFailed'),
				type: 'ERROR'
			};
		} finally {
			loading = false;
			if (status.type === 'SUCCESS') {
				modalVisibility = false;
				callback(true);
			}
		}
	}
</script>

<form class="space-y-6" onsubmit={persistLog} aria-labelledby="fuel-refill-form-title">
	<div class="grid grid-flow-row grid-cols-2 gap-4">
		<FormField
			id="date"
			type="date"
			placeholder={$t('forms.placeholders.date')}
			bind:value={refill.date}
			icon={Calendar1}
			required={true}
			label={$t('forms.labels.date')}
			ariaLabel="Refill Date"
		/>
		<FormField
			id="odometer"
			type="number"
<<<<<<< HEAD
				label={$t('forms.labels.odometer')}
				placeholder={$t('forms.placeholders.odometerReading')}
=======
			label={$t('forms.labels.odometer')}
			placeholder={$t('forms.placeholders.odometerReading')}
>>>>>>> c9d7687 (feat: implement i18n system and advanced ColorPicker)
			bind:value={refill.odometer}
			icon={Gauge}
			required={true}
			ariaLabel="Odometer Reading"
			inputClass="step-0.01"
		/>
	</div>
	<div class="grid grid-flow-row grid-cols-2 gap-4">
		<FormField
			id="fuelAmount"
			type="number"
<<<<<<< HEAD
				placeholder={$t('forms.placeholders.fuelAmountLitres')}
=======
			placeholder={$t('forms.placeholders.fuelAmountLitres')}
>>>>>>> c9d7687 (feat: implement i18n system and advanced ColorPicker)
			bind:value={refill.fuelAmount}
			icon={Fuel}
			label={$t('forms.labels.fuelAmount')}
			ariaLabel="Fuel Amount"
			inputClass="step-0.01"
		/>
		<FormField
			id="cost"
			type="number"
<<<<<<< HEAD
				placeholder={`${$t('forms.placeholders.costCurrency')} ( ${getCurrencySymbol()} )`}
=======
			placeholder={`${$t('forms.placeholders.costCurrency')} ( ${getCurrencySymbol()} )`}
>>>>>>> c9d7687 (feat: implement i18n system and advanced ColorPicker)
			bind:value={refill.cost}
			icon={BadgeDollarSign}
			label={$t('forms.labels.cost')}
			required={true}
			ariaLabel="Fuel Cost"
			inputClass="step-0.01"
		/>
	</div>

	<div class="grid grid-flow-row grid-cols-2 gap-4">
		<Checkbox
			id="filled"
			bind:checked={refill.filled}
			icon={CircleSlash}
			label="Tank Filled?"
			ariaLabel="Tank Filled"
		/>
		<Checkbox
			id="missedLast"
			bind:checked={refill.missedLast}
			icon={ArrowBigLeftDash}
			label="Missed Last?"
			ariaLabel="Previous Fuel Log Missed"
		/>
	</div>

	<FormField
		id="notes"
		type="text"
		placeholder={$t('forms.placeholders.notes')}
		bind:value={refill.notes}
		icon={FileText}
		label={$t('forms.labels.notes')}
		ariaLabel="Notes"
	/>
<<<<<<< HEAD
		<Button type="submit" variant="primary" text={editMode ? $t('forms.buttons.update') : $t('forms.buttons.add')} />
=======
	<Button type="submit" variant="primary" text={editMode ? $t('forms.buttons.update') : $t('forms.buttons.add')} />
>>>>>>> c9d7687 (feat: implement i18n system and advanced ColorPicker)
</form>
<StatusBlock message={status.message} type={status.type} />

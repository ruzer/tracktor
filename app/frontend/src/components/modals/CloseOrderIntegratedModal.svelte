<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { closeMaintenanceOrderWithIntegration } from '$lib/services/maintenanceIntegrationService';
	import type { MaintenanceOrderCloseData } from '$lib/services/maintenanceIntegrationService';
	import {
		maintenanceOrderStatusOptions,
		maintenancePaymentStatusOptions
	} from '$lib/constants/maintenance-orders';
	
	// Components
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import FormField from '$components/common/FormField.svelte';
	import Button from '$components/common/Button.svelte';
	import StatusBlock from '$components/common/StatusBlock.svelte';

	// Store
	import { closeOrderIntegratedModalStore } from '$lib/stores/maintenance-integration';
	
	// State from store
	let showModal = $state(false);
	let vehicleId = $state<string>('');
	let orderId = $state<string>('');
	let onSuccess = $state<() => void>(() => {});

	// Subscribe to store
	closeOrderIntegratedModalStore.subscribe((state) => {
		showModal = state.show;
		vehicleId = state.vehicleId || '';
		orderId = state.orderId || '';
		onSuccess = state.callback || (() => {});
		if (state.orderId) {
			form.orderId = state.orderId;
		}
	});

	// State
	let loading = $state(false);
	let status = $state({ message: undefined as string | undefined, type: 'INFO' as 'INFO' | 'ERROR' | 'SUCCESS' });

	// Form data
	let form = $state<MaintenanceOrderCloseData & {
		autoGenerateLog: boolean;
	}>({
		orderId: '',
		status: 'closed',
		paymentStatus: 'paid',
		finalCost: 0,
		finalOdometer: 0,
		completionNotes: '',
		autoGenerateLog: true
	});

	function closeModal() {
		closeOrderIntegratedModalStore.hide();
		resetForm();
	}

	function resetForm() {
		Object.assign(form, {
			orderId: '',
			status: 'closed',
			paymentStatus: 'paid',
			finalCost: 0,
			finalOdometer: 0,
			completionNotes: '',
			autoGenerateLog: true
		});
		Object.assign(status, { message: undefined, type: 'INFO' });
	}

	async function handleSubmit() {
		if (!form.orderId || !form.status) {
			Object.assign(status, {
				message: $t('maintenance.errors.requiredFields'),
				type: 'ERROR'
			});
			return;
		}

		if (form.autoGenerateLog && (!form.finalOdometer || form.finalOdometer <= 0)) {
			Object.assign(status, {
				message: $t('maintenance.errors.odometerRequired'),
				type: 'ERROR'
			});
			return;
		}

		loading = true;
		Object.assign(status, { message: undefined, type: 'INFO' });

		try {
			const closeData: MaintenanceOrderCloseData = {
				orderId: form.orderId,
				status: form.status,
				paymentStatus: form.paymentStatus,
				finalCost: form.finalCost,
				finalOdometer: form.autoGenerateLog ? form.finalOdometer : undefined,
				completionNotes: form.completionNotes || undefined,
				autoGenerateLog: form.autoGenerateLog
			};

			const result = await closeMaintenanceOrderWithIntegration(closeData);
			
			Object.assign(status, {
				message: result.message,
				type: 'SUCCESS'
			});

			setTimeout(() => {
				onSuccess();
				closeModal();
			}, 1500);

		} catch (error) {
			Object.assign(status, {
				message: error instanceof Error ? error.message : $t('common.error'),
				type: 'ERROR'
			});
		} finally {
			loading = false;
		}
	}
</script>

{#if showModal && orderId}
	<ModalContainer
		onclose={closeModal}
		title={$t('maintenance.integrated.closeOrderTitle')}
		{loading}
	>
		<div class="space-y-6">
			<!-- Información de la orden -->
			<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
					{$t('maintenance.integrated.orderDetails')}
				</h3>
				<p class="text-sm text-gray-600 dark:text-gray-300">
					<strong>{$t('maintenance.labels.orderId')}:</strong> {orderId}
				</p>
			</div>

			<!-- Estado y pago -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label class="pl-2 text-lg text-gray-400" for="close-status">
						{$t('maintenance.labels.finalStatus')}
					</label>
					<select
						id="close-status"
						class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
						bind:value={form.status}
					>
						{#each maintenanceOrderStatusOptions.filter(opt => opt.value === 'closed' || opt.value === 'rejected') as option}
							<option value={option.value}>{$t(option.labelKey)}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="pl-2 text-lg text-gray-400" for="payment-status">
						{$t('maintenance.labels.paymentStatus')}
					</label>
					<select
						id="payment-status"
						class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
						bind:value={form.paymentStatus}
					>
						{#each maintenancePaymentStatusOptions as option}
							<option value={option.value}>{$t(option.labelKey)}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Costo final -->
			<FormField
				id="final-cost"
				type="number"
				label={$t('maintenance.labels.finalCost')}
				bind:value={form.finalCost}
			/>

			<!-- Opción de generar registro automáticamente -->
			<div class="space-y-4 border-t pt-4">
				<div class="flex items-center space-x-3">
					<input
						id="auto-generate-log"
						type="checkbox"
						class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						bind:checked={form.autoGenerateLog}
					/>
					<label for="auto-generate-log" class="text-sm font-medium text-gray-700 dark:text-gray-300">
						{$t('maintenance.integrated.autoGenerateLog')}
					</label>
				</div>

				{#if form.autoGenerateLog}
					<div class="space-y-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
						<h4 class="text-md font-semibold text-green-900 dark:text-green-100">
							{$t('maintenance.integrated.logInfo')}
						</h4>

						<FormField
							id="final-odometer"
							type="number"
							label={$t('maintenance.labels.finalOdometer')}
							bind:value={form.finalOdometer}
							required
						/>
					</div>
				{/if}
			</div>

			<!-- Notas de finalización -->
			<div>
				<label class="pl-2 text-lg text-gray-400" for="completion-notes">
					{$t('maintenance.labels.completionNotes')}
				</label>
				<textarea
					id="completion-notes"
					class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
					placeholder={$t('maintenance.placeholders.completionNotes')}
					bind:value={form.completionNotes}
				></textarea>
			</div>

			<div class="flex gap-3">
				<Button
					type="button"
					variant="secondary"
					text={$t('common.cancel')}
					onclick={closeModal}
				/>
				<Button
					type="button"
					variant="primary"
					text={$t('maintenance.integrated.closeOrder')}
					onclick={handleSubmit}
				/>
			</div>

			<StatusBlock message={status.message} type={status.type} />
		</div>
	</ModalContainer>
{/if}
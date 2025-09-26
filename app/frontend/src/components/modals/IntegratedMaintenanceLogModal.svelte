<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/stores/i18n';
	import { createMaintenanceLogWithIntegration } from '$lib/services/maintenanceIntegrationService';
	import type { MaintenanceLogWithIntegration } from '$lib/services/maintenanceIntegrationService';
	
	// Components
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import FormField from '$components/common/FormField.svelte';
	import Button from '$components/common/Button.svelte';
	import StatusBlock from '$components/common/StatusBlock.svelte';

	// Store
	import { integratedLogModalStore } from '$lib/stores/maintenance-integration';
	
	// State from store
	let showModal = $state(false);
	let vehicleId = $state<string>('');
	let onSuccess = $state<() => void>(() => {});

	// Subscribe to store
	integratedLogModalStore.subscribe((state) => {
		showModal = state.show;
		vehicleId = state.vehicleId || '';
		onSuccess = state.callback || (() => {});
	});

	// State
	let loading = $state(false);
	let status = $state({ message: undefined as string | undefined, type: 'INFO' as 'INFO' | 'ERROR' | 'SUCCESS' });

	// Form data
	let form = $state<MaintenanceLogWithIntegration & {
		orderData: {
			reportedIssue: string;
			createdBy: string;
			workshop: {
				name: string;
				contactName: string;
				contactPhone: string;
				contactEmail: string;
				address: string;
			};
		};
	}>({
		date: new Date().toISOString().split('T')[0],
		odometer: 0,
		serviceCenter: '',
		cost: 0,
		notes: '',
		autoGenerateOrder: false,
		orderData: {
			reportedIssue: '',
			createdBy: '',
			workshop: {
				name: '',
				contactName: '',
				contactPhone: '',
				contactEmail: '',
				address: ''
			}
		}
	});

	function closeModal() {
		integratedLogModalStore.hide();
		resetForm();
	}

	function resetForm() {
		Object.assign(form, {
			date: new Date().toISOString().split('T')[0],
			odometer: 0,
			serviceCenter: '',
			cost: 0,
			notes: '',
			autoGenerateOrder: false,
			orderData: {
				reportedIssue: '',
				createdBy: '',
				workshop: {
					name: '',
					contactName: '',
					contactPhone: '',
					contactEmail: '',
					address: ''
				}
			}
		});
		Object.assign(status, { message: undefined, type: 'INFO' });
	}

	async function handleSubmit() {
		if (!form.date || !form.serviceCenter || form.cost < 0) {
			Object.assign(status, {
				message: $t('maintenance.errors.requiredFields'),
				type: 'ERROR'
			});
			return;
		}

		if (form.autoGenerateOrder && (!form.orderData.reportedIssue || !form.orderData.createdBy)) {
			Object.assign(status, {
				message: $t('maintenance.errors.orderDataRequired'),
				type: 'ERROR'
			});
			return;
		}

		loading = true;
		Object.assign(status, { message: undefined, type: 'INFO' });

		try {
			const logData: MaintenanceLogWithIntegration = {
				date: form.date,
				odometer: form.odometer,
				serviceCenter: form.serviceCenter,
				cost: form.cost,
				notes: form.notes || undefined,
				autoGenerateOrder: form.autoGenerateOrder
			};

			if (form.autoGenerateOrder) {
				logData.orderData = {
					reportedIssue: form.orderData.reportedIssue,
					createdBy: form.orderData.createdBy,
					workshop: form.orderData.workshop.name ? {
						name: form.orderData.workshop.name,
						contactName: form.orderData.workshop.contactName || undefined,
						contactPhone: form.orderData.workshop.contactPhone || undefined,
						contactEmail: form.orderData.workshop.contactEmail || undefined,
						address: form.orderData.workshop.address || undefined
					} : undefined
				};
			}

			const result = await createMaintenanceLogWithIntegration(vehicleId, logData);
			
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

{#if showModal}
	<ModalContainer
		onclose={closeModal}
		title={$t('maintenance.integrated.newLogTitle')}
		{loading}
	>
		<div class="space-y-6">
			<!-- Información básica del registro -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{$t('maintenance.integrated.logInfo')}
				</h3>
				
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						id="log-date"
						type="date"
						label={$t('forms.labels.date')}
						bind:value={form.date}
						required
					/>
					<FormField
						id="log-odometer"
						type="number"
						label={$t('forms.labels.odometer')}
						bind:value={form.odometer}
					/>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						id="log-service-center"
						type="text"
						label={$t('forms.labels.serviceCenter')}
						bind:value={form.serviceCenter}
						required
					/>
					<FormField
						id="log-cost"
						type="number"
						label={$t('forms.labels.cost')}
						bind:value={form.cost}
					/>
				</div>

				<div>
					<label class="pl-2 text-lg text-gray-400" for="log-notes">
						{$t('forms.labels.notes')}
					</label>
					<textarea
						id="log-notes"
						class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
						placeholder={$t('maintenance.placeholders.notes')}
						bind:value={form.notes}
					></textarea>
				</div>
			</div>

			<!-- Opción de generar orden automáticamente -->
			<div class="space-y-4 border-t pt-4">
				<div class="flex items-center space-x-3">
					<input
						id="auto-generate-order"
						type="checkbox"
						class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						bind:checked={form.autoGenerateOrder}
					/>
					<label for="auto-generate-order" class="text-sm font-medium text-gray-700 dark:text-gray-300">
						{$t('maintenance.integrated.autoGenerateOrder')}
					</label>
				</div>

				{#if form.autoGenerateOrder}
					<div class="space-y-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
						<h4 class="text-md font-semibold text-blue-900 dark:text-blue-100">
							{$t('maintenance.integrated.orderInfo')}
						</h4>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								id="order-reported-issue"
								type="text"
								label={$t('maintenance.labels.reportedIssue')}
								bind:value={form.orderData.reportedIssue}
								required
							/>
							<FormField
								id="order-created-by"
								type="text"
								label={$t('maintenance.labels.createdBy')}
								bind:value={form.orderData.createdBy}
								required
							/>
						</div>

						<!-- Información del taller -->
						<div class="space-y-3">
							<p class="text-sm font-semibold text-blue-800 dark:text-blue-200">
								{$t('maintenance.labels.workshopInfo')}
							</p>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									id="order-workshop-name"
									type="text"
									label={$t('maintenance.labels.workshopName')}
									bind:value={form.orderData.workshop.name}
								/>
								<FormField
									id="order-workshop-contact"
									type="text"
									label={$t('maintenance.labels.workshopContact')}
									bind:value={form.orderData.workshop.contactName}
								/>
							</div>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									id="order-workshop-phone"
									type="text"
									label={$t('maintenance.labels.workshopPhone')}
									bind:value={form.orderData.workshop.contactPhone}
								/>
								<FormField
									id="order-workshop-email"
									type="email"
									label={$t('maintenance.labels.workshopEmail')}
									bind:value={form.orderData.workshop.contactEmail}
								/>
							</div>
							<FormField
								id="order-workshop-address"
								type="text"
								label={$t('maintenance.labels.workshopAddress')}
								bind:value={form.orderData.workshop.address}
							/>
						</div>
					</div>
				{/if}
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
					text={$t('maintenance.integrated.createLog')}
					onclick={handleSubmit}
				/>
			</div>

			<StatusBlock message={status.message} type={status.type} />
		</div>
	</ModalContainer>
{/if}
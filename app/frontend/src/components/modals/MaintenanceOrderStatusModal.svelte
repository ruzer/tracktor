<script lang="ts">
	import { maintenanceOrderStatusModalStore } from '$lib/stores/maintenance-order';
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import Button from '$components/common/Button.svelte';
	import StatusBlock from '$components/common/StatusBlock.svelte';
	import FormField from '$components/common/FormField.svelte';
	import {
		maintenanceOrderStatusOptions,
		maintenancePaymentStatusOptions
	} from '$lib/constants/maintenance-orders';
	import { getApiUrl } from '$lib/utils/api';
	import { t } from '$lib/stores/i18n';

	let vehicleId = $state<string | undefined>(undefined);
	let order: any = $state(undefined);
	let showModal = $state(false);
	let callback: ((reloaded: boolean) => void) | undefined = undefined;
	let loading = $state(false);

	let form = $state({
		status: 'pending_review',
		paymentStatus: 'pending',
		notes: '',
		userId: '',
		authorizedBy: '',
		authorizedAt: '',
		totalEstimated: '',
		totalFinal: '',
		quoteFile: '',
		invoiceFile: ''
	});

	let statusState = $state<{ message?: string; type: 'INFO' | 'ERROR' | 'SUCCESS' }>({
		message: undefined,
		type: 'INFO'
	});

	maintenanceOrderStatusModalStore.subscribe((state) => {
		vehicleId = state.vehicleId;
		order = state.order;
		showModal = state.show;
		callback = state.callback;
		loading = false;

		if (state.show && state.order) {
			statusState = { message: undefined, type: 'INFO' };
			form = {
				status: state.order.status ?? 'pending_review',
				paymentStatus: state.order.paymentStatus ?? 'pending',
				notes: '',
				userId: '',
				authorizedBy: state.order.authorizedBy ?? '',
				authorizedAt: state.order.authorizedAt ?? '',
				totalEstimated: state.order.totalEstimated?.toString() ?? '',
				totalFinal: state.order.totalFinal?.toString() ?? '',
				quoteFile: state.order.quoteFile ?? '',
				invoiceFile: state.order.invoiceFile ?? ''
			};
		}
	});

	const closeModal = () => maintenanceOrderStatusModalStore.hide(false);

	async function updateOrder() {
		if (!vehicleId || !order) {
			statusState = {
				message: $t('maintenance.errors.vehicleRequired'),
				type: 'ERROR'
			};
			return;
		}

		loading = true;
		statusState = { message: undefined, type: 'INFO' };

		try {
			const payload: Record<string, unknown> = {
				status: form.status,
				paymentStatus: form.paymentStatus,
				notes: form.notes || undefined,
				userId: form.userId || undefined,
				authorizedBy: form.authorizedBy || undefined,
				authorizedAt: form.authorizedAt || undefined,
				quoteFile: form.quoteFile || undefined,
				invoiceFile: form.invoiceFile || undefined,
				totalEstimated: form.totalEstimated ? Number(form.totalEstimated) : undefined,
				totalFinal: form.totalFinal ? Number(form.totalFinal) : undefined
			};

			const response = await fetch(
				getApiUrl(`/api/vehicles/${vehicleId}/maintenance-orders/${order.id}`),
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify(payload)
				}
			);

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data?.message || $t('maintenance.errors.updateFailed'));
			}

			statusState = {
				message: $t('maintenance.messages.orderUpdated'),
				type: 'SUCCESS'
			};
			maintenanceOrderStatusModalStore.hide(true);
		} catch (error) {
			console.error('Failed to update maintenance order', error);
			statusState = {
				message: error instanceof Error ? error.message : $t('maintenance.errors.updateFailed'),
				type: 'ERROR'
			};
		} finally {
			loading = false;
		}
	}
</script>

{#if showModal && order}
	<ModalContainer
		onclose={closeModal}
		title={$t('maintenance.titles.updateOrder')}
		{loading}
	>
		<div class="space-y-5">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label class="pl-2 text-lg text-gray-400" for="update-status">
						{$t('maintenance.labels.status')}
					</label>
					<select
						id="update-status"
						class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
						bind:value={form.status}
					>
						{#each maintenanceOrderStatusOptions as option}
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

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					id="authorizedBy"
					type="text"
					label={$t('maintenance.labels.authorizedBy')}
					placeholder={$t('maintenance.placeholders.authorizedBy')}
					bind:value={form.authorizedBy}
				/>
				<FormField
					id="authorizedAt"
					type="date"
					label={$t('maintenance.labels.authorizedAt')}
					bind:value={form.authorizedAt}
				/>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					id="totalEstimated"
					type="number"
					label={$t('maintenance.labels.totalEstimated')}
					inputClass="step-0.01"
					bind:value={form.totalEstimated}
				/>
				<FormField
					id="totalFinal"
					type="number"
					label={$t('maintenance.labels.totalFinal')}
					inputClass="step-0.01"
					bind:value={form.totalFinal}
				/>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					id="quoteFile"
					type="text"
					label={$t('maintenance.labels.quoteFile')}
					placeholder={$t('maintenance.placeholders.fileUrl')}
					bind:value={form.quoteFile}
				/>
				<FormField
					id="invoiceFile"
					type="text"
					label={$t('maintenance.labels.invoiceFile')}
					placeholder={$t('maintenance.placeholders.fileUrl')}
					bind:value={form.invoiceFile}
				/>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					id="userId"
					type="text"
					label={$t('maintenance.labels.userId')}
					placeholder={$t('maintenance.placeholders.userId')}
					bind:value={form.userId}
				/>
			</div>

			<div>
				<label class="pl-2 text-lg text-gray-400" for="status-notes">
					{$t('maintenance.labels.notes')}
				</label>
				<textarea
					id="status-notes"
					class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
					placeholder={$t('maintenance.placeholders.notes')}
					bind:value={form.notes}
				></textarea>
			</div>

			<Button
				type="button"
				variant="primary"
				text={$t('maintenance.buttons.saveChanges')}
				onclick={updateOrder}
			/>
			<StatusBlock message={statusState.message} type={statusState.type} />
		</div>
	</ModalContainer>
{/if}

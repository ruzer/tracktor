<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import Button from '$components/common/Button.svelte';
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import { X } from '@lucide/svelte';

	// Types
	interface MaintenanceOrder {
		id?: string;
		vehicleId: string;
		reportedIssue: string;
		description?: string;
		status: string;
		paymentStatus: string;
		totalCost?: number;
		workshop?: {
			name: string;
			contactPhone?: string;
			contactEmail?: string;
		};
	}

	// Props
	let {
		isOpen = false,
		order = null,
		onClose = () => {},
		onSave = () => {}
	} = $props<{
		isOpen?: boolean;
		order?: MaintenanceOrder | null;
		onClose?: () => void;
		onSave?: (order: MaintenanceOrder) => void;
	}>();

	// Form state
	let formData = {
		vehicleId: '',
		reportedIssue: '',
		description: '',
		status: 'pending_review',
		paymentStatus: 'pending',
		totalCost: 0,
		workshopName: '',
		workshopPhone: '',
		workshopEmail: ''
	};

	let loading = false;
	let errors: Record<string, string> = {};

	// Reset form when modal opens/closes or order changes
	$effect(() => {
		if (isOpen) {
			if (order) {
				// Edit mode
				formData = {
					vehicleId: order.vehicleId || '',
					reportedIssue: order.reportedIssue || '',
					description: order.description || '',
					status: order.status || 'pending_review',
					paymentStatus: order.paymentStatus || 'pending',
					totalCost: order.totalCost || 0,
					workshopName: order.workshop?.name || '',
					workshopPhone: order.workshop?.contactPhone || '',
					workshopEmail: order.workshop?.contactEmail || ''
				};
			} else {
				// Create mode
				formData = {
					vehicleId: '',
					reportedIssue: '',
					description: '',
					status: 'pending_review',
					paymentStatus: 'pending',
					totalCost: 0,
					workshopName: '',
					workshopPhone: '',
					workshopEmail: ''
				};
			}
			errors = {};
		}
	});

	function validateForm(): boolean {
		errors = {};

		if (!formData.vehicleId.trim()) {
			errors.vehicleId = $t('forms.validation.required');
		}

		if (!formData.reportedIssue.trim()) {
			errors.reportedIssue = $t('forms.validation.required');
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		loading = true;
		try {
			const orderData: MaintenanceOrder = {
				...(order?.id && { id: order.id }),
				vehicleId: formData.vehicleId,
				reportedIssue: formData.reportedIssue,
				description: formData.description,
				status: formData.status,
				paymentStatus: formData.paymentStatus,
				totalCost: formData.totalCost || undefined,
				workshop: formData.workshopName ? {
					name: formData.workshopName,
					contactPhone: formData.workshopPhone || undefined,
					contactEmail: formData.workshopEmail || undefined
				} : undefined
			};

			await onSave(orderData);
			onClose();
		} catch (error) {
			console.error('Error saving maintenance order:', error);
		} finally {
			loading = false;
		}
	}

	function handleClose() {
		if (!loading) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<ModalContainer onclose={handleClose} title={order ? $t('maintenance.titles.editOrder') : $t('maintenance.titles.createOrder')}>
		<form onsubmit={handleSubmit} class="space-y-6">
			<!-- Vehicle ID -->
			<div>
				<label for="vehicleId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					{$t('maintenance.labels.vehicle')} *
				</label>
				<input
					id="vehicleId"
					type="text"
					bind:value={formData.vehicleId}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
					placeholder={$t('maintenance.placeholders.vehicleId')}
					disabled={loading}
					required
				/>
				{#if errors.vehicleId}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.vehicleId}</p>
				{/if}
			</div>

			<!-- Reported Issue -->
			<div>
				<label for="reportedIssue" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					{$t('maintenance.labels.issue')} *
				</label>
				<input
					id="reportedIssue"
					type="text"
					bind:value={formData.reportedIssue}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
					placeholder={$t('maintenance.placeholders.issue')}
					disabled={loading}
					required
				/>
				{#if errors.reportedIssue}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reportedIssue}</p>
				{/if}
			</div>

			<!-- Description -->
			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					{$t('maintenance.labels.description')}
				</label>
				<textarea
					id="description"
					bind:value={formData.description}
					rows="3"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
					placeholder={$t('maintenance.placeholders.description')}
					disabled={loading}
				></textarea>
			</div>

			<!-- Status and Payment Status -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div>
					<label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						{$t('maintenance.labels.status')}
					</label>
					<select
						id="status"
						bind:value={formData.status}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
						disabled={loading}
					>
						<option value="pending_review">{$t('maintenance.status.pendingReview')}</option>
						<option value="quotation">{$t('maintenance.status.quotation')}</option>
						<option value="authorized">{$t('maintenance.status.authorized')}</option>
						<option value="rejected">{$t('maintenance.status.rejected')}</option>
						<option value="in_workshop">{$t('maintenance.status.inWorkshop')}</option>
						<option value="in_repair">{$t('maintenance.status.inRepair')}</option>
						<option value="repaired_pending_payment">{$t('maintenance.status.repairedPendingPayment')}</option>
						<option value="closed">{$t('maintenance.status.closed')}</option>
					</select>
				</div>

				<div>
					<label for="paymentStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						{$t('maintenance.labels.payment')}
					</label>
					<select
						id="paymentStatus"
						bind:value={formData.paymentStatus}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
						disabled={loading}
					>
						<option value="pending">{$t('maintenance.payment.pending')}</option>
						<option value="partial">{$t('maintenance.payment.partial')}</option>
						<option value="paid">{$t('maintenance.payment.paid')}</option>
					</select>
				</div>
			</div>

			<!-- Total Cost -->
			<div>
				<label for="totalCost" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					{$t('maintenance.labels.cost')}
				</label>
				<input
					id="totalCost"
					type="number"
					step="0.01"
					min="0"
					bind:value={formData.totalCost}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
					placeholder="0.00"
					disabled={loading}
				/>
			</div>

			<!-- Workshop Information -->
			<div class="space-y-4">
				<h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
					{$t('maintenance.labels.workshopInfo')}
				</h3>

				<div>
					<label for="workshopName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						{$t('maintenance.labels.workshopName')}
					</label>
					<input
						id="workshopName"
						type="text"
						bind:value={formData.workshopName}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
						placeholder={$t('maintenance.placeholders.workshopName')}
						disabled={loading}
					/>
				</div>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<label for="workshopPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							{$t('maintenance.labels.phone')}
						</label>
						<input
							id="workshopPhone"
							type="tel"
							bind:value={formData.workshopPhone}
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
							placeholder={$t('maintenance.placeholders.phone')}
							disabled={loading}
						/>
					</div>

					<div>
						<label for="workshopEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							{$t('maintenance.labels.email')}
						</label>
						<input
							id="workshopEmail"
							type="email"
							bind:value={formData.workshopEmail}
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
							placeholder={$t('maintenance.placeholders.email')}
							disabled={loading}
						/>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
				<Button
					type="button"
					variant="secondary"
					text={$t('common.cancel')}
					onclick={handleClose}
				/>
				<Button
					type="submit"
					variant="primary"
					text={loading ? $t('common.saving') : (order ? $t('common.update') : $t('common.create'))}
				/>
			</div>
		</form>
	</ModalContainer>
{/if}
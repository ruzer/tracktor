<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { maintenanceOrderModalStore } from '$lib/stores/maintenance-order';
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import FormField from '$components/common/FormField.svelte';
	import Button from '$components/common/Button.svelte';
	import StatusBlock from '$components/common/StatusBlock.svelte';
	import { maintenanceOrderStatusOptions } from '$lib/constants/maintenance-orders';
	import { getApiUrl } from '$lib/utils/api';
	import { t } from '$lib/stores/i18n';
	import type { Vehicle } from '$lib/models/vehicle';

	let vehicleId = $state<string | undefined>(undefined);
	let order = $state<any>(undefined);
	let showModal = $state(false);
	let callback: ((reloaded: boolean) => void) | undefined = undefined;
	let loading = $state(false);

	let availableVehicles = $state<Array<Pick<Vehicle, 'id' | 'licensePlate' | 'make' | 'model' | 'year'>>>([]);
	let loadingVehicles = $state(false);
	let vehiclesError = $state<string | null>(null);

	let form = $state({
		vehicleId: '',
		reportedIssue: '',
		createdBy: '',
		status: 'pending_review',
		workshop: {
			name: '',
			contactName: '',
			contactPhone: '',
			contactEmail: '',
			address: ''
		},
		notes: ''
	});

	let status = $state<{ message?: string; type: 'INFO' | 'ERROR' | 'SUCCESS' }>({
		message: undefined,
		type: 'INFO'
	});

	maintenanceOrderModalStore.subscribe((state) => {
		vehicleId = state.vehicleId && state.vehicleId.trim().length > 0 ? state.vehicleId : undefined;
		order = state.order;
		showModal = state.show;
		callback = state.callback;
		loading = false;

		if (state.show) {
			const selectedVehicleId =
				state.vehicleId && state.vehicleId.trim().length > 0
					? state.vehicleId
					: state.order?.vehicleId ?? '';

			status = { message: undefined, type: 'INFO' };
			form = {
				vehicleId: selectedVehicleId,
				reportedIssue: state.order?.reportedIssue ?? '',
				createdBy: state.order?.createdBy ?? '',
				status: state.order?.status ?? 'pending_review',
				workshop: {
					name: state.order?.workshop?.name ?? '',
					contactName: state.order?.workshop?.contactName ?? '',
					contactPhone: state.order?.workshop?.contactPhone ?? '',
					contactEmail: state.order?.workshop?.contactEmail ?? '',
					address: state.order?.workshop?.address ?? ''
				},
				notes: ''
			};

			if (!selectedVehicleId) {
				loadVehicles();
			} else {
				vehiclesError = null;
			}
		}
	});

const closeModal = () => maintenanceOrderModalStore.hide(false);

async function loadVehicles() {
	if (!browser) return;
	const translate = get(t);
	const pin = localStorage.getItem('userPin');
	if (!pin) {
		vehiclesError = translate('maintenance.errors.loadVehiclesFailed');
		return;
	}

	loadingVehicles = true;
	vehiclesError = null;

	try {
		const response = await fetch(getApiUrl('/api/vehicles'), {
			headers: {
				'X-User-PIN': pin
			}
		});

		const payload = await response.json().catch(() => null);

		if (!response.ok) {
			vehiclesError =
				payload?.message ?? translate('maintenance.errors.loadVehiclesFailed');
			availableVehicles = [];
			return;
		}

		if (Array.isArray(payload)) {
			availableVehicles = payload.map((vehicle: Vehicle) => ({
				id: vehicle.id,
				licensePlate: vehicle.licensePlate,
				make: vehicle.make,
				model: vehicle.model,
				year: vehicle.year
			}));
		} else {
			vehiclesError = translate('maintenance.errors.loadVehiclesFailed');
			availableVehicles = [];
		}
	} catch (error) {
		console.error('Failed to load vehicles', error);
		vehiclesError = translate('errors.networkError');
		availableVehicles = [];
	} finally {
		loadingVehicles = false;
	}
}

async function persistOrder() {
		const translate = get(t);
		const effectiveVehicleId =
			vehicleId && vehicleId.trim().length > 0 ? vehicleId : form.vehicleId?.trim();

		if (!effectiveVehicleId) {
			status = {
				message: translate('maintenance.errors.vehicleRequired'),
				type: 'ERROR'
			};
			return;
		}
		if (!form.reportedIssue || !form.createdBy) {
			status = {
				message: translate('maintenance.errors.requiredFields'),
				type: 'ERROR'
			};
			return;
		}

		loading = true;
		status = { message: undefined, type: 'INFO' };

		try {
			const pin = localStorage.getItem('userPin');
			if (!pin) {
				goto('/login', { replaceState: true });
				return;
			}

			const isVehicleScoped = vehicleId && vehicleId.trim().length > 0;
			const endpoint = isVehicleScoped
				? `/api/vehicles/${vehicleId}/maintenance-orders${order ? `/${order.id}` : ''}`
				: `/api/maintenance/orders${order ? `/${order.id}` : ''}`;

			const body: Record<string, unknown> = {
				reportedIssue: form.reportedIssue,
				createdBy: form.createdBy,
				status: form.status,
				workshop: form.workshop.name
					? {
						name: form.workshop.name,
						contactName: form.workshop.contactName || undefined,
						contactPhone: form.workshop.contactPhone || undefined,
						contactEmail: form.workshop.contactEmail || undefined,
						address: form.workshop.address || undefined
					}
					: undefined,
				notes: form.notes || undefined
			};

			if (!isVehicleScoped) {
				body.vehicleId = effectiveVehicleId;
			}

			const response = await fetch(
				getApiUrl(endpoint),
				{
					method: order ? 'PATCH' : 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': pin
					},
					body: JSON.stringify(body)
				}
			);

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data?.message || translate('maintenance.errors.saveFailed'));
			}

			status = {
				message: order
					? translate('maintenance.messages.orderUpdated')
					: translate('maintenance.messages.orderCreated'),
				type: 'SUCCESS'
			};
			maintenanceOrderModalStore.hide(true);
		} catch (error) {
			console.error('Failed to persist maintenance order', error);
			status = {
				message:
					error instanceof Error
						? error.message
						: translate('maintenance.errors.saveFailed'),
				type: 'ERROR'
			};
		} finally {
			loading = false;
		}
}
</script>

{#if showModal}
	<ModalContainer
		onclose={closeModal}
		title={order ? $t('maintenance.titles.editOrder') : $t('maintenance.titles.newOrder')}
		{loading}
	>
		<div class="space-y-5">
			{#if !vehicleId}
				<div class="space-y-2">
					<label class="pl-2 text-lg text-gray-400" for="vehicle-selector">
						{$t('maintenance.labels.vehicle')}
					</label>
					{#if loadingVehicles}
						<p class="text-sm text-gray-500 dark:text-gray-300">{$t('common.loading')}</p>
					{:else}
						<select
							id="vehicle-selector"
							class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
							bind:value={form.vehicleId}
						>
							<option value="">{$t('maintenance.placeholders.selectVehicle')}</option>
							{#each availableVehicles as vehicleOption}
								<option value={vehicleOption.id}>
									{vehicleOption.licensePlate} · {vehicleOption.make} {vehicleOption.model} ({vehicleOption.year})
								</option>
							{/each}
						</select>
					{/if}
					{#if vehiclesError}
						<p class="text-sm text-red-600 dark:text-red-300">{vehiclesError}</p>
					{/if}
				</div>
			{/if}

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					id="reportedIssue"
					type="text"
					label={$t('maintenance.labels.reportedIssue')}
					required
					placeholder={$t('maintenance.placeholders.reportedIssue')}
					bind:value={form.reportedIssue}
				/>
				<FormField
					id="createdBy"
					type="text"
					required
					label={$t('maintenance.labels.createdBy')}
					placeholder={$t('maintenance.placeholders.createdBy')}
					bind:value={form.createdBy}
				/>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label class="pl-2 text-lg text-gray-400" for="order-status">
						{$t('maintenance.labels.status')}
					</label>
					<select
						id="order-status"
						class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
						bind:value={form.status}
					>
						{#each maintenanceOrderStatusOptions as option}
							<option value={option.value}>{$t(option.labelKey)}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="space-y-3">
				<p class="pl-2 text-sm font-semibold text-gray-500 dark:text-gray-300">
					{$t('maintenance.labels.workshopInfo')}
				</p>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						id="workshop-name"
						type="text"
						label={$t('maintenance.labels.workshopName')}
						placeholder={$t('maintenance.placeholders.workshopName')}
						bind:value={form.workshop.name}
					/>
					<FormField
						id="workshop-contact"
						type="text"
						label={$t('maintenance.labels.workshopContact')}
						placeholder={$t('maintenance.placeholders.workshopContact')}
						bind:value={form.workshop.contactName}
					/>
				</div>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						id="workshop-phone"
						type="text"
						label={$t('maintenance.labels.workshopPhone')}
						placeholder={$t('maintenance.placeholders.workshopPhone')}
						bind:value={form.workshop.contactPhone}
					/>
					<FormField
						id="workshop-email"
						type="email"
						label={$t('maintenance.labels.workshopEmail')}
						placeholder={$t('maintenance.placeholders.workshopEmail')}
						bind:value={form.workshop.contactEmail}
					/>
				</div>
				<div>
					<FormField
						id="workshop-address"
						type="text"
						label={$t('maintenance.labels.workshopAddress')}
						placeholder={$t('maintenance.placeholders.workshopAddress')}
						bind:value={form.workshop.address}
					/>
				</div>
			</div>

			<div>
				<label class="pl-2 text-lg text-gray-400" for="order-notes">
					{$t('maintenance.labels.notes')}
				</label>
				<textarea
					id="order-notes"
					class="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
					placeholder={$t('maintenance.placeholders.notes')}
					bind:value={form.notes}
				></textarea>
			</div>

			<Button
				type="button"
				variant="primary"
				text={order ? $t('maintenance.buttons.updateOrder') : $t('maintenance.buttons.createOrder')}
				onclick={persistOrder}
			/>
			<StatusBlock message={status.message} type={status.type} />
		</div>
	</ModalContainer>
{/if}

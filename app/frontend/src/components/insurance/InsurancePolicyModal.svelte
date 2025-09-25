<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import Button from '$components/common/Button.svelte';
	import { t } from '$lib/stores/i18n';
	import VehicleSelector from './VehicleSelector.svelte';
	import type { PolicyDetail, PolicyVehicle } from '$lib/stores/insurance-policy';

	type VehicleAssignment = {
		vehicleId: string;
		licensePlate: string;
		description: string;
		premiumAmount?: number | string | null;
	};

	let {
		open = $bindable(false),
		policy: initialPolicy,
		mode = 'create'
	} = $props<{
		open?: boolean;
		policy?: PolicyDetail | null;
		mode?: 'create' | 'edit';
	}>();

	const dispatch = createEventDispatcher<{
		save: {
			payload: Record<string, unknown>;
			policyId?: string;
		};
	}>();

	let activeTab = $state<'details' | 'vehicles' | 'renewals'>('details');
	let showSelector = $state(false);
	let form = $state({
		insurer: '',
		policyNumber: '',
		type: 'individual',
		coverageType: '',
		startDate: '',
		endDate: '',
		notes: '',
		representativeName: '',
		representativePhone: '',
		representativeEmail: ''
	});
	let vehicleAssignments = $state<VehicleAssignment[]>([]);

	$effect(() => {
		if (!open) return;
		if (initialPolicy) {
			form = {
				insurer: initialPolicy.insurer,
				policyNumber: initialPolicy.policyNumber,
				type: initialPolicy.type,
				coverageType: initialPolicy.coverageType ?? '',
				startDate: initialPolicy.startDate,
				endDate: initialPolicy.endDate,
				notes: initialPolicy.notes ?? '',
				representativeName: initialPolicy.representative?.name ?? '',
				representativePhone: initialPolicy.representative?.phone ?? '',
				representativeEmail: initialPolicy.representative?.email ?? ''
			};
			vehicleAssignments = initialPolicy.vehicles
				.filter((vehicle: PolicyVehicle) => vehicle.isCurrent)
				.map((vehicle: PolicyVehicle) => ({
					vehicleId: vehicle.vehicleId,
					licensePlate: vehicle.licensePlate,
					description: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
					premiumAmount: vehicle.premiumAmount ?? undefined
				}));
			activeTab = 'details';
		} else {
			form = {
				insurer: '',
				policyNumber: '',
				type: 'individual',
				coverageType: '',
				startDate: '',
				endDate: '',
				notes: '',
				representativeName: '',
				representativePhone: '',
				representativeEmail: ''
			};
			vehicleAssignments = [];
		}
	});

	const hasVehicles = $derived(vehicleAssignments.length > 0);

	function handleVehicleSelection(
		event: CustomEvent<{
			vehicles: Array<{ vehicleId: string; licensePlate?: string; description?: string }>;
		}>,
	) {
		const selected = event.detail.vehicles;
		vehicleAssignments = selected.map(({ vehicleId, licensePlate, description }) => {
			const existing = vehicleAssignments.find((assignment) => assignment.vehicleId === vehicleId);
			return (
				existing ?? {
					vehicleId,
					licensePlate: licensePlate ?? vehicleId,
					description: description ?? '',
					premiumAmount: undefined
				}
			);
		});
	}

	function submit() {
		if (!form.insurer || !form.policyNumber || !form.startDate || !form.endDate) {
			alert($t('insurance.forms.validation.required'));
			return;
		}
		if (!hasVehicles) {
			alert($t('insurance.forms.validation.vehicleRequired'));
			return;
		}
		const payload: Record<string, unknown> = {
			insurer: form.insurer,
			policyNumber: form.policyNumber,
			type: form.type,
			coverageType: form.coverageType || undefined,
			startDate: form.startDate,
			endDate: form.endDate,
			notes: form.notes || undefined,
			representative: form.representativeName
				? {
					name: form.representativeName,
					phone: form.representativePhone || undefined,
					email: form.representativeEmail || undefined
				}
			: undefined,
		vehicles: vehicleAssignments.map((assignment) => ({
			vehicleId: assignment.vehicleId,
			premiumAmount:
				assignment.premiumAmount !== undefined && assignment.premiumAmount !== null && assignment.premiumAmount !== ''
					? Number(assignment.premiumAmount)
					: undefined
		}))
		};
		dispatch('save', { payload, policyId: initialPolicy?.id });
	}

	function removeVehicle(vehicleId: string) {
		vehicleAssignments = vehicleAssignments.filter((assignment) => assignment.vehicleId !== vehicleId);
	}
</script>

{#if open}
	<ModalContainer
		title={mode === 'create' ? $t('insurance.policies.new') : $t('insurance.policies.edit')}
		onclose={() => (open = false)}
	>
		<div class="flex flex-col gap-6">
			<div class="flex gap-3 rounded-full bg-gray-100 p-1 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-200">
				<button
					type="button"
					class={`flex-1 rounded-full px-4 py-2 transition ${activeTab === 'details' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}
					onclick={() => (activeTab = 'details')}
				>
					{$t('insurance.forms.headers.details')}
				</button>
				<button
					type="button"
					class={`flex-1 rounded-full px-4 py-2 transition ${activeTab === 'vehicles' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}
					onclick={() => (activeTab = 'vehicles')}
				>
					{$t('insurance.forms.headers.vehicles')}
				</button>
				<button
					type="button"
					class={`flex-1 rounded-full px-4 py-2 transition ${activeTab === 'renewals' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}
					onclick={() => (activeTab = 'renewals')}
				>
					{$t('insurance.forms.headers.renewals')}
				</button>
			</div>

			{#if activeTab === 'details'}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
						<span>{$t('insurance.forms.fields.insurer')}</span>
						<input class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.insurer} />
					</label>
					<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
						<span>{$t('insurance.forms.fields.policyNumber')}</span>
						<input class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.policyNumber} />
					</label>
					<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
						<span>{$t('insurance.forms.fields.type')}</span>
						<select class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.type}>
							<option value="individual">{$t('insurance.policies.types.individual')}</option>
							<option value="collective">{$t('insurance.policies.types.collective')}</option>
						</select>
					</label>
					<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
						<span>{$t('insurance.forms.fields.coverageType')}</span>
						<input class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.coverageType} />
					</label>
					<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
						<span>{$t('insurance.forms.fields.startDate')}</span>
						<input type="date" class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.startDate} />
					</label>
					<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
						<span>{$t('insurance.forms.fields.endDate')}</span>
						<input type="date" class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.endDate} />
					</label>
				</div>
				<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
					<span>{$t('insurance.forms.fields.notes')}</span>
					<textarea class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" rows={3} bind:value={form.notes}></textarea>
				</label>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
						<span>{$t('insurance.forms.fields.representativeName')}</span>
						<input class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.representativeName} />
					</label>
					<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
						<span>{$t('insurance.forms.fields.representativePhone')}</span>
						<input class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" bind:value={form.representativePhone} />
					</label>
					<label class="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
						<span>{$t('insurance.forms.fields.representativeEmail')}</span>
						<input class="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800" type="email" bind:value={form.representativeEmail} />
					</label>
				</div>
			{:else if activeTab === 'vehicles'}
				<div class="space-y-4">
					<div class="flex justify-between">
						<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
							{$t('insurance.forms.headers.vehicles')}
						</h3>
						<Button type="button" variant="secondary" text={$t('insurance.forms.vehicles.add')} onclick={() => (showSelector = true)} />
					</div>
					{#if vehicleAssignments.length === 0}
						<p class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
							{$t('insurance.forms.validation.vehicleRequired')}
						</p>
					{:else}
						<ul class="space-y-3">
							{#each vehicleAssignments as assignment}
								<li class="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
									<div>
										<p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{assignment.description || assignment.licensePlate}</p>
										<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{assignment.licensePlate}</p>
									</div>
									<div class="flex items-center gap-3">
										<input
											type="number"
											min="0"
											step="0.01"
											class="w-28 rounded-lg border border-gray-200 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
											placeholder={$t('insurance.forms.fields.premiumAmount')}
											bind:value={assignment.premiumAmount}
										/>
										<button
											type="button"
											class="text-sm font-semibold text-red-500 hover:underline"
											onclick={() => removeVehicle(assignment.vehicleId)}
										>
											{$t('common.delete')}
										</button>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{:else}
				<div class="space-y-3">
					{#if initialPolicy?.renewals?.length}
						<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
							<thead class="bg-gray-100 dark:bg-gray-900/60">
								<tr>
									<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('insurance.forms.fields.startDate')}</th>
									<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('insurance.forms.fields.endDate')}</th>
									<th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('insurance.forms.fields.notes')}</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
								{#each initialPolicy.renewals as renewal}
									<tr>
										<td class="px-4 py-2 text-gray-700 dark:text-gray-200">{renewal.newStartDate}</td>
										<td class="px-4 py-2 text-gray-700 dark:text-gray-200">{renewal.newEndDate}</td>
										<td class="px-4 py-2 text-gray-700 dark:text-gray-200">{renewal.notes || '-'}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{:else}
						<p class="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-300">
							{$t('insurance.forms.renew.empty')}
						</p>
					{/if}
				</div>
			{/if}

			<div class="flex justify-end gap-3">
				<Button type="button" variant="secondary" text={$t('common.cancel')} onclick={() => (open = false)} />
				<Button type="button" variant="primary" text={mode === 'create' ? $t('insurance.forms.submit.save') : $t('insurance.forms.submit.update')} onclick={submit} />
			</div>
		</div>

		<VehicleSelector bind:open={showSelector} selectedIds={vehicleAssignments.map((assignment) => assignment.vehicleId)} on:confirm={handleVehicleSelection} />
	</ModalContainer>
{/if}

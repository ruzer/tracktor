<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { getApiUrl } from '$lib/utils/api';
	import {
		formatCurrency,
		formatDate,
		formatDistance,
		getVolumeUnit
	} from '$lib/utils/formatting';
	import type { VehicleDetail, VehicleStatus } from '$lib/models/vehicle';
	import { Jumper } from 'svelte-loading-spinners';
	import { t } from '$lib/stores/i18n';
	import Button from '$components/common/Button.svelte';
	import VehicleActions from '$components/common/VehicleActions.svelte';
	import FuelLogTab from '$components/tabs/FuelLogTab.svelte';
	import MaintenenceLogTab from '$components/tabs/MaintenenceLogTab.svelte';
	import InsuranceTab from '$components/tabs/InsuranceTab.svelte';
	import MaintenanceSummaryView from '$components/maintenance/MaintenanceSummaryView.svelte';

	let { params } = $props();
	const vehicleId = params.id;

	let detail = $state<VehicleDetail | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let activeTab = $state<'general' | 'insurance' | 'maintenance' | 'fuel' | 'documents'>('general');

	const tabs: Array<{ id: 'general' | 'insurance' | 'maintenance' | 'fuel' | 'documents'; key: string }> = [
		{ id: 'general', key: 'vehicle.detail.generalTab' },
		{ id: 'insurance', key: 'navigation.insurance' },
		{ id: 'maintenance', key: 'navigation.maintenance' },
		{ id: 'fuel', key: 'navigation.fuelLogs' },
		{ id: 'documents', key: 'vehicle.detail.documentsTab' }
	];

	const fetchDetail = async () => {
		if (!browser) return;
		const pin = localStorage.getItem('userPin');
		if (!pin) {
			goto('/login', { replaceState: true });
			return;
		}

		loading = true;
		error = null;
		try {
			const response = await fetch(getApiUrl(`/api/vehicles/${vehicleId}`), {
				headers: {
					'X-User-PIN': pin
				}
			});

			if (response.ok) {
				detail = await response.json();
			} else {
				if (response.status === 401) {
					goto('/login', { replaceState: true });
					return;
				}
				const data = await response.json().catch(() => null);
				error = data?.message || $t('errors.fetchFailed');
			}
		} catch (err) {
			console.error('Failed to load vehicle detail', err);
			error = $t('errors.networkError');
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		if (!browser) return;
		fetchDetail();
	});

	function handleUpdated(status: boolean) {
		if (status) {
			fetchDetail();
		}
	}

	const statusBadgeClass = (status?: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
			case 'in_repair':
				return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
			case 'retired':
				return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
			case 'pending':
				return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
			case 'in_progress':
				return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200';
			case 'completed':
				return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
			case 'expired':
				return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
			default:
				return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
		}
	};

	const statusBadgeLabel = (status: VehicleStatus | undefined) => {
		switch (status) {
			case 'active':
				return $t('forms.options.vehicleStatus.active');
			case 'in_repair':
				return $t('forms.options.vehicleStatus.inRepair');
			case 'retired':
				return $t('forms.options.vehicleStatus.retired');
			default:
				return $t('vehicle.detail.statusUnknown');
		}
	};

	const formatDateSafe = (value?: string | null) => {
		if (!value) return $t('common.notAvailable');
		return formatDate(new Date(value));
	};

	const formatCurrencySafe = (value?: number | null) => {
		if (value === null || value === undefined) return $t('common.notAvailable');
		return formatCurrency(value);
	};
</script>

<div class="container mx-auto space-y-8 bg-gray-100 p-6 transition-colors dark:bg-gray-900">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<Button
			type="button"
			variant="secondary"
			text={$t('vehicle.detail.backToDashboard')}
			onclick={() => goto('/dashboard')}
		/>
		<Button
			type="button"
			variant="primary"
			text={$t('vehicle.detail.refresh')}
			onclick={fetchDetail}
		/>
	</div>

	{#if loading}
		<div class="flex items-center justify-center gap-4 rounded-2xl bg-white p-8 shadow dark:bg-gray-800">
			<Jumper size="40" color="#155dfc" unit="px" duration="2s" />
			<span class="text-lg text-gray-600 dark:text-gray-200">{$t('common.loading')}</span>
		</div>
	{:else if error}
		<div class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
			{error}
		</div>
	{:else if detail}
		<section class="rounded-2xl bg-white p-6 shadow-lg transition-colors dark:bg-gray-800">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
				<div class="space-y-2">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
						{detail.make} {detail.model}
					</h1>
					<p class="text-gray-500 dark:text-gray-300">
						{$t('vehicle.licensePlate')}: <span class="font-semibold text-gray-900 dark:text-gray-100">{detail.licensePlate}</span>
					</p>
					<div class="flex flex-wrap items-center gap-3">
						<span class="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white dark:bg-blue-500">
							{detail.year}
						</span>
						{#if detail.status}
							<span class={`rounded-full px-3 py-1 text-sm font-semibold ${statusBadgeClass(detail.status)}`}>
								{statusBadgeLabel(detail.status)}
							</span>
						{/if}
					</div>
				</div>
				<div class="flex flex-col items-end gap-4">
					{#if detail}
						<VehicleActions vehicle={detail} updateCallback={handleUpdated} />
					{/if}
				</div>
			</div>
		</section>

		<nav class="flex flex-wrap gap-2 border-b border-gray-200 pt-2 dark:border-gray-700">
			{#each tabs as tab}
				<button
					type="button"
					class={`rounded-full px-4 py-2 text-sm font-semibold transition ${
						activeTab === tab.id
							? 'bg-blue-600 text-white shadow'
							: 'text-gray-600 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700'
					}`}
					onclick={() => (activeTab = tab.id)}
				>
					{$t(tab.key)}
				</button>
			{/each}
		</nav>

		{#if activeTab === 'general'}
			<div class="space-y-6">
				<section class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
					<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
						{$t('vehicle.detail.generalInfo')}
					</h2>
					<dl class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						<div>
							<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('vehicle.licensePlate')}</dt>
							<dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">{detail.licensePlate}</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('forms.labels.vehicleStatus')}</dt>
							<dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">{statusBadgeLabel(detail.status)}</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('vehicle.vin')}</dt>
							<dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">{detail.vinNumber ?? detail.vin ?? $t('common.notAvailable')}</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('forms.labels.engineNumber')}</dt>
							<dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">{detail.engineNumber ?? $t('common.notAvailable')}</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('forms.labels.tankSizeLiters')}</dt>
							<dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{detail.tankSizeLiters ? `${detail.tankSizeLiters} ${getVolumeUnit()}` : $t('common.notAvailable')}
							</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('vehicle.odometer')}</dt>
							<dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{detail.odometer ? formatDistance(detail.odometer) : $t('common.notAvailable')}
							</dd>
						</div>
						{#if detail.ownerName}
							<div>
								<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('forms.labels.assigneeName')}</dt>
								<dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">{detail.ownerName}</dd>
							</div>
						{/if}
						<div>
							<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('forms.labels.color')}</dt>
							<dd class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
								{#if detail.color}
									<span
										class="inline-block h-5 w-10 rounded border border-gray-200 dark:border-gray-700"
										style={`background-color: ${detail.color}`}
									></span>
									{detail.color}
								{:else}
									{$t('common.notAvailable')}
								{/if}
							</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('vehicle.detail.createdAt')}</dt>
							<dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatDateSafe(detail.createdAt)}</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500 dark:text-gray-400">{$t('vehicle.detail.updatedAt')}</dt>
							<dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatDateSafe(detail.updatedAt)}</dd>
						</div>
					</dl>
				</section>

				<section class="grid gap-6 lg:grid-cols-2">
					<div class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
						<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
							{$t('vehicle.detail.assignment')}
						</h2>
						{#if detail.currentAssignment}
							<div class="space-y-2 text-gray-700 dark:text-gray-200">
								<p><span class="font-semibold">{$t('forms.labels.assigneeName')}:</span> {detail.currentAssignment.assigneeName ?? $t('vehicle.assignment.unknownDriver')}</p>
								<p><span class="font-semibold">{$t('forms.labels.assigneeRole')}:</span> {detail.currentAssignment.assigneeRole ?? $t('common.notAvailable')}</p>
								<p><span class="font-semibold">{$t('forms.labels.area')}:</span> {detail.currentAssignment.area ?? $t('common.notAvailable')}</p>
								<p><span class="font-semibold">{$t('forms.labels.unit')}:</span> {detail.currentAssignment.unit ?? $t('common.notAvailable')}</p>
								<p><span class="font-semibold">{$t('vehicle.assignment.since')}:</span> {formatDateSafe(detail.currentAssignment.startDate)}</p>
								{#if detail.currentAssignment.endDate}
									<p><span class="font-semibold">{$t('vehicle.assignment.until')}:</span> {formatDateSafe(detail.currentAssignment.endDate)}</p>
								{/if}
								{#if detail.currentAssignment.notes}
									<p class="text-sm text-gray-500 dark:text-gray-300">{detail.currentAssignment.notes}</p>
								{/if}
							</div>
						{:else}
							<p class="text-gray-500 dark:text-gray-300">{$t('vehicle.assignment.noCurrent')}</p>
						{/if}

						{#if detail.assignments.length > 1}
							<h3 class="mt-5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
								{$t('vehicle.assignment.showHistory')}
							</h3>
							<ul class="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
								{#each detail.assignments.slice(0, 4) as assignment (assignment.id)}
									<li class="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
										<p class="font-semibold">{assignment.assigneeName ?? $t('vehicle.assignment.unknownDriver')}</p>
										<p>{$t('vehicle.assignment.since')}: {formatDateSafe(assignment.startDate)} · {$t('vehicle.assignment.until')}: {formatDateSafe(assignment.endDate)}</p>
										{#if assignment.notes}
											<p class="text-xs text-gray-500 dark:text-gray-300">{assignment.notes}</p>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					<div class="space-y-6">
						<div class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
							<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
								{$t('vehicle.detail.insuranceSummary')}
							</h2>
							{#if detail.insurance.currentPolicy}
								<div class="space-y-2 text-gray-700 dark:text-gray-200">
									<p><span class="font-semibold">{$t('insurance.forms.fields.insurer')}:</span> {detail.insurance.currentPolicy.policy.insurer}</p>
									<p><span class="font-semibold">{$t('insurance.forms.fields.policyNumber')}:</span> {detail.insurance.currentPolicy.policy.policyNumber}</p>
									<p><span class="font-semibold">{$t('vehicle.detail.statusLabel')}:</span> {detail.insurance.currentPolicy.policy.status}</p>
									<p><span class="font-semibold">{$t('forms.labels.endDate')}:</span> {formatDateSafe(detail.insurance.currentPolicy.policy.endDate)}</p>
									{#if detail.insurance.currentPolicy.premiumAmount !== undefined}
										<p><span class="font-semibold">{$t('insurance.forms.fields.premiumAmount')}:</span> {formatCurrencySafe(detail.insurance.currentPolicy.premiumAmount ?? null)}</p>
									{/if}
								</div>
							{:else}
								<p class="text-gray-500 dark:text-gray-300">{$t('vehicle.detail.noPolicies')}</p>
							{/if}
							<div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-300">
								<span>{$t('vehicle.detail.policyAssignments')} {detail.insurance.policyAssignments.length}</span>
								<span>{$t('vehicle.detail.legacyPolicies')} {detail.insurance.legacy.length}</span>
							</div>
						</div>

						<div class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
							<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
								{$t('vehicle.detail.fuelSummary')}
							</h2>
							<p class="text-gray-600 dark:text-gray-300">{$t('vehicle.detail.totalFuelLogs', { count: detail.fuel.totalLogs })}</p>
							{#if detail.fuel.lastEntry}
								<div class="mt-4 space-y-2 text-gray-700 dark:text-gray-200">
									<p><span class="font-semibold">{$t('forms.labels.date')}:</span> {formatDateSafe(detail.fuel.lastEntry.date)}</p>
									<p><span class="font-semibold">{$t('forms.labels.fuelAmount')}:</span> {detail.fuel.lastEntry.fuelAmount} {getVolumeUnit()}</p>
									<p><span class="font-semibold">{$t('forms.labels.cost')}:</span> {formatCurrencySafe(detail.fuel.lastEntry.cost)}</p>
								</div>
							{:else}
								<p class="text-gray-500 dark:text-gray-300">{$t('vehicle.detail.noFuelLogs')}</p>
							{/if}
						</div>
					</div>
				</section>

				<MaintenanceSummaryView
					summary={detail.maintenance.summary || { total: 0, open: 0, inProgress: 0, completed: 0 }}
					recentLogs={detail.maintenance.recentLogs || []}
				/>
			</div>
		{:else if activeTab === 'insurance'}
			<InsuranceTab {vehicleId} />
		{:else if activeTab === 'maintenance'}
			<MaintenenceLogTab {vehicleId} />
		{:else if activeTab === 'fuel'}
			<FuelLogTab {vehicleId} />
		{:else if activeTab === 'documents'}
			<div class="space-y-6">
				<section class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
					<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
						{$t('vehicle.detail.documents')}
					</h2>
					{#if detail.documents.length}
						<div class="overflow-x-auto">
							<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
								<thead class="bg-gray-50 dark:bg-gray-900/60">
									<tr>
										<th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('vehicle.detail.documentType')}</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('forms.labels.issueDate')}</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('forms.labels.expiryDate')}</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('forms.labels.notes')}</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
									{#each detail.documents as doc (doc.id)}
										<tr class="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200">
											<td class="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{doc.docType}</td>
											<td class="px-4 py-3">{formatDateSafe(doc.issueDate)}</td>
											<td class="px-4 py-3">{formatDateSafe(doc.expiryDate)}</td>
											<td class="px-4 py-3">{doc.notes ?? doc.filePath ?? '-'}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{:else}
						<p class="text-gray-500 dark:text-gray-300">{$t('vehicle.detail.noDocuments')}</p>
					{/if}
				</section>

				<section class="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
					<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
						{$t('vehicle.detail.pollutionCertificates')}
					</h2>
					{#if detail.pollutionCertificates.length}
						<div class="overflow-x-auto">
							<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
								<thead class="bg-gray-50 dark:bg-gray-900/60">
									<tr>
										<th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('forms.labels.certificateNumber')}</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('forms.labels.issueDate')}</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('forms.labels.expiryDate')}</th>
										<th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{$t('vehicle.detail.statusLabel')}</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
									{#each detail.pollutionCertificates as cert (cert.id)}
										<tr class="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200">
											<td class="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{cert.certificateNumber}</td>
											<td class="px-4 py-3">{formatDateSafe(cert.issueDate)}</td>
											<td class="px-4 py-3">{formatDateSafe(cert.expiryDate)}</td>
											<td class="px-4 py-3">
												<span class={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(cert.status)}`}>
													{$t(`vehicle.detail.pollutionStatus.${cert.status}`)}
												</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{:else}
						<p class="text-gray-500 dark:text-gray-300">{$t('vehicle.detail.noPollution')}</p>
					{/if}
				</section>
			</div>
		{/if}
	{/if}
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/stores/i18n';
	import { insurancePoliciesStore } from '$lib/stores/insurance-policy';

	const policiesStore = insurancePoliciesStore;
	let range = $state(30);

	onMount(() => {
		policiesStore.fetchReports({ expiresWithinDays: range });
	});

	// Reactive statement to refresh when range changes
	$effect(() => {
		policiesStore.fetchReports({ expiresWithinDays: range });
	});

	async function refresh() {
		await policiesStore.fetchReports({ expiresWithinDays: range });
	}

	function exportCsv() {
		const report = $policiesStore.reports;
		if (!report) return;
		const lines: string[] = [];
		lines.push('Section,Vehicle/Policy,Identifier,Extra');
		report.vehiclesWithoutPolicy.forEach((vehicle) => {
			lines.push(`Vehicles without policy,"${vehicle.make} ${vehicle.model}",${vehicle.licensePlate}`);
		});
		report.vehiclesWithExpiredPolicy.forEach((item) => {
			lines.push(`Vehicles with expired policy,"${item.make} ${item.model}",${item.licensePlate},${item.policyNumber}`);
		});
		report.upcomingExpirations.forEach((policy) => {
			lines.push(`Upcoming expirations,"${policy.insurer}",${policy.policyNumber},${policy.endDate}`);
		});
		report.expiredPolicies.forEach((policy) => {
			lines.push(`Expired policies,"${policy.insurer}",${policy.policyNumber},${policy.endDate}`);
		});
		const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'insurance-report.csv';
		link.click();
		URL.revokeObjectURL(url);
	}
</script>

<section class="container mx-auto flex flex-col gap-6 px-4 py-8">
	<header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
				{$t('insurance.reports.title')}
			</h1>
			<p class="text-sm text-gray-600 dark:text-gray-300">{$t('insurance.reports.subtitle')}</p>
		</div>
		<div class="flex items-center gap-3">
		<select
			class="rounded-full border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
			bind:value={range}
		>
			<option value="7">7 {$t('common.days')}</option>
			<option value="15">15 {$t('common.days')}</option>
			<option value="30">30 {$t('common.days')}</option>
			<option value="60">60 {$t('common.days')}</option>
		</select>
			<button
				type="button"
				class="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:border-blue-500 hover:text-blue-700 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-300"
				onclick={exportCsv}
			>
				{$t('insurance.reports.export')}
			</button>
		</div>
	</header>

	<div class="grid gap-6 lg:grid-cols-2">
		<section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			<h2 class="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">{$t('insurance.reports.sections.vehiclesWithout')}</h2>
			<ul class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
				{#each $policiesStore.reports?.vehiclesWithoutPolicy ?? [] as vehicle}
					<li class="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
						<strong>{vehicle.licensePlate}</strong> — {vehicle.make} {vehicle.model} ({vehicle.year})
					</li>
				{/each}
				{#if !$policiesStore.reports?.vehiclesWithoutPolicy?.length}
					<li class="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-500 dark:border-gray-700 dark:text-gray-400">
						{$t('common.notAvailable')}
					</li>
				{/if}
			</ul>
		</section>

		<section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			<h2 class="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">{$t('insurance.reports.sections.vehiclesExpired')}</h2>
			<ul class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
				{#each $policiesStore.reports?.vehiclesWithExpiredPolicy ?? [] as item}
					<li class="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
						<strong>{item.licensePlate}</strong> — {item.make} {item.model} ({item.policyNumber})
					</li>
				{/each}
				{#if !$policiesStore.reports?.vehiclesWithExpiredPolicy?.length}
					<li class="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-500 dark:border-gray-700 dark:text-gray-400">
						{$t('common.notAvailable')}
					</li>
				{/if}
			</ul>
		</section>

		<section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			<h2 class="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">{$t('insurance.reports.sections.upcoming')}</h2>
			<ul class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
				{#each $policiesStore.reports?.upcomingExpirations ?? [] as policy}
					<li class="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
						<strong>{policy.policyNumber}</strong> — {policy.insurer} ({policy.endDate})
					</li>
				{/each}
				{#if !$policiesStore.reports?.upcomingExpirations?.length}
					<li class="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-500 dark:border-gray-700 dark:text-gray-400">
						{$t('insurance.renewals.empty')}
					</li>
				{/if}
			</ul>
		</section>

		<section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			<h2 class="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">{$t('insurance.reports.sections.expired')}</h2>
			<ul class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
				{#each $policiesStore.reports?.expiredPolicies ?? [] as policy}
					<li class="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
						<strong>{policy.policyNumber}</strong> — {policy.insurer} ({policy.endDate})
					</li>
				{/each}
				{#if !$policiesStore.reports?.expiredPolicies?.length}
					<li class="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-500 dark:border-gray-700 dark:text-gray-400">
						{$t('common.notAvailable')}
					</li>
				{/if}
			</ul>
		</section>
	</div>
</section>

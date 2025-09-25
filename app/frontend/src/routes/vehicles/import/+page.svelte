<script lang="ts">
	import { ArrowLeftCircle } from '@lucide/svelte';
	import VehicleImportForm from '$components/forms/VehicleImportForm.svelte';
	import { t } from '$lib/stores/i18n';
	import { goto } from '$app/navigation';

	function goBack() {
		goto('/dashboard');
	}
</script>

<section class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
	<header class="flex flex-col gap-4">
		<button
			type="button"
			onclick={goBack}
			class="flex w-fit items-center gap-2 rounded-full border border-transparent bg-transparent px-3 py-1.5 text-sm font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50 dark:text-blue-300 dark:hover:border-blue-500/60 dark:hover:bg-blue-500/10"
		>
			<ArrowLeftCircle class="h-4 w-4" />
			{$t('vehicle.import.backToVehicles')}
		</button>
		<div class="space-y-2">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
				{$t('vehicle.import.pageTitle')}
			</h1>
			<p class="text-base text-gray-600 dark:text-gray-300">
				{$t('vehicle.import.pageDescription')}
			</p>
		</div>
	</header>

	<section
		class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800"
	>
		<h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
			{$t('vehicle.import.instructionsTitle')}
		</h2>
		<p class="mb-6 text-sm text-gray-600 dark:text-gray-300">
			{$t('vehicle.import.instructionsDescription')}
		</p>
		<VehicleImportForm />
	</section>
</section>

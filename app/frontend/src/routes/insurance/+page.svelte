<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { ShieldCheck, Stethoscope, Users, FileCheck } from '@lucide/svelte';
</script>

<section class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
	<header class="space-y-3">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
			{$t('insurance.overview.title')}
		</h1>
		<p class="text-base text-gray-600 dark:text-gray-300">
			{$t('insurance.overview.subtitle')}
		</p>
	</header>

	<div class="grid gap-5 md:grid-cols-2">
		<article
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="mb-3 flex items-center gap-3">
				<ShieldCheck class="h-6 w-6 text-blue-500 dark:text-blue-300" />
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{$t('insurance.overview.cards.policies.title')}
				</h2>
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				{$t('insurance.overview.cards.policies.body')}
			</p>
		</article>
		<article
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="mb-3 flex items-center gap-3">
				<FileCheck class="h-6 w-6 text-emerald-500 dark:text-emerald-300" />
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{$t('insurance.overview.cards.compliance.title')}
				</h2>
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				{$t('insurance.overview.cards.compliance.body')}
			</p>
		</article>
		<article
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="mb-3 flex items-center gap-3">
				<Users class="h-6 w-6 text-purple-500 dark:text-purple-300" />
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{$t('insurance.overview.cards.collective.title')}
				</h2>
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				{$t('insurance.overview.cards.collective.body')}
			</p>
		</article>
		<article
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="mb-3 flex items-center gap-3">
				<Stethoscope class="h-6 w-6 text-rose-500 dark:text-rose-300" />
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{$t('insurance.overview.cards.integrations.title')}
				</h2>
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				{$t('insurance.overview.cards.integrations.body')}
			</p>
		</article>
	</div>
</section>

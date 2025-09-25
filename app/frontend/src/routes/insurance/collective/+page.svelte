<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { ClipboardPlus, Users, ShieldPlus, Target } from '@lucide/svelte';
</script>

<section class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
	<header class="space-y-3">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
			{$t('insurance.collective.title')}
		</h1>
		<p class="text-base text-gray-600 dark:text-gray-300">
			{$t('insurance.collective.subtitle')}
		</p>
	</header>

	<div class="grid gap-6 md:grid-cols-2">
		<article
			class="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm transition-colors dark:border-indigo-500/40 dark:bg-gray-800"
		>
			<div class="mb-3 flex items-center gap-3">
				<Users class="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{$t('insurance.collective.cards.pooling.title')}
				</h2>
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				{$t('insurance.collective.cards.pooling.body')}
			</p>
		</article>
		<article
			class="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm transition-colors dark:border-indigo-500/40 dark:bg-gray-800"
		>
			<div class="mb-3 flex items-center gap-3">
				<ShieldPlus class="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{$t('insurance.collective.cards.coverage.title')}
				</h2>
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				{$t('insurance.collective.cards.coverage.body')}
			</p>
		</article>
		<article
			class="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm transition-colors dark:border-indigo-500/40 dark:bg-gray-800"
		>
			<div class="mb-3 flex items-center gap-3">
				<ClipboardPlus class="h-6 w-6 text-amber-600 dark:text-amber-300" />
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{$t('insurance.collective.cards.process.title')}
				</h2>
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				{$t('insurance.collective.cards.process.body')}
			</p>
		</article>
		<article
			class="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm transition-colors dark:border-indigo-500/40 dark:bg-gray-800"
		>
			<div class="mb-3 flex items-center gap-3">
				<Target class="h-6 w-6 text-rose-600 dark:text-rose-300" />
				<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
					{$t('insurance.collective.cards.next.title')}
				</h2>
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-300">
				{$t('insurance.collective.cards.next.body')}
			</p>
		</article>
	</div>
</section>

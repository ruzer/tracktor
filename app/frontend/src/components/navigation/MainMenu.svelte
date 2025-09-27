<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { ChevronDown } from '@lucide/svelte';
	import { t } from '$lib/stores/i18n';

	type MenuItem = {
		id: string;
		label: string;
		href: string;
		isExternal?: boolean;
	};

	type MenuModule = {
		id: string;
		label: string;
		items: MenuItem[];
	};

	const modules: MenuModule[] = [
		{
			id: 'vehicles',
			label: 'menu.vehicles.label',
			items: [
				{ id: 'vehicles-overview', label: 'menu.vehicles.overview', href: '/dashboard' },
				{ id: 'vehicles-import', label: 'menu.vehicles.import', href: '/vehicles/import' }
			]
		},
		{
			id: 'maintenance',
			label: 'menu.maintenance.label',
			items: [
				{ id: 'maintenance-overview', label: 'menu.maintenance.overview', href: '/maintenance' },
				{ id: 'maintenance-orders', label: 'menu.maintenance.orders', href: '/maintenance/orders' },
				{ id: 'maintenance-reports', label: 'menu.maintenance.reports', href: '/maintenance/reports' }
			]
		},
		{
			id: 'insurance',
			label: 'menu.insurance.label',
			items: [
				{ id: 'insurance-policies', label: 'menu.insurance.policies', href: '/insurance' },
				{ id: 'insurance-renewals', label: 'menu.insurance.renewals', href: '/insurance/renewals' },
				{ id: 'insurance-reports', label: 'menu.insurance.reports', href: '/insurance/reports' }
			]
		}
	];

	let openModule = $state<string | null>(null);
	let currentPath = $derived(page.url.pathname);
	let lastPath = $state('');

	function isActive(item: MenuItem) {
		return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
	}

	function toggleModule(moduleId: string) {
		openModule = openModule === moduleId ? null : moduleId;
	}

	function handleNavigate(event: Event, item: MenuItem) {
		event.preventDefault();
		if (item.isExternal) {
			window.open(item.href, '_blank');
			return;
		}
		goto(item.href);
	}

	$effect(() => {
		if (currentPath === lastPath) return;
		lastPath = currentPath;
		openModule = null;
	});
</script>

<nav class="main-menu" aria-label={$t('menu.ariaLabel')}>
	{#each modules as module}
		<div
			class="module"
			data-open={openModule === module.id}
			data-active={module.items.some((item) => isActive(item))}
		>
			<button
				type="button"
				class="module-trigger"
				aria-expanded={openModule === module.id}
				onclick={() => toggleModule(module.id)}
			>
				<span>{$t(module.label)}</span>
				<ChevronDown
					class={`h-4 w-4 transition-transform ${openModule === module.id ? 'rotate-180' : ''}`}
				/>
			</button>
			<ul class={`module-panel ${openModule === module.id ? 'module-panel--open' : ''}`}>
				{#each module.items as item}
					<li>
						<a
							href={item.href}
							class={`module-link ${isActive(item) ? 'module-link--active' : ''}`}
							onclick={(event) => handleNavigate(event, item)}
						>
							{$t(item.label)}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>

<style>
	.main-menu {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.module {
		position: relative;
	}

	.module[data-active='true'] > .module-trigger {
		color: var(--primary-600, #1d4ed8);
	}

	.module-trigger {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.5rem 0.75rem;
		border-radius: 9999px;
		font-weight: 600;
		color: var(--muted-700, #1f2937);
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.module-trigger:hover,
	.module-trigger:focus-visible {
		background-color: rgba(59, 130, 246, 0.12);
		color: var(--primary-600, #1d4ed8);
		outline: none;
	}

	[data-open='true'] > .module-trigger {
		background-color: rgba(59, 130, 246, 0.12);
		color: var(--primary-600, #1d4ed8);
	}

	.module-panel {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 0.5rem;
		padding: 0.75rem;
		width: 220px;
		border-radius: 0.75rem;
		background-color: var(--panel-bg, #ffffff);
		box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
		border: 1px solid rgba(148, 163, 184, 0.2);
		opacity: 0;
		transform: translateY(-6px);
		pointer-events: none;
		transition:
			opacity 0.15s ease,
			transform 0.15s ease;
		z-index: 20;
	}

	.module-panel--open {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.module-link {
		display: block;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		font-weight: 500;
		color: var(--muted-700, #1f2937);
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.module-link:hover,
	.module-link:focus-visible {
		background-color: rgba(59, 130, 246, 0.08);
		color: var(--primary-600, #1d4ed8);
		outline: none;
	}

	.module-link--active {
		background-color: rgba(59, 130, 246, 0.15);
		color: var(--primary-600, #1d4ed8);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--panel-bg: #111827;
			--muted-700: #e5e7eb;
			--primary-600: #60a5fa;
		}
	}
</style>

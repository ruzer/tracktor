<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import Button from '$components/common/Button.svelte';
	import { t } from '$lib/stores/i18n';
	import type { Vehicle } from '$lib/models/vehicle';
	import { getApiUrl } from '$lib/utils/api';
	import { Search } from '@lucide/svelte';

	let { open = $bindable(false), selectedIds = [] } = $props<{
		open?: boolean;
		selectedIds?: string[];
	}>();

	const dispatch = createEventDispatcher<{
		confirm: {
			vehicles: Array<{
				vehicleId: string;
				licensePlate?: string;
				description?: string;
			}>;
		};
	}>();

	let vehicles = $state<Vehicle[]>([]);
	let loading = $state(false);
	let search = $state('');

	async function loadVehicles(query = '') {
		loading = true;
		try {
			const pin = localStorage.getItem('userPin') || '';
			const response = await fetch(
				getApiUrl(`/api/vehicles${query ? `?q=${encodeURIComponent(query)}` : ''}`),
				{
					headers: {
						'X-User-PIN': pin
					}
				}
			);
			vehicles = response.ok ? await response.json() : [];
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (open) loadVehicles();
	});

	function toggleSelection(id: string) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((value: string) => value !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	function handleConfirm() {
		dispatch('confirm', {
			vehicles: selectedIds.map((vehicleId: string) => {
				const match = vehicles.find((vehicle) => vehicle.id === vehicleId);
				return {
					vehicleId,
					licensePlate: match?.licensePlate,
					description: match ? `${match.make} ${match.model} (${match.year})` : undefined
				};
			})
		});
		open = false;
	}
</script>

{#if open}
	<ModalContainer
		title={$t('insurance.forms.vehicles.manage')}
		onclose={() => (open = false)}
	>
		<div class="space-y-4">
			<div class="relative">
				<Search class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<input
					type="search"
					class="w-full rounded-full border border-gray-300 bg-white py-2 pr-12 pl-10 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900"
					placeholder={$t('vehicle.searchPlaceholder')}
					bind:value={search}
					onkeydown={(event) => {
						if (event.key === 'Enter') loadVehicles(search);
					}}
				/>
				<button
					type="button"
					class="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-300"
					onclick={() => loadVehicles(search)}
				>
					{$t('common.search')}
				</button>
			</div>

			<div class="max-h-80 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
				{#if loading}
					<p class="p-6 text-center text-sm text-gray-500 dark:text-gray-300">
						{$t('common.loading')}...
					</p>
				{:else if vehicles.length === 0}
					<p class="p-6 text-center text-sm text-gray-500 dark:text-gray-300">
						{$t('vehicle.emptyState')}
					</p>
				{:else}
					<ul class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each vehicles as vehicle}
							<li class="flex items-center justify-between gap-4 px-4 py-3">
								<div>
									<p class="font-semibold text-gray-800 dark:text-gray-100">
										{vehicle.make} {vehicle.model} ({vehicle.year})
									</p>
									<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
										{vehicle.licensePlate}
									</p>
								</div>
								<label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
									<input
										type="checkbox"
										checked={selectedIds.includes(vehicle.id)}
										onchange={() => toggleSelection(vehicle.id)}
									/>
									{$t('common.select')}
								</label>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<div class="flex justify-end gap-3">
				<Button type="button" variant="secondary" text={$t('common.cancel')} onclick={() => (open = false)} />
				<Button type="button" variant="primary" text={$t('insurance.forms.vehicles.add')} onclick={handleConfirm} />
			</div>
		</div>
	</ModalContainer>
{/if}

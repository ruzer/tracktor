<script lang="ts">
	import { vehiclesStore } from '$lib/stores/vehicle';
	import VehicleCard from '$components/common/VehicleCard.svelte';
	import VehicleActions from '$components/common/VehicleActions.svelte';
	import { t } from '$lib/stores/i18n';

	let { vehicles, selectedVehicleId, updateCallback, viewMode = 'grid' } = $props();

	function selectVehicle(vehicleId: string) {
		vehiclesStore.selectVehicle(vehicleId);
	}

	const statusBadgeClass = (status: string | null | undefined) => {
		switch (status) {
			case 'Active':
				return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
			case 'Expired':
				return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
			default:
				return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
		}
	};

	const rowClasses = (vehicleId: string) =>
		`cursor-pointer transition-colors hover:bg-blue-50 focus:bg-blue-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700 ${
			selectedVehicleId === vehicleId
				? 'bg-blue-100 dark:bg-blue-900/40'
				: 'bg-white dark:bg-gray-800'
		}`;
</script>

{#if vehicles.length > 0}
	{#if viewMode === 'grid'}
		<div
			class="grid grid-cols-1 gap-6 bg-gray-100 transition-colors sm:grid-cols-2 lg:grid-cols-3 dark:bg-gray-900"
		>
			{#each vehicles as vehicle (vehicle.id)}
				<div
					tabindex="0"
					role="button"
					onclick={() => selectVehicle(vehicle.id)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') selectVehicle(vehicle.id);
					}}
					class:ring-2={selectedVehicleId === vehicle.id}
					class:ring-blue-500={selectedVehicleId === vehicle.id}
					class="cursor-pointer rounded-2xl transition-all duration-300 ease-in-out"
				>
					<VehicleCard {vehicle} {updateCallback} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="overflow-x-auto rounded-2xl bg-white shadow dark:bg-gray-800">
			<table class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
				<thead class="bg-gray-50 dark:bg-gray-900/60">
					<tr>
						<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
							{$t('vehicle.vehicleLabel')}
						</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
							{$t('vehicle.licensePlate')}
						</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
							{$t('vehicle.year')}
						</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
							{$t('forms.labels.assigneeName')}
						</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
							{$t('forms.labels.area')}
						</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
							{$t('forms.labels.unit')}
						</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
							{$t('vehicle.insurance')}
						</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
							{$t('vehicle.pucc')}
						</th>
						<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
							{$t('table.headers.actions')}
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 dark:divide-gray-700">
					{#each vehicles as vehicle (vehicle.id)}
						<tr
							tabindex="0"
							role="button"
							onclick={() => selectVehicle(vehicle.id)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') selectVehicle(vehicle.id);
							}}
							class={rowClasses(vehicle.id)}
						>
							<td class="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
								{vehicle.make}
								{vehicle.model}
							</td>
							<td class="px-4 py-3 text-gray-700 dark:text-gray-200">{vehicle.licensePlate}</td>
							<td class="px-4 py-3 text-gray-700 dark:text-gray-200">{vehicle.year}</td>
							<td class="px-4 py-3 text-gray-700 dark:text-gray-200">
								{vehicle.currentAssignment?.assigneeName ?? '-'}
								{#if vehicle.currentAssignment?.isCurrent}
									<span
										class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
									>
										{$t('forms.labels.current')}
									</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-gray-700 dark:text-gray-200">
								{vehicle.currentAssignment?.area ?? '-'}
							</td>
							<td class="px-4 py-3 text-gray-700 dark:text-gray-200">
								{vehicle.currentAssignment?.unit ?? '-'}
							</td>
							<td class="px-4 py-3 text-gray-700 dark:text-gray-200">
								<span
									class={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(vehicle.insuranceStatus)}`}
								>
									{vehicle.insuranceStatus === 'Active'
										? $t('vehicle.active')
										: vehicle.insuranceStatus === 'Not Available'
											? $t('common.notAvailable')
											: vehicle.insuranceStatus === 'Expired'
												? $t('vehicle.expired')
												: (vehicle.insuranceStatus ?? $t('common.notAvailable'))}
								</span>
							</td>
							<td class="px-4 py-3 text-gray-700 dark:text-gray-200">
								<span
									class={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(vehicle.puccStatus)}`}
								>
									{vehicle.puccStatus === 'Active'
										? $t('vehicle.active')
										: vehicle.puccStatus === 'Not Available'
											? $t('common.notAvailable')
											: vehicle.puccStatus === 'Expired'
												? $t('vehicle.expired')
												: (vehicle.puccStatus ?? $t('common.notAvailable'))}
								</span>
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex justify-end">
									<VehicleActions {vehicle} {updateCallback} dense />
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{:else}
	<div
		class="flex min-h-48 items-center justify-center gap-10 bg-gray-100 px-4 text-center dark:bg-gray-900"
	>
		<p class="text-lg text-gray-600 dark:text-gray-100">
			{$t('vehicle.emptyState')}
		</p>
	</div>
{/if}

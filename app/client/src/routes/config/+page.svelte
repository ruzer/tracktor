<script lang="ts">
	import { config, type Config } from '$lib/stores/config';

	let localConfig: Config[] = [];
	let saveSuccess = false;

	const dateFormatOptions = [
		{ value: 'dd/MM/yyyy', label: 'dd/MM/yyyy (e.g., 31/12/2000)' },
		{ value: 'MM/dd/yyyy', label: 'MM/dd/yyyy (e.g., 12/25/2000)' },
		{ value: 'yyyy-MM-dd', label: 'yyyy-MM-dd (e.g., 2000-12-31)' },
		{ value: 'dd MMM, yyyy', label: 'dd MMM, yyyy (e.g., 31 Dec, 2000)' }
	];

	const currencyOptions = [
		{ value: 'INR', label: 'INR (₹)' },
		{ value: 'USD', label: 'USD ($)' },
		{ value: 'EUR', label: 'EUR (€)' },
		{ value: 'GBP', label: 'GBP (£)' }
	];

	const uomOptions = [
		{ value: 'metric', label: 'Metric' },
		{ value: 'Imperial', label: 'Imperial' }
	];

	config.subscribe((value) => {
		localConfig = JSON.parse(JSON.stringify(value));
	});

	async function saveConfig() {
		await config.save(localConfig);
		saveSuccess = true;
		setTimeout(() => (saveSuccess = false), 3000);
	}
</script>

<div class="container mx-auto p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-3xl">
		<header class="mb-8 text-center">
			<h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
				Application Settings
			</h1>
			<p class="mt-3 text-lg text-gray-600 dark:text-gray-400">Customize your app experience.</p>
		</header>

		<div class="space-y-6">
			{#each localConfig as item, index}
				<div
					class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
				>
					<label
						for={item.key}
						class="mb-2 block text-lg font-semibold text-gray-800 capitalize dark:text-gray-200"
					>
						{item.key.replace(/([A-Z])/g, ' $1')}
					</label>
					<p class="mb-4 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>

					{#if item.key === 'dateFormat'}
						<select
							id={item.key}
							bind:value={item.value}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
						>
							{#each dateFormatOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					{:else if item.key === 'currency'}
						<select
							id={item.key}
							bind:value={item.value}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
						>
							{#each currencyOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					{:else if item.key === 'unitOfMeasure'}
						<select
							id={item.key}
							bind:value={item.value}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
						>
							{#each uomOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					{:else}
						<input
							type="text"
							id={item.key}
							bind:value={item.value}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
						/>
					{/if}
				</div>
			{/each}
		</div>

		<div class="mt-10 flex justify-center">
			<button
				on:click={saveConfig}
				class="transform rounded-lg bg-blue-600 px-10 py-4 text-lg font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Save Changes
			</button>
		</div>

		{#if saveSuccess}
			<div
				class="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-green-500 px-6 py-3 text-white shadow-lg transition-opacity duration-300"
			>
				Settings saved successfully!
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
	let {
		id,
		checked = $bindable(),
		icon = null,
		label = undefined,
		ariaLabel = '',
		help = undefined,
		helpAriaLabel = 'Help',
		disabled = false,
		inputClass = '',
		onInput = undefined
	} = $props();
	const Icon = icon;
	let showHelp = $state(false);
</script>

<div class="flex flex-row items-center space-x-4 pl-2">
	<input
		{id}
		type="checkbox"
		bind:checked
		class={`rounded-sm border border-gray-300 p-2 text-blue-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${inputClass}`}
		aria-label={ariaLabel}
		{disabled}
		oninput={onInput}
	/>
	{#if label}
		<label for={id} class="flex flex-row items-center gap-2 pl-1 text-lg text-gray-400">
			{#if icon}
				<Icon class="inline-block h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
			{/if}
			{label}
			{#if help}
				<span class="relative inline-flex">
					<span
						class="inline-flex items-center rounded-full px-1 text-sm text-gray-400 hover:text-gray-500 focus:outline-none cursor-help dark:text-gray-500"
						role="button"
						title={help}
						aria-label={helpAriaLabel}
						tabindex="0"
						onmouseenter={() => (showHelp = true)}
						onmouseleave={() => (showHelp = false)}
						onfocus={() => (showHelp = true)}
						onblur={() => (showHelp = false)}
					>
						?
					</span>
					{#if showHelp}
						<div class="absolute left-4 top-full z-20 mt-1 w-72 rounded bg-gray-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-gray-700">
							{help}
						</div>
					{/if}
				</span>
			{/if}
		</label>
	{/if}
</div>

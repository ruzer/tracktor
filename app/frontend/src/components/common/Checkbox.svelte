<script lang="ts">
	import { tick } from 'svelte';
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
	let placeAbove = $state(false);
	let tooltipEl: HTMLDivElement | undefined;
	let triggerEl: HTMLSpanElement | undefined;

	function updatePlacement() {
		if (!tooltipEl || !triggerEl) return;
		const tr = triggerEl.getBoundingClientRect();
		const tt = tooltipEl.getBoundingClientRect();
		const spaceBelow = window.innerHeight - tr.bottom;
		const spaceAbove = tr.top;
		placeAbove = tt.height + 12 > spaceBelow && spaceAbove > spaceBelow;
	}

	async function openHelp() {
		showHelp = true;
		await tick();
		updatePlacement();
	}

	function closeHelp() {
		showHelp = false;
	}
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
						bind:this={triggerEl}
						class="inline-flex items-center rounded-full px-1 text-sm text-gray-400 hover:text-gray-500 focus:outline-none cursor-help dark:text-gray-500"
						role="button"
						title={help}
						aria-label={helpAriaLabel}
						tabindex="0"
						onmouseenter={openHelp}
						onmouseleave={closeHelp}
						onfocus={openHelp}
						onblur={closeHelp}
					>
						?
					</span>
					{#if showHelp}
						<div
							bind:this={tooltipEl}
							class="absolute z-20 w-72 max-w-[min(18rem,calc(100vw-3rem))] rounded bg-gray-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-gray-700"
							class:top-full={!placeAbove}
							class:mt-1={!placeAbove}
							class:bottom-full={placeAbove}
							class:mb-1={placeAbove}
							style="left: 0; right: auto;"
						>
							{help}
						</div>
					{/if}
				</span>
			{/if}
		</label>
	{/if}
</div>

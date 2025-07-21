<script lang="ts">
	export let id = '';
	export let type: string = 'text';
	export let placeholder: string = '';
	export let value: any;
	export let icon: any = null;
	export let required: boolean = false;
	export let ariaLabel: string = '';
	export let disabled: boolean = false;
	export let inputClass: string = '';
	export let onInput: ((e: Event) => void) | undefined = undefined;
</script>

<div class="mb-6">
	<div class="relative">
		<input
			{id}
			{type}
			{placeholder}
			bind:value
			class={`w-full rounded-xl border border-gray-300 bg-white py-3 pr-4 pl-12 text-lg text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400 ${inputClass}`}
			{required}
			aria-label={ariaLabel}
			{disabled}
			on:input={onInput}
		/>
		{#if icon}
			<svelte:component
				this={icon}
				class="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-gray-400 dark:text-gray-500"
				aria-hidden="true"
			/>
		{/if}
	</div>
</div>

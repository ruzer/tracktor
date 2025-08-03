<script lang="ts">
	import { Jumper } from 'svelte-loading-spinners';

	const { text, loading } = $props();
</script>

<div class="flex justify-center">
	{#if !loading}
		<button
			type="submit"
			class="flex cursor-pointer gap-2 rounded-lg bg-blue-600 px-4 py-2 text-lg font-semibold text-white shadow-md dark:text-blue-200"
			disabled={loading}
			aria-busy={loading}
		>
			<span>{text}</span>
		</button>
	{:else}
		<Jumper size="40" color="#155dfc" unit="px" duration="2s" />
	{/if}
</div>

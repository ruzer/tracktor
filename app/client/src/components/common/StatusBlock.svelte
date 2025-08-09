<script lang="ts">
	import ChartCard from '$components/chart/ChartCard.svelte';

	let {
		message,
		type = 'INFO'
	}: {
		message?: string;
		type: 'INFO' | 'SUCCESS' | 'ERROR';
	} = $props();

	const getStatusTypeClasses = () => {
		if (type === 'INFO') return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
		if (type === 'SUCCESS')
			return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
		if (type === 'ERROR') return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
	};
</script>

{#if message}
	<p class={`mt-4 rounded-md p-3 text-center text-sm font-medium ${getStatusTypeClasses()}`}>
		{message}
	</p>
{/if}

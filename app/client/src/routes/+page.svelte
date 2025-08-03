<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Jumper } from 'svelte-loading-spinners';

	if (browser) {
		const pin = localStorage.getItem('userPin');
		if (pin) {
			goto('/dashboard', { replaceState: true });
		} else {
			goto('/login', { replaceState: true });
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center gap-10 bg-gray-50">
	<Jumper size="64" color="#155dfc" duration="2s" />
	<p class="text-lg text-gray-600">Redirecting...</p>
</div>

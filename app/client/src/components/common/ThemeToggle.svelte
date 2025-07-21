<script lang="ts">
	import { browser } from '$app/environment';
	import { Moon, Sun } from '@lucide/svelte';
	let darkMode = $state(false);

	if (browser) {
		const storedDark = localStorage.getItem('darkMode');
		darkMode = storedDark === 'true';
		document.documentElement.classList.toggle('dark', storedDark === 'true');
	}
	function toggleDarkMode() {
		darkMode = !darkMode;
		document.documentElement.classList.toggle('dark', darkMode);
		if (browser) {
			localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
		}
	}
</script>

<button
	type="button"
	class="ml-auto flex items-center gap-2 rounded-full bg-gray-200 p-2 shadow transition-colors dark:bg-gray-700"
	onclick={toggleDarkMode}
	aria-label="Toggle dark mode"
>
	<span class="sr-only">Toggle dark mode</span>
	<div class="relative flex items-center">
		<!-- Switch background -->
		<span
			class="inline-block h-6 w-12 rounded-full transition-colors duration-300"
			class:!bg-blue-500={darkMode}
			class:!bg-gray-400={!darkMode}
			style="background-color: {darkMode ? '#facc15' : '#d1d5db'}"
		></span>
		<!-- Switch knob -->
		<span
			class="absolute top-0 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform duration-300"
			style="transform: translateX({darkMode ? '24px' : '0px'});"
		>
			{#if darkMode}
				<Moon class="h-4 w-4 text-yellow-600" />
			{:else}
				<Sun class="h-4 w-4 text-yellow-500" />
			{/if}
		</span>
	</div>
</button>

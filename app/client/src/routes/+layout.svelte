<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import '../styles/app.css';
	import { tick } from 'svelte';
	import { Car, LogOut, Tractor } from '@lucide/svelte';
	import ThemeToggle from '../components/common/ThemeToggle.svelte';

	let { children } = $props();

	let isAuthenticated = $state(false);
	let currentPath = $derived(page.url.pathname);
	let checkingAuth = $state(true);

	$effect(() => {
		if (browser) {
			const pin = localStorage.getItem('userPin');
			isAuthenticated = !!pin;

			if (currentPath !== '/login' && !isAuthenticated) {
				goto('/login', { replaceState: true });
			}
		}
		tick().then(() => {
			checkingAuth = false;
		});
	});

	function logout() {
		if (browser) {
			localStorage.removeItem('userPin');
			isAuthenticated = false;
			// goto is already handled by the effect
		}
	}
</script>

<!-- Dark mode toggle, scrolls with screen -->

{#if checkingAuth}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<!-- You can replace this with a more sophisticated loading spinner -->
		<p class="text-lg text-gray-600">Loading...</p>
	</div>
{:else if isAuthenticated}
	<div class="min-h-screen bg-gray-100 transition-colors dark:bg-gray-900">
		<header class="bg-white shadow-sm transition-colors dark:bg-gray-800">
			<nav class="container mx-auto flex items-center justify-between p-4">
				<a
					href="/dashboard"
					class="flex items-center gap-2 text-2xl font-bold text-blue-700 transition-colors hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-400"
				>
					<Tractor class="h-8 w-8" />
					Tracktor
				</a>
				<div class="flex items-center justify-center gap-4 align-middle">
					<ThemeToggle />
					<div class="flex items-center gap-2">
						<button
							onclick={logout}
							class="flex items-center gap-1 text-gray-600 transition-colors duration-300 hover:text-red-500 dark:text-gray-300"
						>
							<LogOut class="h-5 w-5" />
							Logout
						</button>
					</div>
				</div>
			</nav>
		</header>
		<main>
			{@render children()}
		</main>
	</div>
{:else}
	<!-- Render login page or other public pages -->
	{@render children()}
{/if}

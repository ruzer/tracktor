<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import PinInput from '../../components/Auth/PinInput.svelte';
	import ThemeToggle from '../../components/Common/ThemeToggle.svelte';
	import { env } from '$env/dynamic/public';

	let loading = $state(false);
	let error = $state('');
	let pinExists = $state(false); // New state to track if PIN exists on server
	let checkingPinStatus = $state(true); // New state to track initial status check

	// If the user is already logged in, redirect to the dashboard.
	$effect(() => {
		if (browser) {
			const localPin = localStorage.getItem('userPin');
			if (localPin) {
				goto('/dashboard', { replaceState: true });
				return;
			}

			// Check if PIN exists on the server
			async function checkPinStatus() {
				try {
					const response = await fetch(`${env.PUBLIC_API_BASE_URL}/api/pin/status`);
					if (response.ok) {
						const data = await response.json();
						pinExists = data.exists;
					} else {
						error = 'Failed to check PIN status.';
					}
				} catch (e) {
					error = 'Failed to connect to the server. Please check your connection.';
				} finally {
					checkingPinStatus = false;
				}
			}
			checkPinStatus();
		}
	});

	async function handlePinComplete(event: CustomEvent<string>) {
		const pin = event.detail;
		loading = true;
		error = '';

		try {
			const endpoint = pinExists ? '/api/pin/verify' : '/api/pin';
			const response = await fetch(`${env.PUBLIC_API_BASE_URL}${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ pin })
			});

			if (response.ok) {
				// Store PIN and redirect
				if (browser) {
					localStorage.setItem('userPin', pin);
				}
				goto('/dashboard', { replaceState: true });
			} else {
				const data = await response.json();
				error = data.message || (pinExists ? 'Invalid PIN. Please try again.' : 'Failed to set PIN.');
			}
		} catch (e) {
			error = 'Failed to connect to the server. Please check your connection.';
		} finally {
			loading = false;
		}
	}
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 transition-colors dark:bg-gray-900"
>
	<div
		class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
	>
		<div class="mb-6">
			<ThemeToggle />
			<h1 class="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome Back</h1>
		</div>

		{#if checkingPinStatus}
			<p class="mb-6 text-center text-gray-600 dark:text-gray-300">Checking PIN status...</p>
		{:else if pinExists}
			<p class="mb-6 text-center text-gray-600 dark:text-gray-300">
				Enter your 6-digit PIN to access your dashboard.
			</p>
		{:else}
			<p class="mb-6 text-center text-gray-600 dark:text-gray-300">
				Set your 6-digit PIN to secure your dashboard.
			</p>
		{/if}

		{#if !checkingPinStatus}
			<PinInput on:complete={handlePinComplete} />
		{/if}

		{#if loading}
			<p class="mt-4 text-center font-semibold text-blue-600 dark:text-blue-400">Verifying...</p>
		{/if}
		{#if error}
			<p
				class="mt-4 rounded-md bg-red-100 p-3 text-center font-medium text-red-700 dark:bg-red-900 dark:text-red-300"
			>
				{error}
			</p>
		{/if}
	</div>
</div>

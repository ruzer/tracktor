<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import PinInput from '$components/auth/PinInput.svelte';
	import ThemeToggle from '$components/common/ThemeToggle.svelte';
	import { getApiUrl } from '$lib/utils/api';
	import { ShieldEllipsis, Tractor } from '@lucide/svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import { simulateNetworkDelay } from '$lib/utils/dev';
	import StatusBlock from '$components/common/StatusBlock.svelte';
	import type { Status } from '$lib/models/status';
	import { t } from '$lib/stores/i18n';

	let loading = $state(false);
	let status = $state<Status>({
		message: undefined,
		type: 'INFO'
	});
	let pinExists = $state(false);
	let checkingPinStatus = $state(true);

	$effect(() => {
		if (browser) {
			async function checkPinStatus() {
				try {
					const pinStatusUrl = getApiUrl('/api/pin/status');
					console.debug('[login] GET /api/pin/status ->', pinStatusUrl);
					const response = await fetch(pinStatusUrl);
					if (response.ok) {
						const data = await response.json();
						pinExists = data.exists;
						if (!pinExists) {
							status = {
								message: $t('login.errors.missingPinEnv'),
								type: 'ERROR'
							};
						}
					} else {
						console.error('[login] PIN status failed', response.status, response.statusText);
						status = {
							message: $t('login.errors.checkStatusFailed'),
							type: 'ERROR'
						};
					}
				} catch (e) {
					console.error('[login] PIN status error', e);
					status = {
						message: $t('login.errors.unknownServerError'),
						type: 'ERROR'
					};
				} finally {
					checkingPinStatus = false;
				}
			}
			checkPinStatus();
			const localPin = localStorage.getItem('userPin');
			if (localPin) {
				endpointCall(localPin, true);
				return;
			}
		}
	});

	async function handlePinComplete(pin: string) {
		loading = true;
		status.message = '';
		// await simulateNetworkDelay(1000); // Simulate network delay for development
		try {
			await endpointCall(pin, pinExists);
		} catch (e) {
			console.error(e);
			status = {
				message: $t('forms.errors.connectionFailed'),
				type: 'ERROR'
			};
		} finally {
			loading = false;
		}
	}

	const endpointCall = async (pin: string, verify = true) => {
		const endpoint = verify ? '/api/pin/verify' : '/api/pin';
		const url = getApiUrl(endpoint);
		console.debug('[login] POST', endpoint, '->', url);
		const response = await fetch(url, {
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
			loading = false;
			status = {
				message: $t('login.success.pinVerified'),
				type: 'SUCCESS'
			};
			await simulateNetworkDelay(1000);
			goto('/dashboard', { replaceState: true });
		} else {
			console.error('[login] PIN endpoint failed', response.status, response.statusText);
			const data = await response.json();
			status = {
				message:
					data.message ||
					(pinExists ? $t('login.errors.invalidPin') : $t('login.errors.failedSetPin')),
				type: 'ERROR'
			};
		}
	};
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 transition-colors dark:bg-gray-900"
>
	<div class="absolute top-4 right-4">
		<ThemeToggle />
	</div>
	<div
		class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
	>
		<div class="mb-6">
			<h1
				class="flex items-center justify-center gap-5 text-center text-3xl font-bold text-gray-800 dark:text-gray-100"
			>
				<Tractor class="h-10 w-10"></Tractor>
				{$t('login.title')}
			</h1>
		</div>

		{#if checkingPinStatus}
			<p class="mb-6 text-center text-gray-600 dark:text-gray-300">
				{$t('login.checkingPinStatus')}
			</p>
		{:else if pinExists}
			<p
				class="mb-6 flex items-center justify-center gap-2 text-center text-gray-600 dark:text-gray-300"
			>
				<ShieldEllipsis class="h-8 w-8" />
				{$t('login.enterPinPrompt')}
			</p>
		{/if}

		{#if !checkingPinStatus && pinExists}
			<PinInput complete={(pin: string) => handlePinComplete(pin)} />
		{/if}

		{#if loading}
			<p
				class="mt-4 flex items-center justify-center text-center font-semibold text-blue-600 dark:text-blue-400"
			>
				<Jumper size="40" color="#155dfc" unit="px" duration="2s" />
			</p>
		{/if}
		<StatusBlock message={status.message} type={status.type} />
	</div>
</div>

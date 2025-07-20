<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FormField from '../Common/FormField.svelte';
	import { Calendar1, Gauge, DollarSign, Fuel, FileText } from '@lucide/svelte';

	const dispatch = createEventDispatcher();

	export let vehicleId: number | null = null;
	export let onSuccess: (() => void) | null = null;
	export let showModal: boolean = false;
	export let closeModal: (() => void) | null = null;

	let refill = {
		date: '',
		odometer: '',
		fuelAmount: '',
		cost: '',
		notes: ''
	};

	let loading = false;
	let error = '';

	function resetForm() {
		refill = {
			date: '',
			odometer: '',
			fuelAmount: '',
			cost: '',
			notes: ''
		};
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		if (!vehicleId) {
			error = 'No vehicle selected.';
			return;
		}
		if (!refill.date || !refill.odometer || !refill.fuelAmount || !refill.cost) {
			error = 'Please fill in all required fields.';
			return;
		}
		loading = true;
		try {
			const response = await fetch(`http://localhost:3000/api/vehicles/${vehicleId}/fuel-logs`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-User-PIN': localStorage.getItem('userPin') || ''
				},
				body: JSON.stringify({
					date: refill.date,
					odometer: parseFloat(refill.odometer),
					fuelAmount: parseFloat(refill.fuelAmount),
					cost: parseFloat(refill.cost),
					notes: refill.notes
				})
			});
			if (response.ok) {
				resetForm();
				dispatch('success');
				if (onSuccess) onSuccess();
			} else {
				const data = await response.json();
				error = data?.message || 'Failed to log fuel refill.';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		<div
			class="animate-scale-up relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-10 shadow-2xl dark:bg-gray-800"
		>
			<!-- Close Icon -->
			<button
				type="button"
				class="absolute top-6 right-6 rounded-full bg-gray-100 p-2 text-gray-400 transition hover:text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
				on:click={closeModal}
				aria-label="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
			<h2 class="mb-2 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
				Log Fuel Refill
			</h2>
			<div class="mb-8 border-b border-gray-200 dark:border-gray-700"></div>
			<form class="space-y-6" on:submit={handleSubmit} aria-labelledby="fuel-refill-form-title">
				<FormField
					id="date"
					type="date"
					placeholder="Date"
					bind:value={refill.date}
					icon={Calendar1}
					required={true}
					ariaLabel="Refill Date"
				/>
				<FormField
					id="odometer"
					type="number"
					placeholder="Odometer Reading"
					bind:value={refill.odometer}
					icon={Gauge}
					required={true}
					ariaLabel="Odometer Reading"
					inputClass="step-0.01"
				/>
				<FormField
					id="fuelAmount"
					type="number"
					placeholder="Fuel Amount (liters)"
					bind:value={refill.fuelAmount}
					icon={Fuel}
					required={true}
					ariaLabel="Fuel Amount"
					inputClass="step-0.01"
				/>
				<FormField
					id="cost"
					type="number"
					placeholder="Cost"
					bind:value={refill.cost}
					icon={DollarSign}
					required={true}
					ariaLabel="Fuel Cost"
					inputClass="step-0.01"
				/>
				<FormField
					id="notes"
					type="text"
					placeholder="Notes (optional)"
					bind:value={refill.notes}
					icon={FileText}
					ariaLabel="Notes"
				/>
				{#if error}
					<div class="text-sm text-red-600 dark:text-red-400" role="alert">{error}</div>
				{/if}
				<div class="flex justify-center">
					<button
						type="submit"
						class="flex cursor-pointer gap-2 rounded-lg border-2 bg-blue-600 px-3 py-1 text-lg font-semibold text-blue-600 shadow-md dark:text-blue-200"
						disabled={loading}
						aria-busy={loading}
					>
						{loading ? 'Logging...' : 'Log Refill'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

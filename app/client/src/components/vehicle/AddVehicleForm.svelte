<script lang="ts">
	import VehicleForm from './VehicleForm.svelte';

	export let newVehicle;
	export let addVehicle;
	export let addVehicleError = '';
	export let addVehicleSuccess = '';
	export let showModal = false;
	export let editMode = false;

	function closeModal() {
		showModal = false;
	}
</script>

{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		<div
			class="animate-scale-up relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-10 shadow-2xl dark:bg-gray-800"
		>
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
				{editMode ? 'Edit Vehicle Details' : 'Add a New Vehicle'}
			</h2>
			<div class="mb-8 border-b border-gray-200 dark:border-gray-700"></div>
			<VehicleForm
				vehicle={newVehicle}
				onSubmit={addVehicle}
				error={addVehicleError}
				success={addVehicleSuccess}
				{editMode}
			/>
		</div>
	</div>
{/if}

<style>
	@keyframes scale-up {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.animate-scale-up {
		animation: scale-up 0.3s ease-out forwards;
	}
</style>

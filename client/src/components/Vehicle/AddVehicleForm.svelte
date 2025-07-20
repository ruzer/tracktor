<script lang="ts">
	import {
		Car,
		Calendar1,
		IdCard,
		Fingerprint,
		Paintbrush,
		Gauge,
		Building2
	} from '@lucide/svelte';
	import FormField from '../Common/FormField.svelte';

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
			class="animate-scale-up relative w-full max-w-xl rounded-2xl bg-white p-10 shadow-2xl dark:bg-gray-800 overflow-y-auto max-h-[90vh]"
		>
			<!-- Close Icon -->
			<button
				type="button"
				class="absolute top-6 right-6 rounded-full bg-gray-100 p-2 text-gray-400 transition hover:text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
				onclick={closeModal}
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
			<form
				onsubmit={(e) => {
					addVehicle();
					e.preventDefault();
				}}
				class="space-y-6"
			>
				<!-- Modern field: placeholder, rounded input, icon -->
				<FormField
					id="make"
					type="text"
					placeholder="Make"
					bind:value={newVehicle.make}
					icon={Building2}
					required={true}
					ariaLabel="Vehicle Make"
				/>
				<FormField
					id="model"
					type="text"
					placeholder="Model"
					bind:value={newVehicle.model}
					icon={Car}
					required={true}
					ariaLabel="Vehicle Model"
				/>
				<FormField
					id="year"
					type="number"
					placeholder="Year"
					bind:value={newVehicle.year}
					icon={Calendar1}
					required={true}
					ariaLabel="Vehicle Year"
				/>
				<FormField
					id="licensePlate"
					type="text"
					placeholder="License Plate"
					bind:value={newVehicle.licensePlate}
					icon={IdCard}
					required={true}
					ariaLabel="License Plate"
				/>
				<FormField
					id="vin"
					type="text"
					placeholder="VIN (Optional)"
					bind:value={newVehicle.vin}
					icon={Fingerprint}
					ariaLabel="VIN (Optional)"
				/>
				<FormField
					id="color"
					type="text"
					placeholder="Color (Optional)"
					bind:value={newVehicle.color}
					icon={Paintbrush}
					ariaLabel="Color (Optional)"
				/>
				<FormField
					id="odometer"
					type="number"
					placeholder="Odometer (Optional)"
					bind:value={newVehicle.odometer}
					icon={Gauge}
					ariaLabel="Odometer (Optional)"
				/>
				<div class="flex justify-center">
					<button
						type="submit"
						class="flex cursor-pointer gap-2 rounded-lg border-2 bg-blue-600 px-3 py-1 text-lg font-semibold text-blue-600 shadow-md dark:text-blue-200"
					>
						{editMode ? 'Save Changes' : 'Add Vehicle'}
					</button>
				</div>
			</form>
			{#if addVehicleError}
				<p class="mt-4 text-center text-sm text-red-500 dark:text-red-400">{addVehicleError}</p>
			{/if}
			{#if addVehicleSuccess}
				<p class="mt-4 text-center text-sm text-green-500 dark:text-green-400">
					{editMode ? 'Vehicle updated successfully!' : addVehicleSuccess}
				</p>
			{/if}
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

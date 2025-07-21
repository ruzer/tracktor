<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import FuelRefillFormComponent from "./FuelRefillFormComponent.svelte";
  import { env } from "$env/dynamic/public";

  const dispatch = createEventDispatcher();

  export let vehicleId: number | null = null;
  export let onSuccess: (() => void) | null = null;
  export let showModal: boolean = false;
  export let closeModal: (() => void) | null = null;

  let refill = {
    date: "",
    odometer: "",
    fuelAmount: "",
    cost: "",
    notes: "",
  };

  let loading = false;
  let error = "";

  function resetForm() {
    refill = {
      date: "",
      odometer: "",
      fuelAmount: "",
      cost: "",
      notes: "",
    };
  }

  async function handleSubmit() {
    error = "";
    if (!vehicleId) {
      error = "No vehicle selected.";
      return;
    }
    if (!refill.date || !refill.odometer || !refill.fuelAmount || !refill.cost) {
      error = "Please fill in all required fields.";
      return;
    }
    loading = true;
    try {
      const response = await fetch(
        `${env.PUBLIC_API_BASE_URL}/api/vehicles/${vehicleId}/fuel-logs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-PIN": localStorage.getItem("userPin") || "",
          },
          body: JSON.stringify({
            date: refill.date,
            odometer: parseFloat(refill.odometer),
            fuelAmount: parseFloat(refill.fuelAmount),
            cost: parseFloat(refill.cost),
            notes: refill.notes,
          }),
        }
      );
      if (response.ok) {
        resetForm();
        dispatch("success");
        if (onSuccess) onSuccess();
      } else {
        const data = await response.json();
        error = data?.message || "Failed to log fuel refill.";
      }
    } catch (err) {
      error = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }
</script>

{#if showModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  >
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
      <h2
        class="mb-2 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100"
      >
        Log Fuel Refill
      </h2>
      <div class="mb-8 border-b border-gray-200 dark:border-gray-700"></div>
      <FuelRefillFormComponent
        bind:refill
        onSubmit={handleSubmit}
        bind:error
        bind:loading
      />
    </div>
  </div>
{/if}

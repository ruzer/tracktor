<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  export let vehicleId: number | null = null;
  export let showModal: boolean = false;
  export let closeModal: () => void;
  export let initialData: {
    id?: number;
    date: string;
    odometer: number;
    service: string;
    cost: number;
    notes?: string;
  } | null = null;

  let date = "";
  let odometer: number | null = null;
  let service = "";
  let cost: number | null = null;
  let notes = "";

  let error = "";
  let success = "";

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (initialData) {
      date = initialData.date;
      odometer = initialData.odometer;
      service = initialData.service;
      cost = initialData.cost;
      notes = initialData.notes || "";
    }
  });

  async function handleSubmit() {
    error = "";
    success = "";

    if (!date || !odometer || !service || !cost) {
      error = "Date, Odometer, Service, and Cost are required.";
      return;
    }

    const method = initialData && initialData.id ? "PUT" : "POST";
    const url =
      initialData && initialData.id
        ? `/api/maintenance-logs/${initialData.id}`
        : `/api/vehicles/${vehicleId}/maintenance-logs`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-User-PIN": localStorage.getItem("userPin") || "",
        },
        body: JSON.stringify({ date, odometer, service, cost, notes }),
      });

      if (response.ok) {
        success = `Maintenance log ${method === "POST" ? "added" : "updated"} successfully!`;
        dispatch("success");
        closeModal();
      } else {
        const data = await response.json();
        error = data.message || `Failed to ${method === "POST" ? "add" : "update"} maintenance log.`;
      }
    } catch (e) {
      error = "Failed to connect to the server.";
    }
  }
</script>

{#if showModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800">
      <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {initialData ? "Edit Maintenance Log" : "Add Maintenance Log"}
      </h2>

      <form on:submit|preventDefault={handleSubmit}>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="md:col-span-2">
            <label
              for="date"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Date</label
            >
            <input
              type="date"
              id="date"
              bind:value={date}
              class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <label
              for="odometer"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Odometer</label
            >
            <input
              type="number"
              id="odometer"
              bind:value={odometer}
              class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <label
              for="cost"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Cost</label
            >
            <input
              type="number"
              id="cost"
              bind:value={cost}
              class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div class="md:col-span-2">
            <label
              for="service"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Service</label
            >
            <input
              type="text"
              id="service"
              bind:value={service}
              class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div class="md:col-span-2">
            <label
              for="notes"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Notes</label
            >
            <textarea
              id="notes"
              bind:value={notes}
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            ></textarea>
          </div>
        </div>

        {#if error}
          <div class="mt-4 text-red-600 dark:text-red-400" role="alert">
            {error}
          </div>
        {/if}

        {#if success}
          <div class="mt-4 text-green-600 dark:text-green-400" role="alert">
            {success}
          </div>
        {/if}

        <div class="mt-8 flex justify-end gap-4">
          <button
            type="button"
            on:click={closeModal}
            class="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >Cancel</button
          >
          <button
            type="submit"
            class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >{initialData ? "Update Log" : "Add Log"}</button
          >
        </div>
      </form>
    </div>
  </div>
{/if}

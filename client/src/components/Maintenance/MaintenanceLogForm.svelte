<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import MaintenanceLogFormComponent from "./MaintenanceLogFormComponent.svelte";

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

  let log = {
    date: "",
    odometer: null,
    service: "",
    cost: null,
    notes: "",
  };

  let error = "";
  let success = "";

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (initialData) {
      log = { ...initialData };
    }
  });

  async function handleSubmit() {
    error = "";
    success = "";

    if (!log.date || !log.odometer || !log.service || !log.cost) {
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
        body: JSON.stringify(log),
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
    <div
      class="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800"
    >
      <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {initialData ? "Edit Maintenance Log" : "Add Maintenance Log"}
      </h2>

      <MaintenanceLogFormComponent
        bind:log
        onSubmit={handleSubmit}
        bind:error
        bind:success
        editMode={!!initialData}
        on:close={closeModal}
      />
    </div>
  </div>
{/if}

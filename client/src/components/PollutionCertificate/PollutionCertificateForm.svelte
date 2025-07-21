<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  export let vehicleId: number | null = null;
  export let showModal: boolean = false;
  export let closeModal: () => void;
  export let initialData: {
    id?: number;
    certificateNumber: string;
    issueDate: string;
    expiryDate: string;
    testingCenter: string;
    notes?: string;
  } | null = null;

  let certificateNumber = "";
  let issueDate = "";
  let expiryDate = "";
  let testingCenter = "";
  let notes = "";

  let error = "";
  let success = "";

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (initialData) {
      certificateNumber = initialData.certificateNumber || "";
      issueDate = initialData.issueDate ? new Date(initialData.issueDate).toISOString().split("T")[0] : "";
      expiryDate = initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split("T")[0] : "";
      testingCenter = initialData.testingCenter || "";
      notes = initialData.notes || "";
    }
  });

  async function savePollutionCertificate() {
    error = "";
    success = "";

    if (!certificateNumber || !issueDate || !expiryDate || !testingCenter) {
      error = "All fields are required.";
      return;
    }

    const method = initialData && initialData.id ? "PUT" : "POST";
    const url = initialData && initialData.id
      ? `/api/vehicles/${vehicleId}/pollution-certificate`
      : `/api/vehicles/${vehicleId}/pollution-certificate`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-User-PIN": localStorage.getItem("userPin") || "",
        },
        body: JSON.stringify({ certificateNumber, issueDate, expiryDate, testingCenter, notes }),
      });

      if (response.ok) {
        success = `Pollution certificate ${initialData ? 'updated' : 'added'} successfully!`
        dispatch("success");
        closeModal();
      } else {
        const data = await response.json();
        error = data.message || "Failed to save pollution certificate.";
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
        {initialData ? "Edit" : "Add"} Pollution Certificate Details
      </h2>

      <form on:submit|preventDefault={savePollutionCertificate}>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="md:col-span-2">
            <label
              for="certificateNumber"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Certificate Number</label
            >
            <input
              type="text"
              id="certificateNumber"
              bind:value={certificateNumber}
              class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <label
              for="issueDate"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Issue Date</label
            >
            <input
              type="date"
              id="issueDate"
              bind:value={issueDate}
              class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <label
              for="expiryDate"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Expiry Date</label
            >
            <input
              type="date"
              id="expiryDate"
              bind:value={expiryDate}
              class="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div class="md:col-span-2">
            <label
              for="testingCenter"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Testing Center</label
            >
            <input
              type="text"
              id="testingCenter"
              bind:value={testingCenter}
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
            >Save</button
          >
        </div>
      </form>
    </div>
  </div>
{/if}

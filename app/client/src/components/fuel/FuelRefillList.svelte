<script lang="ts">
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';

  export let vehicleId: number;

  interface FuelLog {
    id: number;
    date: string;
    odometer: number;
    fuelAmount: number;
    cost: number;
    notes?: string;
    mileage?: number;
  }

  let fuelLogs: FuelLog[] = [];
  let loading = true;
  let error = '';

  async function fetchFuelLogs() {
    loading = true;
    error = '';
    try {
      const response = await fetch(`${env.PUBLIC_API_BASE_URL}/api/vehicles/${vehicleId}/fuel-logs`, {
        headers: {
          'X-User-PIN': localStorage.getItem('userPin') || ''
        }
      });
      if (response.ok) {
        fuelLogs = await response.json();
      } else {
        const data = await response.json();
        error = data.message || 'Failed to fetch fuel logs.';
      }
    } catch (e) {
      console.error('Failed to connect to the server.', e);
      error = 'Failed to connect to the server.';
    }
    loading = false;
  }

  onMount(() => {
    fetchFuelLogs();
  });

  // Reactively fetch logs when vehicleId changes
  $: if (vehicleId) {
    fetchFuelLogs();
  }
</script>

<div class="container mx-auto p-4">
  <h2 class="text-2xl font-bold mb-4">Fuel Refill History</h2>

  {#if loading}
    <p>Loading fuel logs...</p>
  {:else if error}
    <p class="text-red-500">Error: {error}</p>
  {:else if fuelLogs.length === 0}
    <p>No fuel refill logs found for this vehicle.</p>
  {:else}
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <thead class="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th class="py-2 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Date</th>
            <th class="py-2 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Odometer</th>
            <th class="py-2 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Fuel Amount (L)</th>
            <th class="py-2 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Cost</th>
            <th class="py-2 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Mileage (km/L)</th>
            <th class="py-2 px-4 text-left text-gray-600 dark:text-gray-300 font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody>
          {#each fuelLogs as log (log.id)}
            <tr class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <td class="py-2 px-4 text-gray-800 dark:text-gray-200">{new Date(log.date).toLocaleDateString()}</td>
              <td class="py-2 px-4 text-gray-800 dark:text-gray-200">{log.odometer} km</td>
              <td class="py-2 px-4 text-gray-800 dark:text-gray-200">{log.fuelAmount} L</td>
              <td class="py-2 px-4 text-gray-800 dark:text-gray-200">${log.cost.toFixed(2)}</td>
              <td class="py-2 px-4 text-gray-800 dark:text-gray-200">{log.mileage ? log.mileage.toFixed(2) : 'N/A'}</td>
              <td class="py-2 px-4 text-gray-800 dark:text-gray-200">{log.notes || 'N/A'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<script lang="ts">
  import {
    Car,
    Calendar1,
    IdCard,
    Fingerprint,
    Paintbrush,
    Gauge,
    Building2,
  } from "@lucide/svelte";
  import FormField from "../Common/FormField.svelte";

  export let vehicle;
  export let onSubmit;
  export let error = "";
  export let success = "";
  export let editMode = false;
</script>

<form
  on:submit={(e) => {
    onSubmit();
    e.preventDefault();
  }}
  class="space-y-6"
>
  <FormField
    id="make"
    type="text"
    placeholder="Make"
    bind:value={vehicle.make}
    icon={Building2}
    required={true}
    ariaLabel="Vehicle Make"
  />
  <FormField
    id="model"
    type="text"
    placeholder="Model"
    bind:value={vehicle.model}
    icon={Car}
    required={true}
    ariaLabel="Vehicle Model"
  />
  <FormField
    id="year"
    type="number"
    placeholder="Year"
    bind:value={vehicle.year}
    icon={Calendar1}
    required={true}
    ariaLabel="Vehicle Year"
  />
  <FormField
    id="licensePlate"
    type="text"
    placeholder="License Plate"
    bind:value={vehicle.licensePlate}
    icon={IdCard}
    required={true}
    ariaLabel="License Plate"
  />
  <FormField
    id="vin"
    type="text"
    placeholder="VIN (Optional)"
    bind:value={vehicle.vin}
    icon={Fingerprint}
    ariaLabel="VIN (Optional)"
  />
  <FormField
    id="color"
    type="text"
    placeholder="Color (Optional)"
    bind:value={vehicle.color}
    icon={Paintbrush}
    ariaLabel="Color (Optional)"
  />
  <FormField
    id="odometer"
    type="number"
    placeholder="Odometer (Optional)"
    bind:value={vehicle.odometer}
    icon={Gauge}
    ariaLabel="Odometer (Optional)"
  />
  <div class="flex justify-center">
    <button
      type="submit"
      class="flex cursor-pointer gap-2 rounded-lg border-2 bg-blue-600 px-3 py-1 text-lg font-semibold text-blue-600 shadow-md dark:text-blue-200"
    >
      {editMode ? "Save Changes" : "Add Vehicle"}
    </button>
  </div>
</form>
{#if error}
  <p class="mt-4 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
{/if}
{#if success}
  <p class="mt-4 text-center text-sm text-green-500 dark:text-green-400">
    {editMode ? "Vehicle updated successfully!" : success}
  </p>
{/if}

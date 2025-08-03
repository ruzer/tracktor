<script lang="ts">
	import FuelLogForm from './FuelLogForm.svelte';
	import { env } from '$env/dynamic/public';
	import ModalContainer from '../../components/common/ModalContainer.svelte';

	let { vehicleId = null, showModal = $bindable(), loading } = $props();

	function closeModal() {
		showModal = false;
	}
</script>

{#if showModal}
	<ModalContainer onclose={() => closeModal()} title="Log Fuel Refill" {loading}>
		<FuelLogForm {vehicleId} bind:modalVisibility={showModal} {loading} />
	</ModalContainer>
{/if}

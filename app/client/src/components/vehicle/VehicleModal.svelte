<script lang="ts">
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import VehicleForm from './VehicleForm.svelte';

	let { vehicleToEdit = null, editMode = false, showModal = $bindable(), loading } = $props();

	function closeModal() {
		showModal = false;
	}
</script>

{#if showModal}
	<ModalContainer onclose={closeModal} title={'Add Vehicle'} {loading}>
		<VehicleForm bind:modalVisibility={showModal} {loading} />
	</ModalContainer>
{/if}

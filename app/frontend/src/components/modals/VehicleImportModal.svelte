<script lang="ts">
	import ModalContainer from '$components/common/ModalContainer.svelte';
	import VehicleImportForm from '$components/forms/VehicleImportForm.svelte';
	import { t } from '$lib/stores/i18n';
	import { createEventDispatcher } from 'svelte';
	import type { VehicleImportSummary } from '$lib/types/import';

	let { open = $bindable(false) } = $props<{ open?: boolean }>();

	const dispatch = createEventDispatcher<{ imported: VehicleImportSummary }>();
	let formKey = $state(0);

	function closeModal() {
		open = false;
	}

	$effect(() => {
		if (!open) {
			formKey += 1;
		}
	});
</script>

{#if open}
	<ModalContainer onclose={closeModal} title={$t('vehicle.import.title')}>
		{#key formKey}
			<VehicleImportForm on:imported={(event) => dispatch('imported', event.detail)} />
		{/key}
	</ModalContainer>
{/if}

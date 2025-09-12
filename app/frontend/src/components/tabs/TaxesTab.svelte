<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import TabContainer from '$components/common/TabContainer.svelte';
	import TaxList from '$components/lists/TaxList.svelte';
	let { vehicleId } = $props();
</script>

<TabContainer title={$t('navigation.taxes')}>
	<TaxList {vehicleId} />
</TabContainer>

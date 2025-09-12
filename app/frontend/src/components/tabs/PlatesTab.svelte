<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import TabContainer from '$components/common/TabContainer.svelte';
	import PlateList from '$components/lists/PlateList.svelte';
	let { vehicleId } = $props();
</script>

<TabContainer title={$t('navigation.plates')}>
	<PlateList {vehicleId} />
</TabContainer>

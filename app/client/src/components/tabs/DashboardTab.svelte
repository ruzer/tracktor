<script lang="ts">
	import TabContainer from '$components/common/TabContainer.svelte';
	import DashboardCharts from '$components/chart/DashboardCharts.svelte';

	const { vehicleId } = $props();
</script>

<TabContainer title="Fuel Cost & Mileage Trends">
	<DashboardCharts {vehicleId} />
</TabContainer>

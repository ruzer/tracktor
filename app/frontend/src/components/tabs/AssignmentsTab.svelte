<script lang="ts">
  import { t } from '$lib/stores/i18n';
  import TabContainer from '$components/common/TabContainer.svelte';
  import AssignmentList from '$components/lists/AssignmentList.svelte';
  let { vehicleId } = $props();
</script>

<TabContainer title={$t('navigation.assignments')}>
  <AssignmentList {vehicleId} />
</TabContainer>


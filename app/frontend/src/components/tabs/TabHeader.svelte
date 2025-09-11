<script lang="ts">
	import { t } from '$lib/stores/i18n';
	
    let { activeTab = $bindable() } = $props();
    // Make tab labels reactive to language changes by storing keys
    const tabs: { key: string; id: string }[] = [
        { key: 'navigation.dashboard', id: 'dashboard' },
        { key: 'navigation.fuelLogs', id: 'fuel' },
        { key: 'navigation.maintenance', id: 'maintenance' },
        { key: 'navigation.insurance', id: 'insurance' },
        { key: 'navigation.pollution', id: 'pollution' },
        { key: 'navigation.plates', id: 'plates' },
        { key: 'navigation.assignments', id: 'assignments' },
        { key: 'navigation.taxes', id: 'taxes' }
    ];
</script>

<ul class="-mb-px flex flex-wrap" id="default-tab" role="tablist" aria-orientation="horizontal">
	{#each tabs as tab (tab)}
		<li class="me-2" role="presentation">
            <button
                class="inline-block cursor-pointer rounded-t-lg px-4 py-2 text-sm font-medium"
                class:text-blue-600={activeTab === tab.id}
                class:border-blue-600={activeTab === tab.id}
                class:hover:text-gray-600={activeTab !== tab.id}
                class:hover:border-gray-300={activeTab !== tab.id}
                class:dark:text-blue-500={activeTab === tab.id}
                class:dark:border-blue-500={activeTab === tab.id}
                class:dark:hover:text-gray-300={activeTab !== tab.id}
                class:border-transparent={activeTab !== tab.id}
                class:text-gray-500={activeTab !== tab.id}
                class:dark:text-gray-400={activeTab !== tab.id}
                onclick={() => (activeTab = tab.id)}
                type="button"
                role="tab"
                aria-controls={tab.id}
                aria-selected={activeTab === tab.id}>{$t(tab.key)}</button
            >
        </li>
    {/each}
</ul>

<script lang="ts">
  import { getApiUrl } from '$lib/utils/api';
  import { t } from '$lib/stores/i18n';
  import Button from '$components/common/Button.svelte';
  import { Jumper } from 'svelte-loading-spinners';
  let { vehicleId } = $props();
  let rows = $state<any[]>([]);
  let loading = $state(false);
  let error = $state('');
  let form = $state({ assigneeName:'', assigneeRole:'', area:'', unit:'', startDate:'', isCurrent:true, notes:'' });

  async function load(){
    loading = true; error='';
    try{
      const res = await fetch(getApiUrl(`/api/vehicles/${vehicleId}/assignments`), { headers:{'X-User-PIN': localStorage.getItem('userPin') || ''}});
      if(res.ok) rows = await res.json(); else error=(await res.json()).message || $t('errors.fetchFailed');
    } catch { error=$t('errors.networkError'); }
    loading = false;
  }
  $effect(()=>{ if(vehicleId) load(); })

  async function add(){
    try{
      const res = await fetch(getApiUrl(`/api/vehicles/${vehicleId}/assignments`), { method:'POST', headers:{'Content-Type':'application/json','X-User-PIN': localStorage.getItem('userPin') || ''}, body: JSON.stringify(form)});
      if(res.ok){ form={ assigneeName:'', assigneeRole:'', area:'', unit:'', startDate:'', isCurrent:true, notes:''}; await load(); } else error=(await res.json()).message || $t('errors.fetchFailed');
    } catch { error=$t('errors.networkError'); }
  }
  async function closeAssignment(id:string){
    await fetch(getApiUrl(`/api/vehicles/${vehicleId}/assignments/${id}/close`), { method:'PATCH', headers:{'X-User-PIN': localStorage.getItem('userPin') || ''}});
    await load();
  }
</script>

{#if loading}
  <p class="flex items-center justify-center gap-5 text-lg text-gray-500 dark:text-gray-400"><Jumper size="40" color="#155dfc" unit="px" duration="2s" />{$t('common.loading')}</p>
{:else}
  {#if error}<p class="text-red-500">{$t('common.error')}: {error}</p>{/if}
  <div class="mb-4 rounded bg-white p-4 shadow dark:bg-gray-800">
    <div class="grid grid-cols-3 gap-4">
      <input class="rounded border p-2 dark:bg-gray-700" placeholder={$t('forms.labels.assigneeName')} bind:value={form.assigneeName} />
      <input class="rounded border p-2 dark:bg-gray-700" placeholder={$t('forms.labels.assigneeRole')} bind:value={form.assigneeRole} />
      <input class="rounded border p-2 dark:bg-gray-700" placeholder={$t('forms.labels.area')} bind:value={form.area} />
      <input class="rounded border p-2 dark:bg-gray-700" placeholder={$t('forms.labels.unit')} bind:value={form.unit} />
      <input type="date" class="rounded border p-2 dark:bg-gray-700" placeholder={$t('forms.labels.startDate')} bind:value={form.startDate} />
      <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" bind:checked={form.isCurrent} /> {$t('forms.labels.current')}</label>
    </div>
    <div class="mt-3"><Button type="button" variant="primary" text={$t('forms.buttons.add')} onclick={add} /></div>
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <thead class="bg-gray-200 dark:bg-gray-700"><tr>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('forms.labels.assigneeName')}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('forms.labels.assigneeRole')}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('forms.labels.area')}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('forms.labels.unit')}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('forms.labels.startDate')}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('forms.labels.endDate')}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">{$t('table.headers.actions')}</th></tr></thead>
      <tbody>
        {#each rows as r (r.id)}
          <tr class="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
            <td class="px-4 py-2">{r.assigneeName}{#if r.isCurrent}<span class="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-100">{$t('forms.labels.current')}</span>{/if}</td>
            <td class="px-4 py-2">{r.assigneeRole || '-'}</td>
            <td class="px-4 py-2">{r.area || '-'}</td>
            <td class="px-4 py-2">{r.unit || '-'}</td>
            <td class="px-4 py-2">{r.startDate}</td>
            <td class="px-4 py-2">{r.endDate || '-'}</td>
            <td class="px-4 py-2"><Button type="button" variant="secondary" text={$t('forms.labels.close')} onclick={() => closeAssignment(r.id)} /></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

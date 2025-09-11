<script lang="ts">
  import { scale } from 'svelte/transition';
  import { Trash2 } from '@lucide/svelte';
  import Button from './Button.svelte';
  import { t } from '$lib/stores/i18n';

	let { onConfirm, open = $bindable() } = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
		<div
			in:scale={{ duration: 500 }}
			class="flex max-h-[90vh] max-w-xl flex-col items-center justify-center overflow-y-auto rounded-lg bg-white p-8 shadow-2xl dark:bg-gray-800"
		>
    <span class="rounded-lg bg-rose-50 p-3">
      <Trash2 class="h-6 w-6 text-rose-600" />
    </span>
    <h3 class="mt-4 text-2xl text-black dark:text-white">{$t('deleteConfirmation.title')}</h3>
    <h5 class="">{$t('deleteConfirmation.message')}</h5>
    <div class="mt-8 flex w-full gap-4">
      <Button variant="hero" text={$t('common.cancel')} type="button" onclick={() => (open = false)} />
      <Button variant="primary" text={$t('common.confirm')} type="button" onclick={onConfirm} />
    </div>
		</div>
	</div>
{/if}

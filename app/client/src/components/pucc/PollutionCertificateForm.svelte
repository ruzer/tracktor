<script lang="ts">
	import FormField from '$components/common/FormField.svelte';
	import FormSubmitButton from '$components/common/FormSubmitButton.svelte';
	import { env } from '$env/dynamic/public';
	import { Calendar1, IdCard, Notebook, TestTube, TestTube2 } from '@lucide/svelte';

	let {
		vehicleId,
		entryToEdit = $bindable(),
		modalVisibility = $bindable(),
		editMode,
		loading,
		callback
	} = $props();

	let certificate = $state({
		certificateNumber: '',
		issueDate: '',
		expiryDate: '',
		testingCenter: '',
		notes: ''
	});

	let status = $state<{
		message: string | null;
		type: 'ERROR' | 'SUCCESS' | null;
	}>({
		message: null,
		type: null
	});

	$effect(() => {
		if (entryToEdit) {
			Object.assign(certificate, entryToEdit);
		}
	});

	async function persistCertificate() {
		if (
			!certificate.certificateNumber ||
			!certificate.issueDate ||
			!certificate.expiryDate ||
			!certificate.testingCenter
		) {
			status.message = 'Certificate Number, Issue Date, Expiry Date, Testing Center are required.';
			status.type = 'ERROR';
			return;
		}

		try {
			const response = await fetch(
				`${env.PUBLIC_API_BASE_URL || ''}/api/vehicles/${vehicleId}/pucc/${editMode ? entryToEdit.id : ''}`,
				{
					method: `${editMode ? 'PUT' : 'POST'}`,
					headers: {
						'Content-Type': 'application/json',
						'X-User-PIN': localStorage.getItem('userPin') || ''
					},
					body: JSON.stringify(certificate)
				}
			);

			if (response.ok) {
				status.message = `Pollution Certificate ${editMode ? 'updated' : 'added'} successfully!`;
				status.type = 'SUCCESS';
				Object.assign(certificate, {
					certificateNumber: '',
					issueDate: '',
					expiryDate: '',
					testingCenter: '',
					notes: ''
				});
				modalVisibility = false;
			} else {
				const data = await response.json();
				status.message =
					data.message || `Failed to ${editMode ? 'update' : 'add'} pollution certificate.`;
				status.type = 'ERROR';
			}
		} catch (e) {
			status.message = 'Failed to connect to the server.';
			status.type = 'ERROR';
		}
		loading = false;
		if (status.type === 'SUCCESS') {
			entryToEdit = null;
			callback(true);
		}
	}
</script>

<form
	onsubmit={(e) => {
		persistCertificate();
		e.preventDefault();
	}}
	class="space-y-6"
>
	<FormField
		id="certificate-number"
		type="text"
		placeholder="Certificate Number"
		bind:value={certificate.certificateNumber}
		icon={IdCard}
		required={true}
		ariaLabel="Certificate Number"
	/>
	<FormField
		id="issue-date"
		type="date"
		placeholder="Issue Date"
		bind:value={certificate.issueDate}
		icon={Calendar1}
		required={true}
		ariaLabel="Issue Date"
	/>
	<FormField
		id="expiry-date"
		type="date"
		placeholder="Expiry Date"
		bind:value={certificate.expiryDate}
		icon={Calendar1}
		required={true}
		ariaLabel="Expiry Date"
	/>
	<FormField
		id="testing-center"
		type="text"
		placeholder="Testing Center"
		bind:value={certificate.testingCenter}
		icon={TestTube2}
		required={true}
		ariaLabel="Testing Center"
	/>
	<FormField
		id="notes"
		type="text"
		placeholder="Notes"
		bind:value={certificate.notes}
		icon={Notebook}
		required={false}
		ariaLabel="Notes"
	/>
	<FormSubmitButton text={editMode ? 'Update Certificate' : 'Add Certificate'} {loading} />
</form>

{#if status.message}
	<p
		class={`mt-4 text-center text-sm ${status.type === 'ERROR' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}
	>
		{#if status.type === 'ERROR'}
			<span class="font-semibold">Error:</span> {status.message}
		{:else}
			{status.message}
		{/if}
	</p>
{/if}

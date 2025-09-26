export const maintenanceOrderStatusOptions = [
	{ value: 'pending_review', labelKey: 'maintenance.status.pendingReview' },
	{ value: 'quotation', labelKey: 'maintenance.status.quotation' },
	{ value: 'authorized', labelKey: 'maintenance.status.authorized' },
	{ value: 'rejected', labelKey: 'maintenance.status.rejected' },
	{ value: 'in_workshop', labelKey: 'maintenance.status.inWorkshop' },
	{ value: 'in_repair', labelKey: 'maintenance.status.inRepair' },
	{ value: 'repaired_pending_payment', labelKey: 'maintenance.status.repairedPendingPayment' },
	{ value: 'closed', labelKey: 'maintenance.status.closed' }
] as const;

export const maintenancePaymentStatusOptions = [
	{ value: 'pending', labelKey: 'maintenance.payment.pending' },
	{ value: 'partial', labelKey: 'maintenance.payment.partial' },
	{ value: 'paid', labelKey: 'maintenance.payment.paid' }
] as const;

export const statusColorMap: Record<string, string> = {
	pending_review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
	quotation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
	authorized: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200',
	rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200',
	in_workshop: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200',
	in_repair: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200',
	repaired_pending_payment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200',
	closed: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
};

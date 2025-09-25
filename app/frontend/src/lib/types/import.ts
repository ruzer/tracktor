export type VehicleImportSummary = {
	totalRows: number;
	imported: number;
	skipped: number;
	failed: { row: number; error: string }[];
	warnings: string[];
};

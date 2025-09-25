export const metadata = {
	code: 'en',
	name: 'English',
	nativeName: 'English',
	flag: '🇺🇸',
	rtl: false
};

export default {
	common: {
		save: 'Save',
		cancel: 'Cancel',
		delete: 'Delete',
		edit: 'Edit',
		add: 'Add',
		loading: 'Loading...',
		error: 'Error',
		success: 'Success',
		confirm: 'Confirm',
		close: 'Close',
		toggleDarkMode: 'Toggle dark mode',
		notAvailable: 'Not Available',
		yes: 'Yes',
		no: 'No',
		clear: 'Clear'
	},
	menu: {
		ariaLabel: 'Main navigation',
		vehicles: {
			label: 'Vehicles',
			overview: 'Fleet overview',
			import: 'Import vehicles'
		},
		insurance: {
			label: 'Insurance',
			overview: 'Policies & renewals',
			collective: 'Collective insurance'
		}
	},
	app: {
		title: 'Tracktor',
		validatingAuth: 'Validating Auth...',
		redirecting: 'Redirecting...',
		settings: 'Settings',
		logout: 'Logout',
		demoBanner: {
			message:
				'⚠️ NOTICE: This is a demo instance. Data will be reset periodically and is not saved permanently. Please avoid adding any personal info.',
			defaultPin: 'Default PIN : 123456'
		}
	},
	errors: {
		requiredVehicleId: 'Vehicle ID is required.',
		networkError: 'Failed to connect to the server.',
		fetchFailed: 'Failed to fetch data.',
		fetchFuelLogsFailed: 'Failed to fetch fuel logs.',
		fetchMaintenanceLogsFailed: 'Failed to fetch maintenance logs.',
		fetchInsuranceFailed: 'Failed to fetch insurance data.',
		fetchPollutionFailed: 'Failed to fetch pollution certificates.',
		deleteFailed: 'Failed to delete.',
		deleteFuelLogFailed: 'Failed to delete fuel log.',
		deleteMaintenanceFailed: 'Failed to delete maintenance log.',
		deleteInsuranceFailed: 'Failed to delete insurance details.',
		deletePollutionFailed: 'Failed to delete pollution certificate.'
	},
	login: {
		title: 'Welcome',
		checkingPinStatus: 'Checking PIN status...',
		enterPinPrompt: 'Enter your 6-digit PIN to access Tracktor',
		success: {
			pinVerified: 'PIN Verified Successfully'
		},
		errors: {
			missingPinEnv:
				'No PIN found. Please set `AUTH_PIN` environment variable before starting the app.',
			checkStatusFailed: 'Failed to check PIN status.',
			unknownServerError: 'Unknown server error occurred.',
			connectionFailed: 'Failed to connect to the server. Please check your connection.',
			invalidPin: 'Invalid PIN. Please try again.',
			failedSetPin: 'Failed to set PIN.'
		}
	},
	dashboard: {
		title: 'Your Vehicles',
		addVehicle: 'Add Vehicle',
		importVehicles: 'Import Vehicles',
		loadingVehicles: 'Loading Vehicles...',
		selectVehicle: 'Select a vehicle to view fuel and mileage data',
		noDataAvailable: 'No data available for this vehicle.',
		vehicleTrends: 'Vehicle Trends',
		fuelCostOverTime: 'Fuel Cost Over Time',
		mileageOverTime: 'Mileage Over Time',
		datasets: {
			totalFuelCost: 'Total Fuel Cost ({{currency}})',
			mileage: 'Mileage ({{unit}})'
		}
	},
	vehicle: {
		vehicleLabel: 'Vehicle',
		licensePlate: 'License Plate',
		vin: 'VIN',
		color: 'Color',
		odometer: 'Odometer',
		insurance: 'Insurance',
		pucc: 'PUCC',
		year: 'Year',
		active: 'Active',
		expired: 'Expired',
		inactive: 'Inactive',
		logFuel: 'Log fuel refill',
		deleteSuccess: 'Vehicle deleted successfully.',
		deleteError: 'Failed to delete vehicle.',
		connectionError: 'Failed to connect to the server.',
		emptyState: 'No vehicles found. Add your first vehicle to begin.',
		searchPlaceholder: 'Search by make, plate, area, or driver',
		view: {
			grid: 'Cards',
			list: 'Table'
		},
		import: {
			title: 'Import Vehicles',
			description:
				'Upload a CSV or Excel file with your fleet data. Make sure at least make, model, year, and license plate columns are present.',
			supportedFormats: 'Supported file types',
			formatCsv: 'CSV (.csv)',
			formatExcel: 'Excel (.xlsx, .xls)',
			selectFile: 'Select the file to import',
			downloadTemplate: 'Download template',
			results: 'Import summary',
			total: 'Total rows',
			successful: 'Imported',
			skipped: 'Skipped',
			warnings: 'Warnings',
			failed: 'Failed rows',
			failedRow: 'Row {{row}}: {{error}}',
			error: 'We could not finish the import. Please check the file and try again.',
			start: 'Start import',
			backToVehicles: 'Back to vehicles',
			pageTitle: 'Bulk import of vehicles',
			pageDescription: 'Follow these steps to onboard complete fleets in minutes.',
			instructionsTitle: 'Upload your fleet file',
			instructionsDescription:
				'Review the template, keep consistent headers and validate required fields before uploading your spreadsheet.'
		},
		assignment: {
			currentTitle: 'Current assignment',
			unknownDriver: 'Unassigned driver',
			area: 'Area',
			unit: 'Unit',
			since: 'Since',
			until: 'Until',
			notes: 'Notes',
			noCurrent: 'This vehicle does not have an active assignment.',
			showHistory: 'Show history',
			hideHistory: 'Hide history',
			noRecords: 'No assignments recorded yet.'
		}
	},
	insurance: {
		overview: {
			title: 'Insurance workspace',
			subtitle: 'Centralize policy management and renewal tracking for your fleet.',
			cards: {
				policies: {
					title: 'Individual policies',
					body: 'Review coverage, premiums and expiry dates for every vehicle policy in one place.'
				},
				compliance: {
					title: 'Compliance status',
					body: 'Monitor mandatory documents, renewal windows and assignment of responsible teammates.'
				},
				collective: {
					title: 'Collective programmes',
					body: 'Outline coverage strategies for teams or regions and keep stakeholders informed.'
				},
				integrations: {
					title: 'Integrations & workflows',
					body: 'Connect Tracktor with insurers, ERPs and alerts to keep everyone aligned.'
				}
			}
		},
		collective: {
			title: 'Collective insurance programmes',
			subtitle: 'Design coverage frameworks for driver groups, departments and recurring routes.',
			cards: {
				pooling: {
					title: 'Group pooling',
					body: 'Bundle vehicles and drivers to negotiate better premiums and balance deductibles.'
				},
				coverage: {
					title: 'Configurable coverage',
					body: 'Define insured assets, coverage limits and eligibility rules for each collective plan.'
				},
				process: {
					title: 'Claims & onboarding',
					body: 'Establish documentation checklists, responsible owners and approval workflows.'
				},
				next: {
					title: 'What’s next',
					body: 'Upcoming releases will include bulk actions, analytics and insurer integrations.'
				}
			}
		}
	},
	modals: {
		configurations: 'Configurations',
		addVehicle: 'Add Vehicle',
		editVehicle: 'Edit Vehicle',
		addInsurance: 'Add Insurance',
		editInsurance: 'Edit Insurance',
		addMaintenance: 'Add Maintenance Log',
		editMaintenance: 'Edit Maintenance Log',
		addFuelLog: 'Log Fuel Refill',
		editFuelLog: 'Edit Fuel Log',
		addPollution: 'Add Pollution Certificate',
		editPollution: 'Edit Pollution Certificate',
		pollutionDetails: 'Pollution Certificate Details',
		noMaintenanceLogs: 'No maintenance logs for this vehicle.',
		noPollutionCertificates: 'No pollution certificates for this vehicle.',
		noFuelLogs: 'No fuel refill logs found for this vehicle.',
		noInsuranceLogs: 'No Insurance found for this vehicle.'
	},
	deleteConfirmation: {
		title: 'Delete',
		message: 'Are you sure you want to delete?'
	},
	navigation: {
		dashboard: 'Dashboard',
		fuelLogs: 'Fuel Logs',
		maintenance: 'Maintenance',
		insurance: 'Insurance',
		pollution: 'Pollution Certificate',
		plates: 'Plate History',
		assignments: 'Assignments',
		taxes: 'Taxes'
	},
	forms: {
		labels: {
			date: 'Date',
			odometer: 'Odometer',
			fuelAmount: 'Fuel Amount',
			cost: 'Cost',
			notes: 'Notes',
			filled: 'Tank Filled?',
			missedLast: 'Missed Last?',
			startDate: 'Start Date',
			endDate: 'End Date',
			testingCenter: 'Testing Center',
			expiryDate: 'Expiry Date',
			serviceCenter: 'Service Center',
			certificateNumber: 'Certificate Number',
			issueDate: 'Issue Date',
			provider: 'Provider',
			policyNumber: 'Policy Number',
			make: 'Make',
			model: 'Model',
			year: 'Year',
			color: 'Color',
			licensePlate: 'License Plate',
			vinNumber: 'VIN Number',
			plate: 'Plate',
			retireDate: 'Retired Date',
			reason: 'Reason',
			current: 'Current',
			retire: 'Retire',
			assigneeName: 'Assignee Name',
			assigneeRole: 'Assignee Role',
			area: 'Area',
			unit: 'Unit',
			close: 'Close',
			taxType: 'Tax Type',
			amount: 'Amount',
			paid: 'Paid',
			paidDate: 'Paid Date',
			receiptFolio: 'Receipt Folio',
			markPaid: 'Mark Paid'
		},
		help: {
			filled:
				'Mark if this refill filled the tank to full. Mileage is computed only between two full-tank logs, summing any partial refills in between.',
			missedLast:
				'Mark if you missed logging the previous refill. This blocks using earlier logs for mileage until the next full-tank entry.'
		},
		placeholders: {
			date: 'Date',
			odometerReading: 'Odometer Reading',
			fuelAmountLitres: 'Fuel Amount',
			costCurrency: 'Total Cost',
			totalCost: 'Total Cost of Refill',
			notes: 'Notes',
			startDate: 'Start Date',
			endDate: 'End Date',
			testingCenter: 'Testing Center',
			expiryDate: 'Expiry Date',
			serviceCenter: 'Service Center',
			certificateNumber: 'Certificate Number',
			issueDate: 'Issue Date',
			provider: 'Provider',
			policyNumber: 'Policy Number',
			make: 'Make',
			model: 'Model',
			year: 'Year',
			color: 'Color',
			licensePlate: 'License Plate',
			vinNumber: 'VIN Number'
		},
		buttons: {
			add: 'Add',
			update: 'Update'
		},

		validation: {
			noVehicleSelected: 'No vehicle selected.',
			requiredFields: 'Date, Odometer, Fuel Amount, and Cost are required.',
			maintenanceRequired: 'Date, Odometer, Service Center, and Cost are required.',
			insuranceRequired: 'Start Date, End Date, and Cost are required.',
			pollutionRequired: 'Issue Date, Expiry Date, and Testing Center are required.',
			vehicleRequired: 'Make, Model, Year, and License Plate are required.'
		},
		success: {
			fuelLogAdded: 'Fuel refill log added successfully!',
			fuelLogUpdated: 'Fuel refill log updated successfully!',
			maintenanceAdded: 'Maintenance log added successfully!',
			maintenanceUpdated: 'Maintenance log updated successfully!',
			insuranceAdded: 'Insurance added successfully!',
			insuranceUpdated: 'Insurance updated successfully!',
			pollutionAdded: 'Pollution certificate added successfully!',
			pollutionUpdated: 'Pollution certificate updated successfully!',
			vehicleAdded: 'Vehicle added successfully!',
			vehicleUpdated: 'Vehicle updated successfully!'
		},
		errors: {
			connectionFailed: 'Failed to connect to the server.'
		}
	},
	config: {
		language: {
			title: 'Language',
			select: 'Select Language',
			description: 'Choose your preferred language for the interface'
		},
		regional: {
			title: 'Regional Settings',
			dateFormat: 'Date Format',
			currency: 'Currency',
			units: 'Units of Measure'
		},
		dateFormats: {
			ddmmyyyy: 'DD/MM/YYYY',
			mmddyyyy: 'MM/DD/YYYY',
			yyyymmdd: 'YYYY-MM-DD',
			ddmmmyyyy: 'DD MMM, YYYY'
		},
		currencies: {
			inr: 'Indian Rupee (₹)',
			usd: 'US Dollar ($)',
			eur: 'Euro (€)',
			gbp: 'British Pound (£)',
			mxn: 'Mexican Peso ($)',
			ars: 'Argentine Peso ($)',
			cop: 'Colombian Peso ($)',
			clp: 'Chilean Peso ($)',
			pen: 'Peruvian Sol (S/)',
			brl: 'Brazilian Real (R$)'
		},
		units: {
			metric: 'Metric (km, L)',
			imperial: 'Imperial (mi, gal)'
		},
		fields: {
			dateFormat: 'Date Format',
			currency: 'Currency',
			unitOfMeasure: 'Unit of Measure'
		},
		descriptions: {
			dateFormat: 'Select how dates should be displayed throughout the application',
			currency: 'Choose your preferred currency for financial calculations',
			unitOfMeasure: 'Select between metric or imperial units for measurements'
		},
		placeholders: {
			dateFormat: 'Select date format...',
			currency: 'Select currency...',
			unitOfMeasure: 'Select units...'
		}
	},
	colorPicker: {
		selectedColor: 'Selected Color',
		commonColors: 'Common Colors',
		showAdvanced: 'Show Advanced Options',
		hideAdvanced: 'Hide Advanced Options',
		hue: 'Hue',
		saturation: 'Saturation',
		lightness: 'Lightness',
		hexCode: 'Hex Code'
	},
	table: {
		headers: {
			date: 'Date',
			odometer: 'Odometer',
			fuelAmount: 'Fuel Amount',
			cost: 'Cost',
			totalCost: 'Total Cost',
			mileage: 'Mileage',
			notes: 'Notes',
			actions: 'Actions'
		}
	}
};

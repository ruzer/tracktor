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
		select: 'Select',
		search: 'Search',
		loading: 'Loading...',
		days: 'days',
		error: 'Error',
		success: 'Success',
		confirm: 'Confirm',
		close: 'Close',
		toggleDarkMode: 'Toggle dark mode',
		notAvailable: 'Not Available',
		yes: 'Yes',
		no: 'No',
		clear: 'Clear',
		viewAll: 'View all'
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
			policies: 'Policies',
			renewals: 'Renewals',
			reports: 'Reports'
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
		fetchInsurancePoliciesFailed: 'Failed to fetch insurance policies.',
		fetchInsuranceRepresentativesFailed: 'Failed to fetch insurance representatives.',
		fetchInsuranceRenewalsFailed: 'Failed to fetch insurance renewals.',
		fetchVehicleInsuranceFailed: 'Failed to fetch vehicle insurance assignments.',
		fetchPollutionFailed: 'Failed to fetch pollution certificates.',
		deleteFailed: 'Failed to delete.',
		deleteFuelLogFailed: 'Failed to delete fuel log.',
		deleteMaintenanceFailed: 'Failed to delete maintenance log.',
		deleteInsuranceFailed: 'Failed to delete insurance details.',
		deleteInsurancePolicyFailed: 'Failed to delete insurance policy.',
		deleteRepresentativeFailed: 'Failed to delete insurance representative.',
		deleteVehicleInsuranceFailed: 'Failed to remove vehicle insurance assignment.',
		deletePollutionFailed: 'Failed to delete pollution certificate.',
		saveInsurancePolicyFailed: 'Failed to save insurance policy.',
		saveRepresentativeFailed: 'Failed to save insurance representative.',
		renewPolicyFailed: 'Failed to renew insurance policy.',
		assignVehicleInsuranceFailed: 'Failed to assign vehicle insurance.',
		unassignVehicleInsuranceFailed: 'Failed to unassign vehicle insurance.'
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
		viewDetails: 'View details',
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
		},
		detail: {
			generalTab: 'General',
			documentsTab: 'Documents',
			backToDashboard: 'Back to dashboard',
			refresh: 'Refresh data',
			generalInfo: 'General information',
			assignment: 'Assignment overview',
			insuranceSummary: 'Insurance summary',
			fuelSummary: 'Fuel summary',
			maintenanceSummary: 'Maintenance summary',
			createdAt: 'Created at',
			updatedAt: 'Last update',
			statusLabel: 'Status',
			statusUnknown: 'Unknown',
			noPolicies: 'No insurance policies assigned yet.',
			policyAssignments: 'Policy assignments:',
			legacyPolicies: 'Legacy policies:',
			totalFuelLogs: '{{count}} fuel logs recorded',
			noFuelLogs: 'No fuel logs recorded yet.',
			lastFuel: 'Latest fuel entry',
			maintenanceLogs: 'Maintenance logs',
			lastMaintenance: 'Latest maintenance logs',
			noMaintenanceLogs: 'No maintenance logs recorded yet.',
			workOrders: 'Work orders',
			workOrderTitle: 'Title',
			workOrderStatus: {
				pending: 'Pending',
				in_progress: 'In progress',
				completed: 'Completed'
			},
			noWorkOrders: 'No maintenance work orders yet.',
			totalWorkOrders: 'Total orders',
			openOrders: 'Open orders',
			inProgress: 'In progress',
			completed: 'Completed',
			documents: 'Documents',
			documentType: 'Document type',
			noDocuments: 'No documents uploaded yet.',
			pollutionCertificates: 'Pollution certificates',
			pollutionStatus: {
				active: 'Active',
				expired: 'Expired'
			},
			noPollution: 'No pollution certificates recorded.'
		}
	},
	maintenance: {
		titles: {
			orders: 'Maintenance orders',
			newOrder: 'Register maintenance order',
			editOrder: 'Edit maintenance order',
			updateOrder: 'Update maintenance status',
			recentOrders: 'Recent orders'
		},
		views: {
			summary: 'Summary',
			orders: 'Orders',
			logs: 'Logs'
		},
		labels: {
			reportedIssue: 'Reported issue',
			createdBy: 'Reported by',
			status: 'Status',
			workshopInfo: 'Workshop information',
			workshopName: 'Workshop name',
			workshopContact: 'Contact person',
			workshopPhone: 'Contact phone',
			workshopEmail: 'Contact email',
			workshopAddress: 'Address',
			notes: 'Notes',
			paymentStatus: 'Payment status',
			authorizedBy: 'Authorized by',
			authorizedAt: 'Authorization date',
			totalEstimated: 'Estimated total',
			totalFinal: 'Final total',
			quoteFile: 'Quotation (URL)',
			invoiceFile: 'Invoice (URL)',
			userId: 'Updated by',
			history: 'History'
		},
		placeholders: {
			reportedIssue: 'Describe what was reported by the driver or area',
			createdBy: 'Operator or area reporting',
			workshopName: 'Workshop name',
			workshopContact: 'Contact person at the workshop',
			workshopPhone: 'Phone number',
			workshopEmail: 'Email address',
			workshopAddress: 'Full address',
			notes: 'Add notes for the order history',
			authorizedBy: 'Person who authorized the repair',
			fileUrl: 'https://example.com/document.pdf',
			userId: 'User responsible for the update'
		},
		buttons: {
			newOrder: 'Register order',
			createOrder: 'Create order',
			updateOrder: 'Update order',
			editOrder: 'Edit details',
			updateStatus: 'Update status',
			saveChanges: 'Save changes'
		},
		messages: {
			noOrders: 'No maintenance orders recorded yet.',
			orderCreated: 'Maintenance order created successfully!',
			orderUpdated: 'Maintenance order updated successfully!'
		},
		errors: {
			vehicleRequired: 'Vehicle id is required to process this order.',
			requiredFields: 'Reported issue and reporter are required fields.',
			saveFailed: 'We could not save the maintenance order.',
			updateFailed: 'We could not update the maintenance order.'
		},
		status: {
			pendingReview: 'Pending review',
			quotation: 'Quotation in progress',
			authorized: 'Authorized',
			rejected: 'Rejected',
			inWorkshop: 'Vehicle at workshop',
			inRepair: 'In repair',
			repairedPendingPayment: 'Repaired · pending payment',
			closed: 'Closed'
		},
		payment: {
			pending: 'Payment pending',
			partial: 'Partially paid',
			paid: 'Paid'
		},
		links: {
			view: 'View'
		},
		integration: {
			titles: {
				integratedLog: 'Integrated maintenance log',
				closeOrderIntegrated: 'Close order with integration'
			},
			labels: {
				autoGenerateOrder: 'Auto-generate order',
				autoGenerateLog: 'Auto-generate log',
				finalOdometer: 'Final odometer',
				completionNotes: 'Completion notes'
			},
			placeholders: {
				finalOdometer: 'Final odometer reading',
				completionNotes: 'Notes about work completion'
			},
			buttons: {
				createIntegratedLog: 'Create integrated log',
				closeIntegratedOrder: 'Close integrated order'
			},
			messages: {
				integratedLogCreated: 'Maintenance log created successfully.',
				orderGeneratedAutomatically: 'A maintenance order was automatically generated.',
				orderClosedSuccessfully: 'Order closed successfully.',
				logGeneratedAutomatically: 'A maintenance log was automatically generated.'
			},
			help: {
				autoGenerateOrder: 'When enabled, this will automatically create a maintenance order based on this log.',
				autoGenerateLog: 'When enabled, this will automatically create a maintenance log when closing the order.'
			}
		}
	},
	insurance: {
		policies: {
			title: 'Policies workspace',
			subtitle: 'Create, assign and track individual or collective insurance programmes.',
			empty: 'No policies registered yet. Start by creating one to link vehicles and keep expirations under control.',
			new: 'New policy',
			edit: 'Edit policy',
			filters: {
				status: 'Status',
				type: 'Type',
				search: 'Search by insurer or policy number'
			},
			types: {
				individual: 'Individual',
				collective: 'Collective'
			},
			actions: {
				view: 'View policy',
				edit: 'Edit policy',
				renew: 'Renew'
			}
		},
		renewals: {
			title: 'Upcoming renewals',
			subtitle: 'Keep expirations under control and renew policies in a single place.',
			empty: 'No policies require renewal in the selected window.'
		},
		reports: {
			title: 'Insurance reports',
			subtitle: 'Detect coverage gaps, expired policies and vehicles without assignments.',
			export: 'Export CSV',
			sections: {
				vehiclesWithout: 'Vehicles without policy',
				vehiclesExpired: 'Vehicles with expired policy',
				upcoming: 'Upcoming expirations',
				expired: 'Expired policies'
			}
		},
		forms: {
			headers: {
				details: 'Policy details',
				vehicles: 'Covered vehicles',
				renewals: 'Renewal history',
				representatives: 'Insurance representatives'
			},
			fields: {
				insurer: 'Insurer',
				policyNumber: 'Policy number',
				type: 'Policy type',
				coverageType: 'Coverage type',
				startDate: 'Start date',
				endDate: 'End date',
				notes: 'Notes',
				representative: 'Representative',
				representativeName: 'Representative name',
				representativePhone: 'Phone',
				representativeEmail: 'Email',
				premiumAmount: 'Premium amount',
				company: 'Company',
				assignedAt: 'Assigned date',
				unassignedAt: 'Unassigned date',
				isCurrent: 'Current assignment',
				previousEndDate: 'Previous end date',
				newStartDate: 'New start date',
				newEndDate: 'New end date',
				premiumChange: 'Premium change'
			},
			validation: {
				required: 'Please fill in all required fields.',
				vehicleRequired: 'Select at least one vehicle to assign the policy.',
				representativeRequired: 'Representative name is required.',
				renewalDatesRequired: 'Start and end dates are required for renewal.',
				dateOrderRequired: 'End date must be after start date.'
			},
			vehicles: {
				add: 'Add vehicles',
				manage: 'Manage vehicles',
				assign: 'Assign to vehicle',
				unassign: 'Unassign from vehicle',
				currentAssignments: 'Current assignments',
				assignmentHistory: 'Assignment history'
			},
			representatives: {
				add: 'Add representative',
				edit: 'Edit representative',
				delete: 'Delete representative',
				manage: 'Manage representatives',
				empty: 'No representatives registered yet.',
				contact: 'Contact information'
			},
			submit: {
				save: 'Save policy',
				update: 'Update policy',
				saveRepresentative: 'Save representative',
				updateRepresentative: 'Update representative'
			},
			renew: {
				title: 'Renew policy',
				startLabel: 'New start date',
				endLabel: 'New end date',
				notesLabel: 'Notes (optional)',
				extendVehicles: 'Apply new dates to current vehicle assignments',
				empty: 'No renewals recorded yet.',
				history: 'Renewal history',
				premiumChangeLabel: 'Premium change amount',
				createRenewal: 'Create renewal record'
			}
		},
		vehicleInsurance: {
			title: 'Vehicle insurance assignments',
			subtitle: 'Manage individual vehicle coverage and track assignment history.',
			currentCoverage: 'Current coverage',
			assignmentHistory: 'Assignment history',
			noCoverage: 'This vehicle has no active insurance coverage.',
			noHistory: 'No assignment history available.',
			assign: 'Assign insurance',
			unassign: 'Remove coverage',
			reassign: 'Change coverage'
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
			engineNumber: 'Engine Number',
			tankSizeLiters: 'Tank Capacity',
			vehicleStatus: 'Status',
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
			vinNumber: 'VIN Number',
			engineNumber: 'Engine Number',
			tankSizeLiters: 'Tank size'
		},
		options: {
			vehicleStatus: {
				active: 'Active',
				inRepair: 'In repair',
				retired: 'Retired'
			}
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
			insurancePolicyAdded: 'Insurance policy added successfully!',
			insurancePolicyUpdated: 'Insurance policy updated successfully!',
			insurancePolicyRenewed: 'Insurance policy renewed successfully!',
			representativeAdded: 'Insurance representative added successfully!',
			representativeUpdated: 'Insurance representative updated successfully!',
			representativeDeleted: 'Insurance representative deleted successfully!',
			vehicleInsuranceAssigned: 'Vehicle insurance assigned successfully!',
			vehicleInsuranceUnassigned: 'Vehicle insurance unassigned successfully!',
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

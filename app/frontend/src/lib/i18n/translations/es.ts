export const metadata = {
	code: 'es',
	name: 'Español',
	nativeName: 'Español',
	flag: '🇪🇸',
	rtl: false
};

export default {
	common: {
		save: 'Guardar',
		cancel: 'Cancelar',
		delete: 'Eliminar',
		edit: 'Editar',
		add: 'Agregar',
		select: 'Seleccionar',
		search: 'Buscar',
		loading: 'Cargando...',
		days: 'días',
		error: 'Error',
		success: 'Éxito',
		confirm: 'Confirmar',
		close: 'Cerrar',
		toggleDarkMode: 'Cambiar modo oscuro',
		notAvailable: 'No Disponible',
		yes: 'Sí',
		no: 'No',
		clear: 'Limpiar'
	},
	menu: {
		ariaLabel: 'Navegación principal',
		vehicles: {
			label: 'Vehículos',
			overview: 'Resumen de la flota',
			import: 'Importar vehículos'
		},
		insurance: {
			label: 'Seguros',
			policies: 'Pólizas',
			renewals: 'Renovaciones',
			reports: 'Reportes'
		}
	},
	app: {
		title: 'Tracktor',
		validatingAuth: 'Validando Autenticación...',
		redirecting: 'Redirigiendo...',
		settings: 'Configuraciones',
		logout: 'Cerrar Sesión',
		demoBanner: {
			message:
				'⚠️ AVISO: Esta es una instancia de demostración. Los datos se restablecen periódicamente y no se guardan permanentemente. Por favor, evita ingresar información personal.',
			defaultPin: 'PIN por defecto: 123456'
		}
	},
	errors: {
		requiredVehicleId: 'Se requiere el ID del vehículo.',
		networkError: 'Error al conectar con el servidor.',
		fetchFailed: 'Error al obtener datos.',
		fetchFuelLogsFailed: 'Error al obtener registros de combustible.',
		fetchMaintenanceLogsFailed: 'Error al obtener registros de mantenimiento.',
		fetchInsuranceFailed: 'Error al obtener datos del seguro.',
		fetchPollutionFailed: 'Error al obtener certificados de contaminación.',
		deleteFailed: 'Error al eliminar.',
		deleteFuelLogFailed: 'Error al eliminar el registro de combustible.',
		deleteMaintenanceFailed: 'Error al eliminar el registro de mantenimiento.',
		deleteInsuranceFailed: 'Error al eliminar los datos del seguro.',
		deletePollutionFailed: 'Error al eliminar el certificado de contaminación.'
	},
	login: {
		title: 'Bienvenido',
		checkingPinStatus: 'Verificando estado del PIN...',
		enterPinPrompt: 'Ingresa tu PIN de 6 dígitos para acceder a Tracktor',
		success: {
			pinVerified: 'PIN verificado correctamente'
		},
		errors: {
			missingPinEnv:
				'No se encontró PIN. Configura la variable de entorno `AUTH_PIN` antes de iniciar la app.',
			checkStatusFailed: 'No se pudo verificar el estado del PIN.',
			unknownServerError: 'Ocurrió un error de servidor desconocido.',
			connectionFailed: 'No se pudo conectar al servidor. Verifica tu conexión.',
			invalidPin: 'PIN inválido. Intenta de nuevo.',
			failedSetPin: 'No se pudo establecer el PIN.'
		}
	},
	dashboard: {
		title: 'Tus Vehículos',
		addVehicle: 'Agregar Vehículo',
		importVehicles: 'Importar Vehículos',
		loadingVehicles: 'Cargando Vehículos...',
		selectVehicle: 'Selecciona un vehículo para ver datos de combustible y kilometraje',
		noDataAvailable: 'No hay datos disponibles para este vehículo.',
		vehicleTrends: 'Tendencias del Vehículo',
		fuelCostOverTime: 'Costo de Combustible en el Tiempo',
		mileageOverTime: 'Kilometraje en el Tiempo',
		datasets: {
			totalFuelCost: 'Costo total de combustible ({{currency}})',
			mileage: 'Kilometraje ({{unit}})'
		}
	},
	vehicle: {
		vehicleLabel: 'Vehículo',
		licensePlate: 'Placa',
		vin: 'VIN',
		color: 'Color',
		odometer: 'Odómetro',
		insurance: 'Seguro',
		pucc: 'PUCC',
		year: 'Año',
		active: 'Activo',
		expired: 'Vencido',
		inactive: 'Inactivo',
		logFuel: 'Registrar recarga de combustible',
		deleteSuccess: 'Vehículo eliminado exitosamente.',
		deleteError: 'Error al eliminar el vehículo.',
		connectionError: 'Error al conectar con el servidor.',
		emptyState: 'No se encontraron vehículos. Agrega tu primer vehículo para comenzar.',
		searchPlaceholder: 'Busca por marca, placa, área o conductor',
		view: {
			grid: 'Tarjetas',
			list: 'Tabla'
		},
		import: {
			title: 'Importar Vehículos',
			description:
				'Sube un archivo CSV o Excel con la información de tu flota. Asegúrate de incluir como mínimo marca, modelo, año y placa.',
			supportedFormats: 'Formatos admitidos',
			formatCsv: 'CSV (.csv)',
			formatExcel: 'Excel (.xlsx, .xls)',
			selectFile: 'Selecciona el archivo a importar',
			downloadTemplate: 'Descargar plantilla',
			results: 'Resumen de importación',
			total: 'Filas totales',
			successful: 'Importadas',
			skipped: 'Omitidas',
			warnings: 'Advertencias',
			failed: 'Filas con error',
			failedRow: 'Fila {{row}}: {{error}}',
			error: 'No se pudo completar la importación. Revisa el archivo e inténtalo nuevamente.',
			start: 'Iniciar importación',
			backToVehicles: 'Volver a vehículos',
			pageTitle: 'Importación masiva de vehículos',
			pageDescription:
				'Carga grandes volúmenes de unidades desde una hoja de cálculo en cuestión de minutos.',
			instructionsTitle: 'Carga tu archivo de flota',
			instructionsDescription:
				'Descarga la plantilla, revisa los encabezados obligatorios y valida los datos antes de subirlos a Tracktor.'
		},
		assignment: {
			currentTitle: 'Resguardo actual',
			unknownDriver: 'Conductor sin asignar',
			area: 'Área',
			unit: 'Unidad',
			since: 'Desde',
			until: 'Hasta',
			notes: 'Notas',
			noCurrent: 'Actualmente este vehículo no tiene un resguardo activo.',
			showHistory: 'Mostrar historial',
			hideHistory: 'Ocultar historial',
			noRecords: 'Todavía no hay registros de resguardo.'
		}
	},
	insurance: {
		policies: {
			title: 'Centro de pólizas',
			subtitle: 'Administra pólizas individuales o colectivas, asigna vehículos y controla las vigencias.',
			empty: 'Aún no tienes pólizas registradas. Crea una para asignarla a los vehículos de tu flota.',
			new: 'Nueva póliza',
			edit: 'Editar póliza',
			filters: {
				status: 'Estado',
				type: 'Tipo',
				search: 'Buscar por aseguradora o número de póliza'
			},
			types: {
				individual: 'Individual',
				collective: 'Colectiva'
			},
			actions: {
				view: 'Ver póliza',
				edit: 'Editar',
				renew: 'Renovar'
			}
		},
		renewals: {
			title: 'Renovaciones próximas',
			subtitle: 'Mantén el control de tus pólizas antes de que expiren.',
			empty: 'No hay pólizas por renovar en el periodo seleccionado.'
		},
		reports: {
			title: 'Reportes de seguro',
			subtitle: 'Identifica vehículos sin póliza, pólizas vencidas y próximas a vencer.',
			export: 'Exportar CSV',
			sections: {
				vehiclesWithout: 'Vehículos sin póliza',
				vehiclesExpired: 'Vehículos con póliza vencida',
				upcoming: 'Próximas a vencer',
				expired: 'Pólizas vencidas'
			}
		},
		forms: {
			headers: {
				details: 'Detalles de la póliza',
				vehicles: 'Vehículos asegurados',
				renewals: 'Historial de renovaciones'
			},
			fields: {
				insurer: 'Aseguradora',
				policyNumber: 'Número de póliza',
				type: 'Tipo de póliza',
				coverageType: 'Tipo de cobertura',
				startDate: 'Fecha de inicio',
				endDate: 'Fecha de término',
				notes: 'Notas',
				representative: 'Representante',
				representativeName: 'Nombre del representante',
				representativePhone: 'Teléfono',
				representativeEmail: 'Correo',
				premiumAmount: 'Prima asignada'
			},
			validation: {
				required: 'Completa los campos obligatorios.',
				vehicleRequired: 'Selecciona al menos un vehículo para asignar la póliza.'
			},
			vehicles: {
				add: 'Agregar vehículos',
				manage: 'Gestionar vehículos'
			},
			submit: {
				save: 'Guardar póliza',
				update: 'Actualizar póliza'
			},
			renew: {
				title: 'Renovar póliza',
				startLabel: 'Nueva fecha de inicio',
				endLabel: 'Nueva fecha de término',
				notesLabel: 'Notas (opcional)',
				extendVehicles: 'Aplicar nuevas fechas a los vehículos asignados',
				empty: 'Aún no hay renovaciones registradas.'
			}
		}
	},
	modals: {
		configurations: 'Configuraciones',
		addVehicle: 'Agregar Vehículo',
		editVehicle: 'Editar Vehículo',
		addInsurance: 'Agregar Seguro',
		editInsurance: 'Editar Seguro',
		addMaintenance: 'Agregar Registro de Mantenimiento',
		editMaintenance: 'Editar Registro de Mantenimiento',
		addFuelLog: 'Registrar Recarga de Combustible',
		editFuelLog: 'Editar Registro de Combustible',
		addPollution: 'Agregar Certificado de Contaminación',
		editPollution: 'Editar Certificado de Contaminación',
		pollutionDetails: 'Detalles del Certificado de Contaminación',
		noMaintenanceLogs: 'No hay registros de mantenimiento para este vehículo.',
		noPollutionCertificates: 'No hay certificados de contaminación para este vehículo.',
		noFuelLogs: 'No se encontraron registros de combustible para este vehículo.',
		noInsuranceLogs: 'No se encontraron registros de seguro para este vehículo.'
	},
	deleteConfirmation: {
		title: 'Eliminar',
		message: '¿Estás seguro de que quieres eliminar?'
	},
	navigation: {
		dashboard: 'Panel de Control',
		fuelLogs: 'Registros de Combustible',
		maintenance: 'Mantenimiento',
		insurance: 'Seguro',
		pollution: 'Certificado de Contaminación',
		plates: 'Historial de Placas',
		assignments: 'Resguardo',
		taxes: 'Impuestos'
	},
	forms: {
		labels: {
			date: 'Fecha',
			odometer: 'Odómetro',
			fuelAmount: 'Cantidad de Combustible',
			cost: 'Costo',
			notes: 'Notas',
			filled: '¿Tanque lleno?',
			missedLast: '¿Se omitió la última?',
			startDate: 'Fecha de Inicio',
			endDate: 'Fecha de Fin',
			testingCenter: 'Centro de Pruebas',
			expiryDate: 'Fecha de Vencimiento',
			serviceCenter: 'Centro de Servicio',
			certificateNumber: 'Número de Certificado',
			issueDate: 'Fecha de Emisión',
			provider: 'Proveedor',
			policyNumber: 'Número de Póliza',
			make: 'Marca',
			model: 'Modelo',
			year: 'Año',
			color: 'Color',
			licensePlate: 'Placa',
			vinNumber: 'Número VIN',
			plate: 'Placa',
			retireDate: 'Fecha de Baja',
			reason: 'Motivo',
			current: 'Actual',
			retire: 'Dar de baja',
			assigneeName: 'Asignado a',
			assigneeRole: 'Cargo',
			area: 'Área',
			unit: 'Unidad',
			close: 'Cerrar',
			taxType: 'Tipo de Impuesto',
			amount: 'Monto',
			paid: 'Pagado',
			paidDate: 'Fecha de Pago',
			receiptFolio: 'Folio de Recibo',
			markPaid: 'Marcar Pagado'
		},
		help: {
			filled:
				'Marca si esta recarga fue con tanque lleno. El rendimiento se calcula solo entre dos registros de tanque lleno, sumando las recargas parciales intermedias.',
			missedLast:
				'Marca si olvidaste registrar la recarga anterior. Esto impide usar registros anteriores para el cálculo de rendimiento hasta el siguiente tanque lleno.'
		},
		placeholders: {
			date: 'Fecha',
			odometerReading: 'Lectura del Odómetro',
			fuelAmountLitres: 'Cantidad de Combustible',
			costCurrency: 'Costo',
			totalCost: 'Costo Total de la Recarga',
			notes: 'Notas',
			startDate: 'Fecha de Inicio',
			endDate: 'Fecha de Fin',
			testingCenter: 'Centro de Pruebas',
			expiryDate: 'Fecha de Vencimiento',
			serviceCenter: 'Centro de Servicio',
			certificateNumber: 'Número de Certificado',
			issueDate: 'Fecha de Emisión',
			provider: 'Proveedor',
			policyNumber: 'Número de Póliza',
			make: 'Marca',
			model: 'Modelo',
			year: 'Año',
			color: 'Color',
			licensePlate: 'Placa',
			vinNumber: 'Número VIN'
		},
		buttons: {
			add: 'Agregar',
			update: 'Actualizar'
		},
		validation: {
			noVehicleSelected: 'No se ha seleccionado ningún vehículo.',
			requiredFields: 'Fecha, Odómetro, Cantidad de Combustible y Costo son requeridos.',
			maintenanceRequired: 'Fecha, Odómetro, Centro de Servicio y Costo son requeridos.',
			insuranceRequired: 'Fecha de Inicio, Fecha de Fin y Costo son requeridos.',
			pollutionRequired:
				'Fecha de Emisión, Fecha de Vencimiento y Centro de Pruebas son requeridos.',
			vehicleRequired: 'Marca, Modelo, Año y Placa son requeridos.'
		},
		success: {
			fuelLogAdded: '¡Registro de combustible agregado exitosamente!',
			fuelLogUpdated: '¡Registro de combustible actualizado exitosamente!',
			maintenanceAdded: '¡Registro de mantenimiento agregado exitosamente!',
			maintenanceUpdated: '¡Registro de mantenimiento actualizado exitosamente!',
			insuranceAdded: '¡Seguro agregado exitosamente!',
			insuranceUpdated: '¡Seguro actualizado exitosamente!',
			pollutionAdded: '¡Certificado de contaminación agregado exitosamente!',
			pollutionUpdated: '¡Certificado de contaminación actualizado exitosamente!',
			vehicleAdded: '¡Vehículo agregado exitosamente!',
			vehicleUpdated: '¡Vehículo actualizado exitosamente!'
		},
		errors: {
			connectionFailed: 'Error al conectar con el servidor.'
		}
	},
	config: {
		language: {
			title: 'Idioma',
			select: 'Seleccionar Idioma',
			description: 'Elige tu idioma preferido para la interfaz'
		},
		regional: {
			title: 'Configuración Regional',
			dateFormat: 'Formato de Fecha',
			currency: 'Moneda',
			units: 'Unidades de Medida'
		},
		dateFormats: {
			ddmmyyyy: 'DD/MM/AAAA',
			mmddyyyy: 'MM/DD/AAAA',
			yyyymmdd: 'AAAA-MM-DD',
			ddmmmyyyy: 'DD MMM, AAAA'
		},
		currencies: {
			inr: 'Rupia India (₹)',
			usd: 'Dólar Estadounidense ($)',
			eur: 'Euro (€)',
			gbp: 'Libra Esterlina (£)',
			mxn: 'Peso Mexicano ($)',
			ars: 'Peso Argentino ($)',
			cop: 'Peso Colombiano ($)',
			clp: 'Peso Chileno ($)',
			pen: 'Sol Peruano (S/)',
			brl: 'Real Brasileño (R$)'
		},
		units: {
			metric: 'Métrico (km, L)',
			imperial: 'Imperial (mi, gal)'
		},
		fields: {
			dateFormat: 'Formato de Fecha',
			currency: 'Moneda',
			unitOfMeasure: 'Unidad de Medida'
		},
		descriptions: {
			dateFormat: 'Selecciona cómo se mostrarán las fechas en la aplicación',
			currency: 'Elige tu moneda preferida para los cálculos financieros',
			unitOfMeasure: 'Selecciona entre unidades métricas o imperiales para las mediciones'
		},
		placeholders: {
			dateFormat: 'Seleccionar formato de fecha...',
			currency: 'Seleccionar moneda...',
			unitOfMeasure: 'Seleccionar unidades...'
		}
	},
	colorPicker: {
		selectedColor: 'Color Seleccionado',
		commonColors: 'Colores Comunes',
		showAdvanced: 'Mostrar Opciones Avanzadas',
		hideAdvanced: 'Ocultar Opciones Avanzadas',
		hue: 'Matiz',
		saturation: 'Saturación',
		lightness: 'Luminosidad',
		hexCode: 'Código Hex'
	},
	table: {
		headers: {
			date: 'Fecha',
			odometer: 'Odómetro',
			fuelAmount: 'Cantidad de Combustible',
			cost: 'Costo',
			costCurrency: 'Costo Total',
			totalCost: 'Costo Total de la Recarga',
			mileage: 'Kilometraje',
			notes: 'Notas',
			actions: 'Acciones'
		}
	}
};

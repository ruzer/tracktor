export const metadata = {
code: 'it',
name: 'Italiano',
nativeName: 'Italiano',
flag: '🇮🇹',
rtl: false
};

export default {
common: {
save: 'Salva',
cancel: 'Annulla',
delete: 'Elimina',
edit: 'Modifica',
add: 'Aggiungi',
loading: 'Caricamento in corso...',
error: 'Errore',
success: 'Riuscito',
confirm: 'Conferma',
close: 'Chiudi',
toggleDarkMode: 'Attiva/disattiva modalità scura',
notAvailable: 'Non disponibile',
yes: 'Sì',
no: 'No'
},
app: {
title: 'Tracktor',
validatingAuth: 'Convalida autorizzazione in corso...',
redirecting: 'Reindirizzamento in corso...',
settings: 'Impostazioni',
logout: 'Disconnetti',
demoBanner: {
message:
'⚠️ AVVISO: Questa è un'istanza demo. I dati verranno reimpostati periodicamente e non verranno salvati in modo permanente. Si prega di evitare di aggiungere informazioni personali.',
defaultPin: 'PIN predefinito: 123456'
}
},
errors: {
requiredVehicleId: 'ID veicolo obbligatorio.',
networkError: 'Impossibile connettersi al server.',
fetchFailed: 'Impossibile recuperare i dati.',
fetchFuelLogsFailed: 'Impossibile recuperare i registri del carburante.',
fetchMaintenanceLogsFailed: 'Impossibile recuperare i registri di manutenzione.',
fetchInsuranceFailed: 'Impossibile recuperare i dati assicurativi.',
fetchPollutionFailed: 'Impossibile recuperare i certificati di inquinamento.',
deleteFailed: 'Impossibile eliminare.',
deleteFuelLogFailed: 'Impossibile eliminare il registro del carburante.',
deleteMaintenanceFailed: 'Impossibile eliminare il registro di manutenzione.',
deleteInsuranceFailed: 'Impossibile eliminare i dettagli dell'assicurazione.',
deletePollutionFailed: 'Impossibile eliminare il certificato di inquinamento.'
},
login: {
title: 'Benvenuto',
checkingPinStatus: 'Verifica dello stato del PIN...',
enterPinPrompt: 'Inserisci il tuo PIN di 6 cifre per accedere a Tracktor',
success: {
pinVerified: 'PIN verificato correttamente'
},
errors: {
missingPinEnv:
'Nessun PIN trovato. Imposta la variabile d'ambiente `AUTH_PIN` prima di avviare l'app.',
checkStatusFailed: 'Impossibile verificare lo stato del PIN.',
unknownServerError: 'Si è verificato un errore sconosciuto del server.',
connectionFailed: 'Impossibile connettersi al server. Controlla la connessione.',
invalidPin: 'PIN non valido. Riprova.',
failedSetPin: 'Impossibile impostare il PIN.'
}
},
dashboard: {
title: 'I tuoi veicoli',
addVehicle: 'Aggiungi veicolo',
loadingVehicles: 'Caricamento veicoli in corso...',
selectVehicle: 'Seleziona un veicolo per visualizzare i dati su carburante e chilometraggio',
noDataAvailable: 'Nessun dato disponibile per questo veicolo.',
vehicleTrends: 'Tendenze veicoli',
fuelCostOverTime: 'Costo carburante nel tempo',
mileageOverTime: 'Chilometraggio nel tempo',
datasets: {
totalFuelCost: 'Costo carburante totale ({{currency}})',
mileage: 'Chilometraggio ({{unit}})'
}
},
vehicle: {
licensePlate: 'Targa',
vin: 'Numero di telaio',
color: 'Colore',
odometer: 'Contachilometri',
insurance: 'Assicurazione',
pucc: 'PUCC',
year: 'Anno',
active: 'Attivo',
inactive: 'Inattivo',
logFuel: 'Registra rifornimento carburante',
deleteSuccess: 'Veicolo eliminato correttamente.',
deleteError: 'Impossibile eliminare il veicolo.',
connectionError: 'Impossibile connettersi al server.'
},
modals: {
configurations: 'Configurazioni',
addVehicle: 'Aggiungi veicolo',
editVehicle: 'Modifica veicolo',
addInsurance: 'Aggiungi assicurazione',
editInsurance: 'Modifica assicurazione',
addMaintenance: 'Aggiungi registro manutenzione',
editMaintenance: 'Modifica registro manutenzione',
addFuelLog: 'Registra rifornimento carburante',
editFuelLog: 'Modifica registro carburante',
addPollution: 'Aggiungi certificato di inquinamento',
editPollution: 'Modifica certificato di inquinamento',
pollutionDetails: 'Dettagli certificato di inquinamento',
noMaintenanceLogs: 'Nessun registro di manutenzione per questo veicolo.',
noPollutionCertificates: 'Nessun certificato di inquinamento per questo veicolo.',
noFuelLogs: 'Nessun registro di rifornimento carburante trovato per questo veicolo.',
noInsuranceLogs: 'Nessuna assicurazione trovata per questo veicolo.'
},
deleteConfirmation: {
title: 'Elimina',
message: 'Sei sicuro di voler eliminare?'
},
navigation: {
dashboard: 'Dashboard',
fuelLogs: 'Registri carburante',
maintenance: 'Manutenzione',
insurance: 'Assicurazione',
pollution: 'Certificato di inquinamento',
plates: 'Storico targhe',
assignments: 'Assegnazioni',
taxes: 'Tasse'
},
forms: {
labels: {
date: 'Data',
odometer: 'Contachilometri',
fuelAmount: 'Quantità carburante',
cost: 'Costo',
notes: 'Note',
filled: 'Riempimento serbatoio?',
missedLast: 'Ultima sosta mancata?',
startDate: 'Data di inizio',
endDate: 'Data di fine',
testingCenter: 'Centro di collaudo',
expiryDate: 'Data di scadenza',
serviceCenter: 'Centro assistenza',
certificateNumber: 'Numero del certificato',
issueDate: 'Data di emissione',
provider: 'Fornitore',
policyNumber: 'Numero di polizza',
make: 'Marca',
model: 'Modello',
year: 'Anno',
color: 'Colore',
licensePlate: 'Targa',
vinNumber: 'Numero di telaio',
plate: 'Targa',
retireDate: 'Data di ritiro',
reason: 'Motivo',
current: 'Attuale',
retire: 'Ritiro',
assigneeName: 'Nome del cessionario',
assigneeRole: 'Ruolo del cessionario',
area: 'Area',
unit: 'Unità',
close: 'Chiudi',
taxType: 'Tipo di imposta',
amount: 'Importo',
paid: 'Pagato',
paidDate: 'Data di pagamento',
receiptFolio: 'Folio di ricevute',
markPaid: 'Segna come pagato'
},
help:{
filled:
'Segna se questo rifornimento ha riempito il serbatoio completamente. Il chilometraggio viene calcolato solo tra due registri di serbatoio pieno, sommando eventuali rifornimenti parziali intermedi.',
missLast:
'Segna se non hai registrato il rifornimento precedente. Questo blocca l'utilizzo dei registri precedenti per il chilometraggio fino alla successiva voce di serbatoio pieno.'
},
placeholders: {
date: 'Data',
odometerReading: 'Lettura del contachilometri',
fuelAmountLitres: 'Quantità di carburante',
costCurrency: 'Costo totale',
totalCost: 'Costo totale del rifornimento',
notes: 'Note',
startDate: 'Data di inizio',
endDate: 'Data di fine',
testingCenter: 'Centro di collaudo',
expiryDate: 'Data di scadenza',
serviceCenter: 'Centro assistenza',
certificateNumber: 'Numero del certificato',
issueDate: 'Data di emissione',
provider: 'Fornitore',
policyNumber: 'Numero di polizza',
make: 'Marca',
model: 'Modello',
year: 'Anno',
color: 'Colore',
licensePlate: 'Targa',
vinNumber: 'Numero VIN'
},
buttons: {
add: 'Aggiungi',
update: 'Aggiorna'
},

validation: {
noVehicleSelected: 'Nessun veicolo selezionato.',
requiredFields: 'Data, Chilometraggio, Quantità di carburante e Costo sono obbligatori.',
maintenanceRequired: 'Data, Chilometraggio, Centro di assistenza e Costo sono obbligatori.',
insuranceRequired: 'Data di inizio, Data di fine e Costo sono obbligatori.',
pollutionRequired: 'Data di emissione, Data di scadenza e Centro di revisione sono obbligatori.',
vehicleRequired: 'Marca, modello, anno e targa sono obbligatori.'
},
success: {
fuelLogAdded: 'Registro rifornimento carburante aggiunto correttamente!',
fuelLogUpdated: 'Registro rifornimento carburante aggiornato correttamente!',
maintenanceAdded: 'Registro manutenzione aggiunto correttamente!',
maintenanceUpdated: 'Registro manutenzione aggiornato correttamente!',
insuranceAdded: 'Assicurazione aggiunta correttamente!',
insuranceUpdated: 'Assicurazione aggiornata correttamente!',
pollutionAdded: 'Certificato di inquinamento aggiunto correttamente!',
pollutionUpdated: 'Certificato di inquinamento aggiornato correttamente!',
vehicleAdded: 'Veicolo aggiunto correttamente!',
vehicleUpdated: 'Veicolo aggiornato correttamente!'
},
errors: {
connectionFailed: 'Impossibile connettersi al server.'
}
},
config: {
language: {
title: 'Lingua',
select: 'Seleziona lingua',
description: 'Scegli la lingua preferita per l'interfaccia'
},
regional: {
title: 'Impostazioni regionali',
dateFormat: 'Formato data',
currency: 'Valuta',
units: 'Unità di misura'
},
dateFormats: {
ggmmaaaa: 'GG/MM/AAAA',
mmggaaaa: 'MM/GG/AAAA',
yyyymmgg: 'AAAA-MM-GG',
ddmmmyaaa: 'GG MMM, AAAA'
},
currencies: {
inr: 'Rupia indiana (₹)',
usd: 'Dollaro statunitense ($)',
eur: 'Euro (€)',
gbp: 'Sterlina britannica (£)',
mxn: 'Peso messicano ($)',
ars: 'Peso argentino ($)',
cop: 'Peso colombiano ($)',
clp: 'Peso cileno ($)',
pen: 'Sol peruviano (S/)',
brl: 'Real brasiliano (R$)'
},
units: {
metric: 'Metrico (km, L)',
imperial: 'Imperiale (mi, gal)'
},
fields: {
dateFormat: 'Formato data',
currency: 'Valuta',
unitOfMeasure: 'Unità di misura'
},
descriptions: {
dateFormat: 'Seleziona come visualizzare le date nell'applicazione',
currency: 'Scegli la valuta preferita per i calcoli finanziari',
unitOfMeasure: 'Seleziona tra unità di misura metriche o imperiali
},
placeholders: {
dateFormat: 'Seleziona formato data...',
currency: 'Seleziona valuta...',
unitOfMeasure: 'Seleziona unità...'
}
},
colorPicker: {
selectedColor: 'Colore selezionato',
commonColors: 'Colori comuni',
showAdvanced: 'Mostra opzioni avanzate',
hideAdvanced: 'Nascondi opzioni avanzate',
hue: 'Tonalità',
saturation: 'Saturazione',
lightness: 'Luminosità',
hexCode: 'Codice esadecimale'
},
table: {
headers: {
date: 'Data',
odometer: 'Contachilometri',
fuelAmount: 'Quantità carburante',
cost: 'Costo',
totalCost: 'Costo totale',
mileage: 'Chilometraggio',
note: 'Note',
azioni: 'Azioni'
	}
	}
};
  
};

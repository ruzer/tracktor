import { Status } from "@exceptions/ServiceError.js";
import { VehicleError } from "@exceptions/VehicleError.js";
import * as schema from "@db/schema/index.js";
import { db } from "@db/index.js";
import { desc, eq } from "drizzle-orm";
import type { Express } from "express";
import { parse as parseCsv } from "csv-parse/sync";
import * as XLSX from "xlsx";
import { addInsurance } from "@services/insuranceService.js";
import { addAssignment } from "@services/vehicleAssignmentService.js";
import { getMaintenanceOrdersByVehicle } from "@services/maintenanceOrderService.js";
import { listByVehicle as listVehicleMaintenance } from "@services/vehicleMaintenanceService.js";

export const addVehicle = async (vehicleData: any) => {
  const vehicle = await db
    .insert(schema.vehicleTable)
    .values(vehicleData)
    .returning();
  const inserted = vehicle[0];
  // Add initial plate to history as current
  try {
    if (inserted?.id && vehicleData?.licensePlate) {
      // unset any current for safety (should be none on create)
      await db
        .update(schema.vehiclePlateTable)
        .set({ isCurrent: false })
        .where(eq(schema.vehiclePlateTable.vehicleId, inserted.id));
      await db
        .insert(schema.vehiclePlateTable)
        .values({
          vehicleId: inserted.id,
          plate: vehicleData.licensePlate,
          issuedDate: new Date().toISOString().slice(0, 10),
          isCurrent: true,
        })
        .run();
    }
  } catch (e) {
    console.error(
      "Failed to add initial plate history for vehicle",
      inserted?.id,
      e,
    );
  }
  return { id: inserted?.id, message: "Vehicle added successfully." };
};

export const getAllVehicles = async (search?: string) => {
  const vehicles = await db.query.vehicleTable.findMany();

  const legacyInsurances = await db.query.insuranceTable.findMany();
  const currentVehiclePolicies = await db
    .select({
      vehicleId: schema.vehicleInsuranceTable.vehicleId,
      policyId: schema.vehicleInsuranceTable.policyId,
      assignedAt: schema.vehicleInsuranceTable.assignedAt,
      premiumAmount: schema.vehicleInsuranceTable.premiumAmount,
      endDate: schema.insurancePolicyTable.endDate,
      status: schema.insurancePolicyTable.status,
      insurer: schema.insurancePolicyTable.insurer,
      policyNumber: schema.insurancePolicyTable.policyNumber,
      type: schema.insurancePolicyTable.type,
    })
    .from(schema.vehicleInsuranceTable)
    .innerJoin(
      schema.insurancePolicyTable,
      eq(schema.vehicleInsuranceTable.policyId, schema.insurancePolicyTable.id),
    )
    .where(eq(schema.vehicleInsuranceTable.isCurrent, true));

  const allPollutionCertificates =
    await db.query.pollutionCertificateTable.findMany();
  const allAssignments = await db.query.vehicleAssignmentTable.findMany();

  const policyByVehicle = new Map<string, (typeof currentVehiclePolicies)[number]>();
  for (const record of currentVehiclePolicies) {
    policyByVehicle.set(record.vehicleId, record);
  }

  const legacyInsuranceByVehicle = new Map<string, typeof legacyInsurances>();
  for (const legacy of legacyInsurances) {
    const collection = legacyInsuranceByVehicle.get(legacy.vehicleId) ?? [];
    collection.push(legacy);
    legacyInsuranceByVehicle.set(legacy.vehicleId, collection);
  }

  const currentAssignments = new Map<string, (typeof allAssignments)[number]>();
  for (const assignment of allAssignments) {
    if (assignment.isCurrent) {
      currentAssignments.set(assignment.vehicleId, assignment);
    }
  }

  const vehiclesWithMeta = vehicles.map((vehicle) => {
    const policy = policyByVehicle.get(vehicle.id);
    const insurances = legacyInsuranceByVehicle.get(vehicle.id) ?? [];
    const pollutionCertificates = allPollutionCertificates.filter(
      (pucc) => pucc.vehicleId === vehicle.id,
    );

    let insuranceStatus = "Not Available";
    let currentPolicy: {
      id: string;
      insurer: string;
      policyNumber: string;
      endDate: string;
      type: string;
      assignedAt: string;
      premiumAmount?: number | null;
    } | null = null;

    if (policy) {
      const today = new Date();
      const policyEnd = new Date(policy.endDate);
      insuranceStatus =
        policy.status === "active" && policyEnd >= today ? "Active" : "Expired";
      currentPolicy = {
        id: policy.policyId,
        insurer: policy.insurer,
        policyNumber: policy.policyNumber,
        endDate: policy.endDate,
        type: policy.type,
        assignedAt: policy.assignedAt,
        premiumAmount: policy.premiumAmount,
      };
    } else if (insurances.length > 0) {
      insuranceStatus = "Expired";
      insurances.forEach((insurance) => {
        const endDate = new Date(insurance.endDate);
        if (endDate > new Date()) {
          insuranceStatus = "Active";
        }
      });
    }

    let puccStatus = "Not Available";
    if (pollutionCertificates && pollutionCertificates.length > 0) {
      puccStatus = "Expired";
      pollutionCertificates.forEach((pucc) => {
        const expiryDate = new Date(pucc.expiryDate);
        const today = new Date();
        if (expiryDate > today) {
          puccStatus = "Active";
        }
      });
    }

    return {
      ...vehicle,
      insuranceStatus,
      puccStatus,
      currentAssignment: currentAssignments.get(vehicle.id) || null,
      currentPolicy,
    };
  });

  const normalizedSearch = search?.trim().toLowerCase();
  if (!normalizedSearch) {
    return vehiclesWithMeta;
  }

  return vehiclesWithMeta.filter((vehicle) => {
    const v = vehicle as any;
    const haystack = [
      v.make,
      v.model,
      v.licensePlate,
      v.vin,
      v.vinNumber,
      v.engineNumber,
      v.color,
      v.ownerName,
      v.year?.toString(),
      v.odometer ? v.odometer.toString() : undefined,
      v.status,
      v.insuranceStatus,
      v.currentPolicy?.policyNumber,
      v.currentPolicy?.insurer,
      v.puccStatus,
      v.currentAssignment?.assigneeName,
      v.currentAssignment?.assigneeRole,
      v.currentAssignment?.area,
      v.currentAssignment?.unit,
    ];

    return haystack.some((value) => {
      if (!value) return false;
      return value.toString().toLowerCase().includes(normalizedSearch);
    });
  });
};

export const getVehicleById = async (id: string) => {
  const vehicleRecord = await db.query.vehicleTable.findFirst({
    where: (vehicles, { eq }) => eq(vehicles.id, id),
  });

  if (!vehicleRecord) {
    throw new VehicleError(`No vehicle found for id : ${id}`, Status.NOT_FOUND);
  }

  const [
    assignmentRecords,
    maintenanceLogRecords,
    fuelLogRecords,
    documentRecords,
    pollutionRecords,
    taxRecords,
    legacyInsuranceRecords,
    policyAssignmentRecords,
    maintenanceWorkOrders,
    maintenanceOrders,
  ] = await Promise.all([
    db.query.vehicleAssignmentTable.findMany({
      where: (assignments, { eq }) => eq(assignments.vehicleId, id),
      orderBy: (assignments, { desc }) => desc(assignments.startDate),
    }),
    db.query.maintenanceLogTable.findMany({
      where: (logs, { eq }) => eq(logs.vehicleId, id),
      orderBy: (logs, { desc }) => desc(logs.date),
    }),
    db.query.fuelLogTable.findMany({
      where: (logs, { eq }) => eq(logs.vehicleId, id),
      orderBy: (logs, { desc }) => desc(logs.date),
    }),
    db.query.vehicleDocumentTable.findMany({
      where: (docs, { eq }) => eq(docs.vehicleId, id),
      orderBy: (docs, { desc }) => desc(docs.created_at),
    }),
    db.query.pollutionCertificateTable.findMany({
      where: (certs, { eq }) => eq(certs.vehicleId, id),
      orderBy: (certs, { desc }) => desc(certs.expiryDate),
    }),
    db.query.vehicleTaxTable.findMany({
      where: (taxes, { eq }) => eq(taxes.vehicleId, id),
      orderBy: (taxes, { desc }) => desc(taxes.year),
    }),
    db.query.insuranceTable.findMany({
      where: (insurances, { eq }) => eq(insurances.vehicleId, id),
      orderBy: (insurances, { desc }) => desc(insurances.endDate),
    }),
    db
      .select({
        linkId: schema.vehicleInsuranceTable.id,
        assignedAt: schema.vehicleInsuranceTable.assignedAt,
        unassignedAt: schema.vehicleInsuranceTable.unassignedAt,
        isCurrent: schema.vehicleInsuranceTable.isCurrent,
        premiumAmount: schema.vehicleInsuranceTable.premiumAmount,
        policy: schema.insurancePolicyTable,
      })
      .from(schema.vehicleInsuranceTable)
      .innerJoin(
        schema.insurancePolicyTable,
        eq(schema.vehicleInsuranceTable.policyId, schema.insurancePolicyTable.id),
      )
      .where(eq(schema.vehicleInsuranceTable.vehicleId, id))
      .orderBy(desc(schema.vehicleInsuranceTable.assignedAt)),
    listVehicleMaintenance(id),
    getMaintenanceOrdersByVehicle(id),
  ]);

  const assignments = assignmentRecords.map((assignment) => ({
    id: assignment.id,
    assigneeName: assignment.assigneeName,
    assigneeRole: assignment.assigneeRole,
    area: assignment.area,
    unit: assignment.unit,
    startDate: assignment.startDate,
    endDate: assignment.endDate,
    isCurrent: Boolean(assignment.isCurrent),
    notes: assignment.notes,
    createdAt: assignment.created_at,
    updatedAt: assignment.updated_at,
  }));

  const currentAssignment = assignments.find((assignment) => assignment.isCurrent) ?? null;

  const legacyInsurances = legacyInsuranceRecords.map((insurance) => ({
    id: insurance.id,
    provider: insurance.provider,
    policyNumber: insurance.policyNumber,
    startDate: insurance.startDate,
    endDate: insurance.endDate,
    cost: insurance.cost,
    notes: insurance.notes,
    createdAt: insurance.created_at,
    updatedAt: insurance.updated_at,
  }));

  const policyAssignments = policyAssignmentRecords.map((record) => ({
    id: record.linkId,
    assignedAt: record.assignedAt,
    unassignedAt: record.unassignedAt,
    isCurrent: Boolean(record.isCurrent),
    premiumAmount: record.premiumAmount ?? undefined,
    policy: {
      id: record.policy.id,
      type: record.policy.type,
      status: record.policy.status,
      insurer: record.policy.insurer,
      policyNumber: record.policy.policyNumber,
      coverageType: record.policy.coverageType,
      notes: record.policy.notes,
      startDate: record.policy.startDate,
      endDate: record.policy.endDate,
      representativeId: record.policy.representativeId,
      createdAt: record.policy.created_at,
      updatedAt: record.policy.updated_at,
    },
  }));

  const currentPolicy = policyAssignments.find((assignment) => assignment.isCurrent) ?? null;

  const today = new Date();
  let insuranceStatus = "Not Available";
  if (currentPolicy) {
    const policyEnds = currentPolicy.policy.endDate
      ? new Date(currentPolicy.policy.endDate)
      : null;
    insuranceStatus =
      currentPolicy.policy.status === "active" && policyEnds && policyEnds >= today
        ? "Active"
        : "Expired";
  } else if (legacyInsurances.length > 0) {
    insuranceStatus = legacyInsurances.some((insurance) => {
      const end = insurance.endDate ? new Date(insurance.endDate) : null;
      return end ? end >= today : false;
    })
      ? "Active"
      : "Expired";
  }

  const maintenanceSummary = maintenanceWorkOrders.reduce(
    (acc, entry) => {
      acc.total += 1;
      if (entry.status === "completed") {
        acc.completed += 1;
      } else if (entry.status === "in_progress") {
        acc.inProgress += 1;
      } else {
        acc.pending += 1;
      }
      return acc;
    },
    { total: 0, completed: 0, inProgress: 0, pending: 0 },
  );

  const recentMaintenanceLogs = maintenanceLogRecords.slice(0, 5).map((log) => ({
    id: log.id,
    date: log.date,
    odometer: log.odometer,
    serviceCenter: log.serviceCenter,
    cost: log.cost,
    notes: log.notes,
    createdAt: log.created_at,
    updatedAt: log.updated_at,
  }));

  const fuelLastEntry = fuelLogRecords[0]
    ? {
        id: fuelLogRecords[0].id,
        date: fuelLogRecords[0].date,
        odometer: fuelLogRecords[0].odometer,
        fuelAmount: fuelLogRecords[0].fuelAmount,
        cost: fuelLogRecords[0].cost,
        filled: Boolean(fuelLogRecords[0].filled),
        missedLast: Boolean(fuelLogRecords[0].missedLast),
        createdAt: fuelLogRecords[0].created_at,
      }
    : null;

  const documents = documentRecords.map((doc) => ({
    id: doc.id,
    docType: doc.docType,
    issueDate: doc.issueDate,
    expiryDate: doc.expiryDate,
    filePath: doc.filePath,
    fileHash: doc.fileHash,
    notes: doc.notes,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  }));

  const pollutionCertificates = pollutionRecords.map((record) => {
    const expiry = record.expiryDate ? new Date(record.expiryDate) : null;
    const statusLabel = expiry && expiry >= today ? "active" : "expired";

    return {
      id: record.id,
      certificateNumber: record.certificateNumber,
      issueDate: record.issueDate,
      expiryDate: record.expiryDate,
      testingCenter: record.testingCenter,
      notes: record.notes,
      status: statusLabel,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  });

  const puccStatus = pollutionCertificates.length
    ? pollutionCertificates.some((certificate) => certificate.status === "active")
      ? "Active"
      : "Expired"
    : "Not Available";

  const taxes = taxRecords.map((tax) => ({
    id: tax.id,
    type: tax.type,
    year: tax.year,
    amount: tax.amount,
    paid: Boolean(tax.paid),
    paidDate: tax.paidDate,
    receiptFolio: tax.receiptFolio,
    notes: tax.notes,
    createdAt: tax.created_at,
    updatedAt: tax.updated_at,
  }));

  const { created_at, updated_at, ...rest } = vehicleRecord as typeof vehicleRecord & {
    created_at: string;
    updated_at: string;
  };

  const currentPolicySummary = currentPolicy
    ? {
        id: currentPolicy.policy.id,
        insurer: currentPolicy.policy.insurer,
        policyNumber: currentPolicy.policy.policyNumber,
        endDate: currentPolicy.policy.endDate,
        type: currentPolicy.policy.type,
        assignedAt: currentPolicy.assignedAt,
        premiumAmount: currentPolicy.premiumAmount,
      }
    : null;

  return {
    ...rest,
    status: rest.status ?? "active",
    createdAt: created_at,
    updatedAt: updated_at,
    currentAssignment,
    currentPolicy: currentPolicySummary,
    insuranceStatus,
    puccStatus,
    assignments,
    insurance: {
      currentPolicy,
      policyAssignments,
      legacy: legacyInsurances,
    },
    maintenance: {
      summary: {
        ...maintenanceSummary,
        open: maintenanceSummary.pending + maintenanceSummary.inProgress,
      },
      workOrders: maintenanceWorkOrders,
      recentLogs: recentMaintenanceLogs,
      orders: maintenanceOrders,
    },
    fuel: {
      totalLogs: fuelLogRecords.length,
      lastEntry: fuelLastEntry,
    },
    documents,
    pollutionCertificates,
    taxes,
  };
};

export const updateVehicle = async (id: string, vehicleData: any) => {
  const existing = await db.query.vehicleTable.findFirst({
    where: (vehicles, { eq }) => eq(vehicles.id, id),
  });
  if (!existing) {
    throw new VehicleError(`No vehicle found for id : ${id}`, Status.NOT_FOUND);
  }
  await db
    .update(schema.vehicleTable)
    .set({
      ...vehicleData,
    })
    .where(eq(schema.vehicleTable.id, id));
  return { message: "Vehicle updated successfully." };
};

export const deleteVehicle = async (id: string) => {
  const result = await db
    .delete(schema.vehicleTable)
    .where(eq(schema.vehicleTable.id, id))
    .returning();
  if (result.length === 0) {
    throw new VehicleError(`No vehicle found for id : ${id}`, Status.NOT_FOUND);
  }
  return { message: "Vehicle deleted successfully." };
};

type ImportVehicleRow = {
  make?: string;
  model?: string;
  year?: string | number;
  licensePlate?: string;
  vin?: string;
  color?: string;
  odometer?: string | number;
  ownerName?: string;
  ownershipTypeId?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceStartDate?: string;
  insuranceEndDate?: string;
  insuranceCost?: string | number;
  insuranceNotes?: string;
  assigneeName?: string;
  assigneeRole?: string;
  assignmentArea?: string;
  assignmentUnit?: string;
  assignmentStartDate?: string;
  assignmentEndDate?: string;
  assignmentNotes?: string;
  assignmentIsCurrent?: string | boolean;
  engineNumber?: string;
  vinNumber?: string;
  tankSizeLiters?: string | number;
  status?: string;
};

type ImportSummary = {
  totalRows: number;
  imported: number;
  skipped: number;
  failed: { row: number; error: string }[];
  warnings: string[];
};

const normalizeHeaderKey = (key: string) =>
  key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const headerMappings: Record<string, keyof ImportVehicleRow> = {
  make: "make",
  marca: "make",
  model: "model",
  modelo: "model",
  year: "year",
  years: "year",
  anio: "year",
  ano: "year",
  licenseplate: "licensePlate",
  licenceplate: "licensePlate",
  placas: "licensePlate",
  placa: "licensePlate",
  numeroplaca: "licensePlate",
  numerodeplaca: "licensePlate",
  plate: "licensePlate",
  vin: "vin",
  numerochasis: "vin",
  color: "color",
  colours: "color",
  colorvehiculo: "color",
  odometer: "odometer",
  odometro: "odometer",
  kilometraje: "odometer",
  kilometros: "odometer",
  owner: "ownerName",
  ownername: "ownerName",
  propietario: "ownerName",
  ownershiptype: "ownershipTypeId",
  ownershiptypeid: "ownershipTypeId",
  insuranceprovider: "insuranceProvider",
  proveedorseguro: "insuranceProvider",
  aseguradora: "insuranceProvider",
  insurancepolicynumber: "insurancePolicyNumber",
  policynumber: "insurancePolicyNumber",
  numeropoliza: "insurancePolicyNumber",
  insurancepolicy: "insurancePolicyNumber",
  insurancepolicyid: "insurancePolicyNumber",
  insurancestartdate: "insuranceStartDate",
  fechainicioseguro: "insuranceStartDate",
  startdateseguro: "insuranceStartDate",
  insuranceenddate: "insuranceEndDate",
  fechafinseguro: "insuranceEndDate",
  enddateseguro: "insuranceEndDate",
  insurancecost: "insuranceCost",
  costoseguro: "insuranceCost",
  prima: "insuranceCost",
  insurancenotes: "insuranceNotes",
  notasseguro: "insuranceNotes",
  assigneename: "assigneeName",
  conductor: "assigneeName",
  driver: "assigneeName",
  responsible: "assigneeName",
  assigneerole: "assigneeRole",
  rol: "assigneeRole",
  role: "assigneeRole",
  area: "assignmentArea",
  unidad: "assignmentUnit",
  unit: "assignmentUnit",
  subarea: "assignmentArea",
  assignmentstart: "assignmentStartDate",
  assignmentstartdate: "assignmentStartDate",
  fechainicioresguardo: "assignmentStartDate",
  assignmentend: "assignmentEndDate",
  assignmentenddate: "assignmentEndDate",
  fechafinresguardo: "assignmentEndDate",
  assignmentnotes: "assignmentNotes",
  notasresguardo: "assignmentNotes",
  assignmentcurrent: "assignmentIsCurrent",
  iscurrent: "assignmentIsCurrent",
  asignacionactual: "assignmentIsCurrent",
  enginenumber: "engineNumber",
  numeromotor: "engineNumber",
  motor: "engineNumber",
  vinnumber: "vinNumber",
  numerovin: "vinNumber",
  vininterno: "vinNumber",
  tanksize: "tankSizeLiters",
  tanksizeliters: "tankSizeLiters",
  capacidadtanque: "tankSizeLiters",
  tanque: "tankSizeLiters",
  status: "status",
  estado: "status",
};

const asOptionalString = (value: unknown) => {
  if (value === undefined || value === null) return undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const str = value.toString().trim();
  return str.length === 0 ? undefined : str;
};

const parseOptionalNumber = (value: unknown) => {
  const str = asOptionalString(value);
  if (!str) return undefined;
  const normalized = str.replace(/,/g, "");
  const num = Number(normalized);
  return Number.isNaN(num) ? undefined : num;
};

const parseOptionalBoolean = (value: unknown) => {
  const str = asOptionalString(value);
  if (!str) return undefined;
  const lowered = str.toLowerCase();
  if (["yes", "true", "1", "si", "sí"].includes(lowered)) return true;
  if (["no", "false", "0"].includes(lowered)) return false;
  return undefined;
};

const normalizeStatusValue = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;

  if (["active", "activo", "activa"].includes(normalized)) return "active";

  if (
    [
      "maintenance",
      "en mantenimiento",
      "enmantenimiento",
      "reparacion",
      "reparación",
      "repair",
      "en reparación",
      "en reparacion",
      "in_repair",
      "in repair",
    ].includes(normalized)
  ) {
    return "in_repair";
  }

  if (
    [
      "retired",
      "retirado",
      "retirada",
      "decommissioned",
      "baja",
      "dado de baja",
      "desincorporado",
    ].includes(normalized)
  ) {
    return "retired";
  }

  return undefined;
};

const mapRawRow = (row: Record<string, unknown>): ImportVehicleRow => {
  const mapped: ImportVehicleRow = {};
  for (const [header, value] of Object.entries(row)) {
    const normalized = normalizeHeaderKey(header);
    const field = headerMappings[normalized];
    if (!field) continue;
    mapped[field] = value as never;
  }
  return mapped;
};

const parseUploadRecords = (file: Express.Multer.File) => {
  const mimetype = file.mimetype?.toLowerCase() || "";
  const name = file.originalname?.toLowerCase() || "";
  let raw: Record<string, unknown>[] = [];

  const shouldParseAsCsv =
    mimetype.includes("csv") ||
    mimetype.includes("plain") ||
    name.endsWith(".csv");

  const shouldParseAsExcel =
    mimetype.includes("spreadsheetml") ||
    mimetype.includes("excel") ||
    name.endsWith(".xlsx") ||
    name.endsWith(".xls");

  if (shouldParseAsCsv) {
    const text = file.buffer.toString("utf8");
    raw = (
      parseCsv(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as Record<string, unknown>[]
    )?.filter(Boolean);
  } else if (shouldParseAsExcel) {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames?.[0];
    if (!sheetName) {
      throw new VehicleError(
        "Uploaded file does not contain any sheets.",
        Status.BAD_REQUEST,
      );
    }
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new VehicleError(
        "Uploaded file does not contain any records.",
        Status.BAD_REQUEST,
      );
    }
    raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: undefined,
    });
  } else {
    throw new VehicleError(
      "Unsupported file format. Please upload a CSV or Excel file.",
      Status.BAD_REQUEST,
    );
  }

  return raw
    .map(mapRawRow)
    .map((row) => {
      const cleaned: ImportVehicleRow = {};
      (Object.keys(row) as (keyof ImportVehicleRow)[]).forEach((key) => {
        const value = row[key];
        if (value === undefined || value === null) return;
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (trimmed.length === 0) return;
          cleaned[key] = trimmed as never;
        } else {
          cleaned[key] = value as never;
        }
      });
      return cleaned;
    })
    .filter((row) => Object.keys(row).length > 0);
};

export const importVehicles = async (
  file: Express.Multer.File,
): Promise<ImportSummary> => {
  const records = parseUploadRecords(file);
  if (records.length === 0) {
    throw new VehicleError(
      "The provided file does not contain any recognizable vehicle rows.",
      Status.BAD_REQUEST,
    );
  }

  const summary: ImportSummary = {
    totalRows: records.length,
    imported: 0,
    skipped: 0,
    failed: [],
    warnings: [],
  };

  for (const [index, record] of records.entries()) {
    const rowNumber = index + 2; // account for header row
    const rowErrors: string[] = [];

    const make = asOptionalString(record.make);
    const model = asOptionalString(record.model);
    const licensePlate = asOptionalString(record.licensePlate);
    const yearNumber = parseOptionalNumber(record.year);

    if (!make) rowErrors.push("Missing make");
    if (!model) rowErrors.push("Missing model");
    if (!licensePlate) rowErrors.push("Missing license plate");
    if (yearNumber === undefined) {
      rowErrors.push("Invalid or missing year");
    }

    if (rowErrors.length > 0) {
      summary.skipped += 1;
      summary.failed.push({
        row: rowNumber,
        error: rowErrors.join(", "),
      });
      continue;
    }

    const odometer = parseOptionalNumber(record.odometer);
    if (record.odometer && odometer === undefined) {
      summary.warnings.push(
        `Row ${rowNumber}: Unable to parse odometer value "${record.odometer}".`,
      );
    }

    try {
      const vehiclePayload: Record<string, unknown> = {
        make,
        model,
        year: Math.round(yearNumber!),
        licensePlate,
      };

      const optionalProps: Array<[keyof ImportVehicleRow, string]> = [
        ["vin", "vin"],
        ["vinNumber", "vinNumber"],
        ["engineNumber", "engineNumber"],
        ["color", "color"],
        ["ownerName", "ownerName"],
        ["ownershipTypeId", "ownershipTypeId"],
        ["status", "status"],
      ];

      for (const [source, target] of optionalProps) {
        const value = asOptionalString(record[source]);
        if (value) {
          vehiclePayload[target] = value;
        }
      }

      if (typeof vehiclePayload.status === "string") {
        const rawStatus = vehiclePayload.status;
        const normalizedStatus = normalizeStatusValue(rawStatus);
        if (!normalizedStatus) {
          summary.warnings.push(
            `Row ${rowNumber}: Provided status "${rawStatus}" is invalid and was skipped.`,
          );
          delete vehiclePayload.status;
        } else {
          vehiclePayload.status = normalizedStatus;
        }
      }

      if (odometer !== undefined) {
        vehiclePayload.odometer = Math.round(odometer);
      }

      const tankSize = parseOptionalNumber(record.tankSizeLiters);
      if (record.tankSizeLiters && tankSize === undefined) {
        summary.warnings.push(
          `Row ${rowNumber}: Unable to parse tank size value "${record.tankSizeLiters}".`,
        );
      }
      if (tankSize !== undefined) {
        vehiclePayload.tankSizeLiters = Math.round(tankSize);
      }

      const addResult = await addVehicle(vehiclePayload);
      if (!addResult.id) {
        throw new VehicleError(
          "Vehicle could not be created.",
          Status.INTERNAL_SERVER_ERROR,
        );
      }
      const vehicleId = addResult.id;

      const hasInsuranceData = [
        record.insuranceProvider,
        record.insurancePolicyNumber,
        record.insuranceStartDate,
        record.insuranceEndDate,
        record.insuranceCost,
      ].some((value) => value !== undefined && value !== null && value !== "");

      if (hasInsuranceData) {
        const provider = asOptionalString(record.insuranceProvider);
        const policyNumber = asOptionalString(record.insurancePolicyNumber);
        const startDate = asOptionalString(record.insuranceStartDate);
        const endDate = asOptionalString(record.insuranceEndDate);
        const cost = parseOptionalNumber(record.insuranceCost) ?? 0;

        if (!provider || !policyNumber || !startDate || !endDate) {
          summary.warnings.push(
            `Row ${rowNumber}: Incomplete insurance data. Skipped insurance creation.`,
          );
        } else {
          await addInsurance(vehicleId, {
            provider,
            policyNumber,
            startDate,
            endDate,
            cost,
            notes: asOptionalString(record.insuranceNotes),
          });
        }
      }

      const hasAssignmentData = [
        record.assigneeName,
        record.assigneeRole,
        record.assignmentArea,
        record.assignmentUnit,
        record.assignmentStartDate,
        record.assignmentEndDate,
        record.assignmentNotes,
        record.assignmentIsCurrent,
      ].some((value) => value !== undefined && value !== null && value !== "");

      if (hasAssignmentData) {
        let startDate = asOptionalString(record.assignmentStartDate);
        if (!startDate) {
          startDate = new Date().toISOString().slice(0, 10);
          summary.warnings.push(
            `Row ${rowNumber}: Missing assignment start date. Using today's date (${startDate}).`,
          );
        }

        const endDate = asOptionalString(record.assignmentEndDate);
        const explicitIsCurrent = parseOptionalBoolean(
          record.assignmentIsCurrent,
        );
        const isCurrent = explicitIsCurrent ?? !endDate;

        await addAssignment(vehicleId, {
          assigneeName: asOptionalString(record.assigneeName),
          assigneeRole: asOptionalString(record.assigneeRole),
          area: asOptionalString(record.assignmentArea),
          unit: asOptionalString(record.assignmentUnit),
          startDate,
          endDate,
          isCurrent,
          notes: asOptionalString(record.assignmentNotes),
        });
      }

      summary.imported += 1;
    } catch (error) {
      summary.skipped += 1;
      const message =
        error instanceof Error ? error.message : "Unknown error";
      summary.failed.push({ row: rowNumber, error: message });
    }
  }

  return summary;
};

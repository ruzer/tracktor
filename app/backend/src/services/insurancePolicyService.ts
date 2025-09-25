import { sql, and, eq, lt, lte, desc, gt, ne } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import {
  insurancePolicyRenewalTable,
  insurancePolicyTable,
  insuranceRepresentativeTable,
  vehicleInsuranceTable,
  vehicleTable,
} from "@db/schema/index.js";
import { db } from "@db/index.js";
import { Status } from "@exceptions/ServiceError.js";
import { InsuranceError } from "@exceptions/InsuranceError.js";

type PolicyFilters = {
  type?: "individual" | "collective";
  status?: "active" | "expired" | "cancelled";
  expiresBefore?: string;
  search?: string;
};

type RepresentativeInput = {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  insurer?: string;
};

export type VehicleAssignmentInput = {
  vehicleId: string;
  premiumAmount?: number;
};

type CreatePolicyInput = {
  type: "individual" | "collective";
  insurer: string;
  policyNumber: string;
  coverageType?: string;
  notes?: string;
  startDate: string;
  endDate: string;
  status?: "active" | "expired" | "cancelled";
  representative?: RepresentativeInput;
  vehicles?: VehicleAssignmentInput[];
};

type UpdatePolicyInput = {
  type?: "individual" | "collective";
  insurer?: string;
  policyNumber?: string;
  coverageType?: string;
  notes?: string;
  startDate?: string;
  endDate?: string;
  status?: "active" | "expired" | "cancelled";
  representative?: RepresentativeInput | null;
  vehicles?: VehicleAssignmentInput[];
};

type RenewPolicyInput = {
  newStartDate: string;
  newEndDate: string;
  notes?: string;
  performedBy?: string;
  extendToVehicles?: boolean;
};

type RenewPoliciesBulkInput = {
  policyIds: string[];
  newStartDate: string;
  newEndDate: string;
  notes?: string;
  performedBy?: string;
  extendToVehicles?: boolean;
};

type InsuranceReportFilters = {
  expiresWithinDays?: number;
};

type PolicySummaryRow = {
  id: string;
  type: string;
  status: string;
  insurer: string;
  policyNumber: string;
  coverageType: string | null;
  notes: string | null;
  startDate: string;
  endDate: string;
  representativeId: string | null;
  representativeName: string | null;
  representativePhone: string | null;
  representativeEmail: string | null;
  vehiclesCount: number | null;
  createdAt: string;
  updatedAt: string;
};

export type PolicySummary = {
  id: string;
  type: "individual" | "collective";
  status: "active" | "expired" | "cancelled";
  insurer: string;
  policyNumber: string;
  coverageType?: string;
  notes?: string;
  startDate: string;
  endDate: string;
  representative?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
  vehiclesCount: number;
  daysToExpire: number;
  createdAt: string;
  updatedAt: string;
};

export type PolicyVehicle = {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string | null;
  assignedAt: string;
  unassignedAt?: string | null;
  isCurrent: boolean;
  premiumAmount?: number | null;
};

export type PolicyRenewalRecord = {
  id: string;
  policyId: string;
  previousEndDate: string;
  newStartDate: string;
  newEndDate: string;
  notes?: string | null;
  performedBy?: string | null;
  created_at: string;
  updated_at: string;
};

export type PolicyDetail = PolicySummary & {
  vehicles: PolicyVehicle[];
  renewals: PolicyRenewalRecord[];
};

export type InsuranceReport = {
  vehiclesWithoutPolicy: Array<{
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  }>;
  vehiclesWithExpiredPolicy: Array<{
    vehicleId: string;
    licensePlate: string;
    make: string;
    model: string;
    policyId: string;
    policyNumber: string;
    insurer: string;
    endDate: string;
  }>;
  upcomingExpirations: Array<{
    id: string;
    policyNumber: string;
    insurer: string;
    endDate: string;
    type: string;
  }>;
  expiredPolicies: Array<{
    id: string;
    policyNumber: string;
    insurer: string;
    endDate: string;
    type: string;
  }>;
};

const ISO_DATE_REGEX = /\d{4}-\d{2}-\d{2}/;

const nowIso = () => new Date().toISOString();

function normalizeDate(value: string) {
  if (!value || !ISO_DATE_REGEX.test(value)) {
    throw new InsuranceError("Invalid date format, expected YYYY-MM-DD", Status.BAD_REQUEST);
  }
  return value;
}

function determineStatus(endDate: string, provided?: string) {
  if (provided) return provided as "active" | "expired" | "cancelled";
  const today = new Date().toISOString().slice(0, 10);
  return endDate < today ? "expired" : "active";
}

function validateDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new InsuranceError("Invalid date values provided", Status.BAD_REQUEST);
  }
  
  if (start >= end) {
    throw new InsuranceError("Start date must be before end date", Status.BAD_REQUEST);
  }
  
  // Validate that the policy period is reasonable (not more than 10 years)
  const maxPolicyDuration = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years in milliseconds
  if (end.getTime() - start.getTime() > maxPolicyDuration) {
    throw new InsuranceError("Policy duration cannot exceed 10 years", Status.BAD_REQUEST);
  }
  
  // Validate that start date is not too far in the past (more than 5 years)
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  if (start < fiveYearsAgo) {
    throw new InsuranceError("Start date cannot be more than 5 years in the past", Status.BAD_REQUEST);
  }
}

async function validatePolicyNumberUniqueness(insurer: string, policyNumber: string, excludePolicyId?: string) {
  const existingPolicy = await db.query.insurancePolicyTable.findFirst({
    where: (policies, { eq, and, ne }) => {
      const conditions = [
        eq(policies.insurer, insurer),
        eq(policies.policyNumber, policyNumber)
      ];
      
      if (excludePolicyId) {
        conditions.push(ne(policies.id, excludePolicyId));
      }
      
      return and(...conditions);
    }
  });
  
  if (existingPolicy) {
    throw new InsuranceError(
      `Policy number ${policyNumber} already exists for insurer ${insurer}`,
      Status.BAD_REQUEST
    );
  }
}

async function validateVehicleInsuranceOverlap(vehicleId: string, startDate: string, endDate: string, excludePolicyId?: string) {
  // Check for overlapping insurance periods for the same vehicle
  const overlappingAssignments = await db
    .select({
      policyId: vehicleInsuranceTable.policyId,
      assignedAt: vehicleInsuranceTable.assignedAt,
      unassignedAt: vehicleInsuranceTable.unassignedAt,
      policyNumber: insurancePolicyTable.policyNumber,
      insurer: insurancePolicyTable.insurer,
      policyStartDate: insurancePolicyTable.startDate,
      policyEndDate: insurancePolicyTable.endDate
    })
    .from(vehicleInsuranceTable)
    .innerJoin(insurancePolicyTable, eq(vehicleInsuranceTable.policyId, insurancePolicyTable.id))
    .where(
      and(
        eq(vehicleInsuranceTable.vehicleId, vehicleId),
        eq(vehicleInsuranceTable.isCurrent, true),
        excludePolicyId ? ne(insurancePolicyTable.id, excludePolicyId) : undefined
      )
    );
  
  for (const assignment of overlappingAssignments) {
    const existingStart = new Date(assignment.policyStartDate);
    const existingEnd = new Date(assignment.policyEndDate);
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    
    // Check if there's any overlap
    if (newStart < existingEnd && newEnd > existingStart) {
      throw new InsuranceError(
        `Vehicle already has an active insurance policy (${assignment.insurer} - ${assignment.policyNumber}) that overlaps with the specified period`,
        Status.BAD_REQUEST
      );
    }
  }
}

function validatePremiumAmount(premiumAmount?: number) {
  if (premiumAmount !== undefined) {
    if (premiumAmount < 0) {
      throw new InsuranceError("Premium amount cannot be negative", Status.BAD_REQUEST);
    }
    
    if (premiumAmount > 1000000) { // 1 million limit
      throw new InsuranceError("Premium amount cannot exceed 1,000,000", Status.BAD_REQUEST);
    }
  }
}

async function resolveRepresentative(representative?: RepresentativeInput | null) {
  if (!representative) return undefined;
  if (representative.id) return representative.id;
  const [created] = await db
    .insert(insuranceRepresentativeTable)
    .values({
      name: representative.name,
      email: representative.email,
      phone: representative.phone,
      insurer: representative.insurer,
    })
    .returning();
  return created?.id;
}

async function closeExistingAssignments(vehicleId: string) {
  await db
    .update(vehicleInsuranceTable)
    .set({
      isCurrent: false,
      unassignedAt: nowIso(),
    })
    .where(and(eq(vehicleInsuranceTable.vehicleId, vehicleId), eq(vehicleInsuranceTable.isCurrent, true)))
    .run();
}

async function assignVehiclesInternal(
  policyId: string,
  assignments: VehicleAssignmentInput[],
  effectiveDate?: string,
) {
  const assignedAt = effectiveDate ? normalizeDate(effectiveDate) : nowIso();
  
  // Validate premium amounts for all assignments
  for (const assignment of assignments) {
    validatePremiumAmount(assignment.premiumAmount);
  }
  
  for (const assignment of assignments) {
    await closeExistingAssignments(assignment.vehicleId);
    await db
      .insert(vehicleInsuranceTable)
      .values({
        policyId,
        vehicleId: assignment.vehicleId,
        assignedAt,
        premiumAmount: assignment.premiumAmount,
        isCurrent: true,
      })
      .run();
  }
}

function mapPolicyRow(row: PolicySummaryRow): PolicySummary {
  const today = new Date();
  const end = new Date(row.endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return {
    id: row.id,
    type: row.type as "individual" | "collective",
    status: row.status as "active" | "expired" | "cancelled",
    insurer: row.insurer,
    policyNumber: row.policyNumber,
    coverageType: row.coverageType ?? undefined,
    notes: row.notes ?? undefined,
    startDate: row.startDate,
    endDate: row.endDate,
    representative: row.representativeId
      ? {
          id: row.representativeId,
          name: row.representativeName ?? "",
          phone: row.representativePhone ?? undefined,
          email: row.representativeEmail ?? undefined,
        }
      : undefined,
    vehiclesCount: row.vehiclesCount ?? 0,
    daysToExpire: diff,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listPolicies(filters: PolicyFilters = {}): Promise<PolicySummary[]> {
  const conditions: SQL<unknown>[] = [];

  if (filters.type) {
    conditions.push(eq(insurancePolicyTable.type, filters.type));
  }

  if (filters.status && ["active", "expired", "cancelled"].includes(filters.status)) {
    conditions.push(eq(insurancePolicyTable.status, filters.status));
  }

  if (filters.expiresBefore) {
    conditions.push(lte(insurancePolicyTable.endDate, filters.expiresBefore));
  }

  const policySelect = db
    .select({
      id: insurancePolicyTable.id,
      type: insurancePolicyTable.type,
      status: insurancePolicyTable.status,
      insurer: insurancePolicyTable.insurer,
      policyNumber: insurancePolicyTable.policyNumber,
      coverageType: insurancePolicyTable.coverageType,
      notes: insurancePolicyTable.notes,
      startDate: insurancePolicyTable.startDate,
      endDate: insurancePolicyTable.endDate,
      representativeId: insurancePolicyTable.representativeId,
      representativeName: insuranceRepresentativeTable.name,
      representativePhone: insuranceRepresentativeTable.phone,
      representativeEmail: insuranceRepresentativeTable.email,
      vehiclesCount: sql<number>`SUM(CASE WHEN ${vehicleInsuranceTable.isCurrent} = 1 THEN 1 ELSE 0 END)`,
      createdAt: insurancePolicyTable.created_at,
      updatedAt: insurancePolicyTable.updated_at,
    })
    .from(insurancePolicyTable)
    .leftJoin(
      insuranceRepresentativeTable,
      eq(insurancePolicyTable.representativeId, insuranceRepresentativeTable.id),
    )
    .leftJoin(vehicleInsuranceTable, eq(vehicleInsuranceTable.policyId, insurancePolicyTable.id))
    .groupBy(insurancePolicyTable.id, insuranceRepresentativeTable.id);

  const whereClause = conditions.length ? and(...conditions) : undefined;
  const rows = whereClause ? await policySelect.where(whereClause) : await policySelect;

  const mapped = rows.map(mapPolicyRow);
  if (filters.search) {
    const value = filters.search.toLowerCase();
    return mapped.filter((row) =>
      [row.insurer, row.policyNumber, row.representative?.name]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(value)),
    );
  }
  return mapped;
}

export async function createPolicy(payload: CreatePolicyInput): Promise<PolicyDetail> {
  const { vehicles, representative, status, ...rest } = payload;
  
  // Validate date range
  const startDate = normalizeDate(rest.startDate);
  const endDate = normalizeDate(rest.endDate);
  validateDateRange(startDate, endDate);
  
  // Validate policy number uniqueness
  await validatePolicyNumberUniqueness(rest.insurer, rest.policyNumber);
  
  // Validate premium amounts for vehicles
  if (vehicles?.length) {
    for (const vehicle of vehicles) {
      validatePremiumAmount(vehicle.premiumAmount);
      // Validate vehicle insurance overlap
      await validateVehicleInsuranceOverlap(vehicle.vehicleId, startDate, endDate);
    }
  }
  
  const representativeId = await resolveRepresentative(representative);
  const policyStatus = determineStatus(endDate, status);
  
  const [policy] = await db
    .insert(insurancePolicyTable)
    .values({
      type: rest.type,
      insurer: rest.insurer,
      policyNumber: rest.policyNumber,
      coverageType: rest.coverageType,
      notes: rest.notes,
      startDate,
      endDate,
      status: policyStatus,
      representativeId,
    })
    .returning();

  if (!policy?.id) {
    throw new InsuranceError("Policy could not be created", Status.INTERNAL_SERVER_ERROR);
  }

  if (vehicles?.length) {
    await assignVehiclesInternal(policy.id, vehicles);
  }

  const detail = await getPolicy(policy.id);
  if (!detail) {
    throw new InsuranceError("Policy not found after creation", Status.INTERNAL_SERVER_ERROR);
  }
  return detail;
}

export async function updatePolicy(id: string, payload: UpdatePolicyInput): Promise<PolicyDetail | null> {
  const current = await getPolicy(id);
  if (!current) {
    throw new InsuranceError("Policy not found", Status.NOT_FOUND);
  }

  const { vehicles, representative, status, ...rest } = payload;
  
  // Validate date range if both dates are provided or if updating existing dates
  const startDate = rest.startDate ? normalizeDate(rest.startDate) : current.startDate;
  const endDate = rest.endDate ? normalizeDate(rest.endDate) : current.endDate;
  
  if (rest.startDate || rest.endDate) {
    validateDateRange(startDate, endDate);
  }
  
  // Validate policy number uniqueness if insurer or policy number is being updated
  if (rest.insurer || rest.policyNumber) {
    const insurer = rest.insurer || current.insurer;
    const policyNumber = rest.policyNumber || current.policyNumber;
    await validatePolicyNumberUniqueness(insurer, policyNumber, id);
  }
  
  // Validate premium amounts and vehicle overlaps for vehicles
  if (vehicles?.length) {
    for (const vehicle of vehicles) {
      validatePremiumAmount(vehicle.premiumAmount);
      // Validate vehicle insurance overlap, excluding current policy
      await validateVehicleInsuranceOverlap(vehicle.vehicleId, startDate, endDate, id);
    }
  }
  
  const representativeId = representative === null ? null : await resolveRepresentative(representative ?? undefined);
  const policyStatus = rest.endDate ? determineStatus(rest.endDate, status) : status;

  const updatePayload: Partial<typeof insurancePolicyTable.$inferInsert> = {};
  const entries = Object.entries(rest) as Array<[
    keyof UpdatePolicyInput,
    UpdatePolicyInput[keyof UpdatePolicyInput],
  ]>;
  for (const [key, value] of entries) {
    if (value === undefined) continue;
    switch (key) {
      case "type":
        updatePayload.type = value as "individual" | "collective";
        break;
      case "insurer":
        updatePayload.insurer = value as string;
        break;
      case "policyNumber":
        updatePayload.policyNumber = value as string;
        break;
      case "startDate":
        updatePayload.startDate = normalizeDate(value as string);
        break;
      case "endDate":
        updatePayload.endDate = normalizeDate(value as string);
        break;
      case "coverageType":
        updatePayload.coverageType = value as string;
        break;
      case "notes":
        updatePayload.notes = value as string;
        break;
      default:
        break;
    }
  }

  if (policyStatus) {
    updatePayload.status = policyStatus;
  }
  if (representative === null) {
    updatePayload.representativeId = null;
  } else if (representativeId) {
    updatePayload.representativeId = representativeId;
  }

  await db
    .update(insurancePolicyTable)
    .set(updatePayload)
    .where(eq(insurancePolicyTable.id, id));

  if (vehicles) {
    await assignVehicles(id, vehicles);
  }

  return getPolicy(id);
}

export async function deletePolicy(id: string): Promise<void> {
  const result = await db
    .update(insurancePolicyTable)
    .set({ status: "cancelled" })
    .where(eq(insurancePolicyTable.id, id));
  if (result.rowsAffected === 0) {
    throw new InsuranceError("Policy not found", Status.NOT_FOUND);
  }
}

export async function getPolicy(id: string): Promise<PolicyDetail | null> {
  const [policyRow] = await db
    .select({
      id: insurancePolicyTable.id,
      type: insurancePolicyTable.type,
      status: insurancePolicyTable.status,
      insurer: insurancePolicyTable.insurer,
      policyNumber: insurancePolicyTable.policyNumber,
      coverageType: insurancePolicyTable.coverageType,
      notes: insurancePolicyTable.notes,
      startDate: insurancePolicyTable.startDate,
      endDate: insurancePolicyTable.endDate,
      representativeId: insurancePolicyTable.representativeId,
      representativeName: insuranceRepresentativeTable.name,
      representativePhone: insuranceRepresentativeTable.phone,
      representativeEmail: insuranceRepresentativeTable.email,
      createdAt: insurancePolicyTable.created_at,
      updatedAt: insurancePolicyTable.updated_at,
    })
    .from(insurancePolicyTable)
    .leftJoin(
      insuranceRepresentativeTable,
      eq(insurancePolicyTable.representativeId, insuranceRepresentativeTable.id),
    )
    .where(eq(insurancePolicyTable.id, id));

  if (!policyRow) return null;

  const vehicles = await listPolicyVehicles(id);
  const renewals = await db
    .select()
    .from(insurancePolicyRenewalTable)
    .where(eq(insurancePolicyRenewalTable.policyId, id))
    .orderBy(insurancePolicyRenewalTable.created_at);

  const activeVehicles = vehicles.filter((vehicle) => vehicle.isCurrent).length;
  const daysToExpire = Math.ceil(
    (new Date(policyRow.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const detail: PolicyDetail = {
    id: policyRow.id,
    type: policyRow.type as "individual" | "collective",
    status: policyRow.status as "active" | "expired" | "cancelled",
    insurer: policyRow.insurer,
    policyNumber: policyRow.policyNumber,
    coverageType: policyRow.coverageType ?? undefined,
    notes: policyRow.notes ?? undefined,
    startDate: policyRow.startDate,
    endDate: policyRow.endDate,
    representative: policyRow.representativeId
      ? {
          id: policyRow.representativeId,
          name: policyRow.representativeName ?? "",
          phone: policyRow.representativePhone ?? undefined,
          email: policyRow.representativeEmail ?? undefined,
        }
      : undefined,
    vehiclesCount: activeVehicles,
    daysToExpire,
    createdAt: policyRow.createdAt,
    updatedAt: policyRow.updatedAt,
    vehicles,
    renewals,
  };

  return detail;
}

export async function assignVehicles(id: string, assignments: VehicleAssignmentInput[]) {
  if (!assignments?.length) return { message: "No assignments provided" };
  await assignVehiclesInternal(id, assignments);
  return { message: "Vehicles assigned" };
}

export async function removeVehicle(policyId: string, vehicleId: string) {
  await db
    .update(vehicleInsuranceTable)
    .set({
      isCurrent: false,
      unassignedAt: nowIso(),
    })
    .where(
      and(
        eq(vehicleInsuranceTable.policyId, policyId),
        eq(vehicleInsuranceTable.vehicleId, vehicleId),
        eq(vehicleInsuranceTable.isCurrent, true),
      ),
    );
  return { message: "Vehicle removed from policy" };
}

export async function listPolicyVehicles(policyId: string): Promise<PolicyVehicle[]> {
  const rows = await db
    .select({
      vehicleId: vehicleTable.id,
      make: vehicleTable.make,
      model: vehicleTable.model,
      year: vehicleTable.year,
      licensePlate: vehicleTable.licensePlate,
      color: vehicleTable.color,
      assignedAt: vehicleInsuranceTable.assignedAt,
      unassignedAt: vehicleInsuranceTable.unassignedAt,
      isCurrent: vehicleInsuranceTable.isCurrent,
      premiumAmount: vehicleInsuranceTable.premiumAmount,
    })
    .from(vehicleInsuranceTable)
    .innerJoin(vehicleTable, eq(vehicleInsuranceTable.vehicleId, vehicleTable.id))
    .where(eq(vehicleInsuranceTable.policyId, policyId))
    .orderBy(desc(vehicleInsuranceTable.isCurrent), desc(vehicleInsuranceTable.assignedAt));
  return rows.map((record) => ({
    ...record,
    isCurrent: Boolean(record.isCurrent),
  }));
}

export async function renewPolicy(id: string, payload: RenewPolicyInput): Promise<PolicyDetail | null> {
  const policy = await getPolicy(id);
  if (!policy) {
    throw new InsuranceError("Policy not found", Status.NOT_FOUND);
  }

  const newStartDate = normalizeDate(payload.newStartDate);
  const newEndDate = normalizeDate(payload.newEndDate);
  
  // Validate date range for renewal
  validateDateRange(newStartDate, newEndDate);
  
  // Validate that renewal start date is not before current end date
  const currentEndDate = new Date(policy.endDate);
  const renewalStartDate = new Date(newStartDate);
  
  if (renewalStartDate < currentEndDate) {
    throw new InsuranceError(
      "Renewal start date cannot be before current policy end date",
      Status.BAD_REQUEST
    );
  }
  
  // If extending to vehicles, validate no overlaps for assigned vehicles
  if (payload.extendToVehicles) {
    for (const vehicle of policy.vehicles.filter(v => v.isCurrent)) {
      await validateVehicleInsuranceOverlap(vehicle.vehicleId, newStartDate, newEndDate, id);
    }
  }

  await db
    .insert(insurancePolicyRenewalTable)
    .values({
      policyId: id,
      previousEndDate: policy.endDate,
      newStartDate,
      newEndDate,
      notes: payload.notes,
      performedBy: payload.performedBy,
    })
    .run();

  const status = determineStatus(newEndDate);

  await db
    .update(insurancePolicyTable)
    .set({
      startDate: newStartDate,
      endDate: newEndDate,
      status,
    })
    .where(eq(insurancePolicyTable.id, id));

  if (payload.extendToVehicles) {
    await db
      .update(vehicleInsuranceTable)
      .set({ assignedAt: newStartDate })
      .where(and(eq(vehicleInsuranceTable.policyId, id), eq(vehicleInsuranceTable.isCurrent, true)))
      .run();
  }

  return getPolicy(id);
}

export async function renewPoliciesBulk(payload: RenewPoliciesBulkInput): Promise<PolicyDetail[]> {
  const results: PolicyDetail[] = [];
  for (const policyId of payload.policyIds) {
    const result = await renewPolicy(policyId, {
      newStartDate: payload.newStartDate,
      newEndDate: payload.newEndDate,
      notes: payload.notes,
      performedBy: payload.performedBy,
      extendToVehicles: payload.extendToVehicles,
    });
    if (result) results.push(result);
  }
  return results;
}

export async function getInsuranceReport(range: InsuranceReportFilters = {}): Promise<InsuranceReport> {
  const todayIso = new Date().toISOString().slice(0, 10);
  const expiryThreshold = range.expiresWithinDays
    ? new Date(Date.now() + range.expiresWithinDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
        : undefined;

  const vehiclesWithoutPolicy = await db
    .select({
      id: vehicleTable.id,
      make: vehicleTable.make,
      model: vehicleTable.model,
      year: vehicleTable.year,
      licensePlate: vehicleTable.licensePlate,
    })
    .from(vehicleTable)
    .where(
      sql`NOT EXISTS (SELECT 1 FROM ${vehicleInsuranceTable} vip WHERE vip.vehicle_id = ${vehicleTable.id} AND vip.is_current = 1)`,
    );

  const vehiclesWithExpiredPolicy = await db
    .select({
      vehicleId: vehicleTable.id,
      licensePlate: vehicleTable.licensePlate,
      make: vehicleTable.make,
      model: vehicleTable.model,
      policyId: insurancePolicyTable.id,
      policyNumber: insurancePolicyTable.policyNumber,
      insurer: insurancePolicyTable.insurer,
      endDate: insurancePolicyTable.endDate,
    })
    .from(vehicleInsuranceTable)
    .innerJoin(vehicleTable, eq(vehicleInsuranceTable.vehicleId, vehicleTable.id))
    .innerJoin(insurancePolicyTable, eq(vehicleInsuranceTable.policyId, insurancePolicyTable.id))
    .where(
      and(
        eq(vehicleInsuranceTable.isCurrent, true),
        lt(insurancePolicyTable.endDate, todayIso),
      ),
    );

  const upcomingExpirations = expiryThreshold
    ? await db
        .select({
          id: insurancePolicyTable.id,
          policyNumber: insurancePolicyTable.policyNumber,
          insurer: insurancePolicyTable.insurer,
          endDate: insurancePolicyTable.endDate,
          type: insurancePolicyTable.type,
        })
        .from(insurancePolicyTable)
        .where(
          and(
            eq(insurancePolicyTable.status, "active"),
            lte(insurancePolicyTable.endDate, expiryThreshold),
            gt(insurancePolicyTable.endDate, todayIso),
          ),
        )
    : [];

  const expiredPolicies = await db
    .select({
      id: insurancePolicyTable.id,
      policyNumber: insurancePolicyTable.policyNumber,
      insurer: insurancePolicyTable.insurer,
      endDate: insurancePolicyTable.endDate,
      type: insurancePolicyTable.type,
    })
    .from(insurancePolicyTable)
    .where(lt(insurancePolicyTable.endDate, todayIso));

  return {
    vehiclesWithoutPolicy,
    vehiclesWithExpiredPolicy,
    upcomingExpirations,
    expiredPolicies,
  };
}

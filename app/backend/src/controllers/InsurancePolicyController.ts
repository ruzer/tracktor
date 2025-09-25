import { Request, Response } from "express";
import { Status } from "@exceptions/ServiceError.js";
import { InsuranceError } from "@exceptions/InsuranceError.js";
import {
  assignVehicles,
  createPolicy,
  deletePolicy,
  getInsuranceReport,
  getPolicy,
  listPolicies,
  listPolicyVehicles,
  removeVehicle,
  renewPoliciesBulk,
  renewPolicy,
  updatePolicy,
} from "@services/insurancePolicyService.js";

const parseVehicleAssignments = (body: unknown) => {
  if (!body || typeof body !== "object") return [];
  const payload = body as Record<string, unknown>;
  if (Array.isArray(payload.vehicles)) {
    return payload.vehicles.map((item) =>
      typeof item === "object" && item
        ? {
            vehicleId: String((item as Record<string, unknown>).vehicleId),
            premiumAmount: (item as Record<string, unknown>).premiumAmount as number | undefined,
          }
        : null,
    ).filter(Boolean) as { vehicleId: string; premiumAmount?: number }[];
  }
  if (Array.isArray(payload.vehicleIds)) {
    return (payload.vehicleIds as unknown[]).map((id) => ({ vehicleId: String(id) }));
  }
  return [];
};

export const listPoliciesController = async (req: Request, res: Response) => {
  const { type, status, expiresBefore, search } = req.query;
  const policies = await listPolicies({
    type: type === "collective" || type === "individual" ? type : undefined,
    status:
      status === "active" || status === "expired" || status === "cancelled"
        ? status
        : undefined,
    expiresBefore: typeof expiresBefore === "string" ? expiresBefore : undefined,
    search: typeof search === "string" ? search : undefined,
  });
  res.json(policies);
};

export const createPolicyController = async (req: Request, res: Response) => {
  const { type, insurer, policyNumber, startDate, endDate } = req.body || {};
  if (!type || !insurer || !policyNumber || !startDate || !endDate) {
    throw new InsuranceError("Missing required fields", Status.BAD_REQUEST);
  }
  const policy = await createPolicy({
    type,
    insurer,
    policyNumber,
    coverageType: req.body.coverageType,
    notes: req.body.notes,
    startDate,
    endDate,
    status: req.body.status,
    representative: req.body.representative,
    vehicles: parseVehicleAssignments(req.body),
  });
  res.status(201).json(policy);
};

export const getPolicyController = async (req: Request, res: Response) => {
  const policy = await getPolicy(req.params.id!);
  if (!policy) {
    return res.status(Status.NOT_FOUND).json({ message: "Policy not found" });
  }
  res.json(policy);
};

export const updatePolicyController = async (req: Request, res: Response) => {
  const updated = await updatePolicy(req.params.id!, {
    type: req.body.type,
    insurer: req.body.insurer,
    policyNumber: req.body.policyNumber,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    coverageType: req.body.coverageType,
    notes: req.body.notes,
    status: req.body.status,
    representative: req.body.representative,
    vehicles: req.body.vehicles ? parseVehicleAssignments(req.body) : undefined,
  });
  res.json(updated);
};

export const deletePolicyController = async (req: Request, res: Response) => {
  await deletePolicy(req.params.id!);
  res.status(204).send();
};

export const assignVehiclesController = async (req: Request, res: Response) => {
  const assignments = parseVehicleAssignments(req.body);
  if (!assignments.length) {
    throw new InsuranceError("vehicles[] or vehicleIds[] required", Status.BAD_REQUEST);
  }
  const result = await assignVehicles(req.params.id!, assignments);
  res.json(result);
};

export const removeVehicleController = async (req: Request, res: Response) => {
  const { id, vehicleId } = req.params;
  const result = await removeVehicle(id!, vehicleId!);
  res.json(result);
};

export const listPolicyVehiclesController = async (req: Request, res: Response) => {
  const rows = await listPolicyVehicles(req.params.id!);
  res.json(rows);
};

export const renewPolicyController = async (req: Request, res: Response) => {
  const { newStartDate, newEndDate } = req.body || {};
  if (!newStartDate || !newEndDate) {
    throw new InsuranceError("newStartDate and newEndDate are required", Status.BAD_REQUEST);
  }
  const policy = await renewPolicy(req.params.id!, {
    newStartDate,
    newEndDate,
    notes: req.body.notes,
    performedBy: req.body.performedBy,
    extendToVehicles: req.body.extendToVehicles ?? true,
  });
  res.json(policy);
};

export const renewPoliciesBulkController = async (req: Request, res: Response) => {
  const { policyIds, newStartDate, newEndDate } = req.body || {};
  if (!Array.isArray(policyIds) || policyIds.length === 0) {
    throw new InsuranceError("policyIds[] is required", Status.BAD_REQUEST);
  }
  if (!newStartDate || !newEndDate) {
    throw new InsuranceError("newStartDate and newEndDate are required", Status.BAD_REQUEST);
  }
  const policies = await renewPoliciesBulk({
    policyIds: policyIds.map(String),
    newStartDate,
    newEndDate,
    notes: req.body.notes,
    performedBy: req.body.performedBy,
    extendToVehicles: req.body.extendToVehicles ?? true,
  });
  res.json(policies);
};

export const insuranceReportController = async (req: Request, res: Response) => {
  const expiresWithin = req.query.expiresWithinDays;
  const report = await getInsuranceReport({
    expiresWithinDays:
      typeof expiresWithin === "string" && expiresWithin.length > 0
        ? Number(expiresWithin)
        : undefined,
  });
  res.json(report);
};

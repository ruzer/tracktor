import * as schema from "@db/schema/index.js";
import { db } from "@db/index.js";
import { and, eq, inArray } from "drizzle-orm";

export const createPolicy = async (data: { type: 'group'|'individual'; provider: string; policyNumber: string; coverageType?: string; startDate: string; endDate: string; cost?: number; notes?: string }) => {
  const inserted = await db.insert(schema.insurancePolicyTable).values(data).returning();
  return { id: inserted[0]?.id, message: 'Policy created' };
};

export const listPolicies = async () => {
  return db.query.insurancePolicyTable.findMany();
};

export const getPolicy = async (id: string) => {
  return db.query.insurancePolicyTable.findFirst({ where: (t, { eq }) => eq(t.id, id) });
};

export const assignVehicles = async (policyId: string, vehicleIds: string[]) => {
  const values = vehicleIds.map((vehicleId) => ({ policyId, vehicleId }));
  await db.insert(schema.insurancePolicyVehicleTable).values(values).onConflictDoNothing().run();
  return { message: 'Vehicles assigned' };
};

export const removeVehicle = async (policyId: string, vehicleId: string) => {
  await db.delete(schema.insurancePolicyVehicleTable).where(and(eq(schema.insurancePolicyVehicleTable.policyId, policyId), eq(schema.insurancePolicyVehicleTable.vehicleId, vehicleId)));
  return { message: 'Vehicle removed from policy' };
};

export const listPolicyVehicles = async (policyId: string) => {
  return db.query.insurancePolicyVehicleTable.findMany({ where: (t, { eq }) => eq(t.policyId, policyId) });
};


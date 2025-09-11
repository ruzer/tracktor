import { VehicleError } from "@exceptions/VehicleError.js";
import { Status } from "@exceptions/ServiceError.js";
import * as schema from "@db/schema/index.js";
import { db } from "@db/index.js";
import { and, eq } from "drizzle-orm";

export const listAssignments = async (vehicleId: string) => {
  const v = await db.query.vehicleTable.findFirst({ where: (t, { eq }) => eq(t.id, vehicleId) });
  if (!v) throw new VehicleError("Vehicle not found", Status.NOT_FOUND);
  return db.query.vehicleAssignmentTable.findMany({ where: (t, { eq }) => eq(t.vehicleId, vehicleId), orderBy: (t, { desc }) => [desc(t.isCurrent), desc(t.startDate)] });
};

export const addAssignment = async (
  vehicleId: string,
  data: { assigneeName?: string; assigneeRole?: string; area?: string; unit?: string; startDate: string; isCurrent?: boolean; notes?: string },
) => {
  const v = await db.query.vehicleTable.findFirst({ where: (t, { eq }) => eq(t.id, vehicleId) });
  if (!v) throw new VehicleError("Vehicle not found", Status.NOT_FOUND);
  if (data.isCurrent) {
    await db.update(schema.vehicleAssignmentTable).set({ isCurrent: 0 }).where(and(eq(schema.vehicleAssignmentTable.vehicleId, vehicleId), eq(schema.vehicleAssignmentTable.isCurrent, 1 as any)));
  }
  const inserted = await db.insert(schema.vehicleAssignmentTable).values({ vehicleId, ...data, isCurrent: !!data.isCurrent }).returning();
  return { id: inserted[0]?.id, message: "Assignment created" };
};

export const closeAssignment = async (vehicleId: string, assignmentId: string, endDate?: string) => {
  const a = await db.query.vehicleAssignmentTable.findFirst({ where: (t, { eq, and }) => and(eq(t.id, assignmentId), eq(t.vehicleId, vehicleId)) });
  if (!a) throw new VehicleError("Assignment not found", Status.NOT_FOUND);
  await db.update(schema.vehicleAssignmentTable).set({ endDate: endDate || new Date().toISOString().slice(0, 10), isCurrent: 0 }).where(eq(schema.vehicleAssignmentTable.id, assignmentId));
  return { message: "Assignment closed" };
};


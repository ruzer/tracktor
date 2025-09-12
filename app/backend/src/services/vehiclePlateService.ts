import { VehicleError } from "@exceptions/VehicleError.js";
import { Status } from "@exceptions/ServiceError.js";
import * as schema from "@db/schema/index.js";
import { db } from "@db/index.js";
import { and, eq } from "drizzle-orm";

export const listPlates = async (vehicleId: string) => {
  const vehicle = await db.query.vehicleTable.findFirst({
    where: (t, { eq }) => eq(t.id, vehicleId),
  });
  if (!vehicle) throw new VehicleError("Vehicle not found", Status.NOT_FOUND);
  return db.query.vehiclePlateTable.findMany({
    where: (t, { eq }) => eq(t.vehicleId, vehicleId),
    orderBy: (t, { desc }) => [desc(t.isCurrent), desc(t.issuedDate)],
  });
};

export const addPlate = async (
  vehicleId: string,
  data: {
    plate: string;
    issuedDate?: string;
    reason?: string;
    isCurrent?: boolean;
  },
) => {
  const vehicle = await db.query.vehicleTable.findFirst({
    where: (t, { eq }) => eq(t.id, vehicleId),
  });
  if (!vehicle) throw new VehicleError("Vehicle not found", Status.NOT_FOUND);

  if (data.isCurrent) {
    // unset previous current
    await db
      .update(schema.vehiclePlateTable)
      .set({ isCurrent: false })
      .where(
        and(
          eq(schema.vehiclePlateTable.vehicleId, vehicleId),
          eq(schema.vehiclePlateTable.isCurrent, true),
        ),
      );
  }

  const inserted = await db
    .insert(schema.vehiclePlateTable)
    .values({
      vehicleId,
      plate: data.plate,
      issuedDate: data.issuedDate,
      reason: data.reason,
      isCurrent: !!data.isCurrent,
    })
    .returning();
  return { id: inserted[0]?.id, message: "Plate added" };
};

export const markCurrent = async (vehicleId: string, plateId: string) => {
  const plate = await db.query.vehiclePlateTable.findFirst({
    where: (t, { eq, and }) =>
      and(eq(t.id, plateId), eq(t.vehicleId, vehicleId)),
  });
  if (!plate) throw new VehicleError("Plate not found", Status.NOT_FOUND);
  await db
    .update(schema.vehiclePlateTable)
    .set({ isCurrent: false })
    .where(
      and(
        eq(schema.vehiclePlateTable.vehicleId, vehicleId),
        eq(schema.vehiclePlateTable.isCurrent, true),
      ),
    );
  await db
    .update(schema.vehiclePlateTable)
    .set({ isCurrent: true })
    .where(eq(schema.vehiclePlateTable.id, plateId));
  return { message: "Current plate updated" };
};

export const retirePlate = async (
  vehicleId: string,
  plateId: string,
  data: { retiredDate?: string; reason?: string },
) => {
  const plate = await db.query.vehiclePlateTable.findFirst({
    where: (t, { eq, and }) =>
      and(eq(t.id, plateId), eq(t.vehicleId, vehicleId)),
  });
  if (!plate) throw new VehicleError("Plate not found", Status.NOT_FOUND);
  await db
    .update(schema.vehiclePlateTable)
    .set({
      retiredDate: data.retiredDate,
      reason: data.reason,
      isCurrent: false,
    })
    .where(eq(schema.vehiclePlateTable.id, plateId));
  return { message: "Plate retired" };
};

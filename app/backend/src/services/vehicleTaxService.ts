import * as schema from "@db/schema/index.js";
import { db } from "@db/index.js";
import { and, eq } from "drizzle-orm";

export const listTaxes = async (vehicleId: string) => {
  return db.query.vehicleTaxTable.findMany({ where: (t, { eq }) => eq(t.vehicleId, vehicleId), orderBy: (t, { desc }) => [desc(t.year)] });
};

export const upsertTax = async (
  vehicleId: string,
  data: { type: string; year: number; amount?: number; paid?: boolean; paidDate?: string; receiptFolio?: string; notes?: string },
) => {
  const exists = await db.query.vehicleTaxTable.findFirst({
    where: (t, { and, eq }) => and(eq(t.vehicleId, vehicleId), eq(t.type, data.type), eq(t.year, data.year)),
  });
  if (exists) {
    await db
      .update(schema.vehicleTaxTable)
      .set({ amount: data.amount, paid: !!data.paid, paidDate: data.paidDate, receiptFolio: data.receiptFolio, notes: data.notes })
      .where(eq(schema.vehicleTaxTable.id, exists.id));
    return { message: "Tax updated" };
  }
  const inserted = await db
    .insert(schema.vehicleTaxTable)
    .values({ vehicleId, ...data, paid: !!data.paid })
    .returning();
  return { id: inserted[0]?.id, message: "Tax added" };
};

export const markPaid = async (vehicleId: string, id: string, paidDate?: string) => {
  await db
    .update(schema.vehicleTaxTable)
    .set({ paid: true, paidDate: paidDate || new Date().toISOString().slice(0, 10) })
    .where(and(eq(schema.vehicleTaxTable.id, id), eq(schema.vehicleTaxTable.vehicleId, vehicleId)));
  return { message: "Tax marked as paid" };
};

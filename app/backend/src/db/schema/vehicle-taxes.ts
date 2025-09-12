import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { vehicleTable } from "./vehicle.js";
import { timestamps } from "./audit.helper.js";

export const vehicleTaxTable = table("vehicle_taxes", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: t
    .text()
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  type: t.text().notNull(), // e.g., 'tenencia'
  year: t.integer().notNull(),
  amount: t.real(),
  paid: t.integer({ mode: "boolean" }).notNull().default(false),
  paidDate: t.text(),
  receiptFolio: t.text(),
  notes: t.text(),
  ...timestamps,
});

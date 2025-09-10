import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { vehicleTable } from "./vehicle.js";
import { timestamps } from "./audit.helper.js";

export const fuelLogTable = table("fuel_logs", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: t
    .text()
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  date: t.text().notNull(),
  odometer: t.integer().notNull(),
  fuelAmount: t.real().notNull(),
  cost: t.real().notNull(),
  filled: t.integer({ mode: "boolean" }).notNull(),
  missedLast: t.integer({ mode: "boolean" }).notNull(),
  notes: t.text(),
  ...timestamps,
});

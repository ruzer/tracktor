import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { vehicleTable } from "./vehicle.js";
import { timestamps } from "./audit.helper.js";

export const invoiceTable = table("invoices", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fileUrl: t.text().notNull(),
  amount: t.real(),
  issuedAt: t.text(),
  provider: t.text(),
  ...timestamps,
});

export const serviceOrderTable = table("service_orders", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: t
    .text()
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  description: t.text().notNull(),
  provider: t.text(),
  estimatedCost: t.real(),
  finalCost: t.real(),
  invoiceId: t
    .text()
    .references(() => invoiceTable.id, { onDelete: "set null" }),
  ...timestamps,
});

export const vehicleMaintenanceTable = table("vehicle_maintenance", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: t
    .text()
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  title: t.text().notNull(),
  notes: t.text(),
  status: t.text().notNull().default("pending"),
  serviceOrderId: t
    .text()
    .references(() => serviceOrderTable.id, { onDelete: "set null" }),
  invoiceId: t
    .text()
    .references(() => invoiceTable.id, { onDelete: "set null" }),
  ...timestamps,
});

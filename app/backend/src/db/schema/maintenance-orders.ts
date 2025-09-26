import { sqliteTable as table, index } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { vehicleTable } from "./vehicle.js";
import { timestamps } from "./audit.helper.js";

const ORDER_STATUSES = [
  "pending_review",
  "quotation",
  "authorized",
  "rejected",
  "in_workshop",
  "in_repair",
  "repaired_pending_payment",
  "closed",
] as const;

const PAYMENT_STATUSES = ["pending", "partial", "paid"] as const;

export const workshopTable = table("workshops", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.text().notNull(),
  contactName: t.text(),
  contactPhone: t.text(),
  contactEmail: t.text(),
  address: t.text(),
  notes: t.text(),
  ...timestamps,
});

export const maintenanceOrderTable = table(
  "maintenance_orders",
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    vehicleId: t
      .text()
      .notNull()
      .references(() => vehicleTable.id, { onDelete: "cascade" }),
    reportedIssue: t.text().notNull(),
    status: t
      .text()
      .notNull()
      .default("pending_review")
      .$type<(typeof ORDER_STATUSES)[number]>(),
    workshopId: t
      .text()
      .references(() => workshopTable.id, { onDelete: "set null" }),
    quoteFile: t.text(),
    invoiceFile: t.text(),
    authorizedBy: t.text(),
    authorizedAt: t.text(),
    totalEstimated: t.real(),
    totalFinal: t.real(),
    paymentStatus: t
      .text()
      .notNull()
      .default("pending")
      .$type<(typeof PAYMENT_STATUSES)[number]>(),
    createdBy: t.text().notNull(),
    ...timestamps,
  },
  (table) => ({
    vehicleStatusIdx: index("maintenance_order_vehicle_status_idx").on(
      table.vehicleId,
      table.status,
    ),
  }),
);

export const maintenanceOrderHistoryTable = table(
  "maintenance_order_history",
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: t
      .text()
      .notNull()
      .references(() => maintenanceOrderTable.id, { onDelete: "cascade" }),
    status: t
      .text()
      .notNull()
      .$type<(typeof ORDER_STATUSES)[number]>(),
    notes: t.text(),
    userId: t.text(),
    ...timestamps,
  },
  (table) => ({
    historyOrderIdx: index("maintenance_order_history_order_idx").on(table.orderId),
  }),
);

export type MaintenanceOrderStatus = (typeof ORDER_STATUSES)[number];
export type MaintenancePaymentStatus = (typeof PAYMENT_STATUSES)[number];

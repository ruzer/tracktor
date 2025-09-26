import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { vehicleTable } from "./vehicle.js";
import { timestamps } from "./audit.helper.js";

export const maintenanceLogTable = table("maintenance_logs", {
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
  serviceCenter: t.text().notNull(),
  cost: t.real().notNull(),
  notes: t.text(),
  // Campos de integración con órdenes
  relatedOrderId: t.text(), // ID de la orden que generó este registro
  autoGenerateOrder: t.integer().default(0), // 1 si debe generar orden automáticamente
  generatedOrderId: t.text(), // ID de la orden generada automáticamente
  ...timestamps,
});

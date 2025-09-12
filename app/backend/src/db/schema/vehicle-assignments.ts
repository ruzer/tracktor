import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { vehicleTable } from "./vehicle.js";
import { timestamps } from "./audit.helper.js";

export const vehicleAssignmentTable = table("vehicle_assignments", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: t
    .text()
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  assigneeName: t.text(),
  assigneeRole: t.text(),
  area: t.text(),
  unit: t.text(),
  startDate: t.text().notNull(),
  endDate: t.text(),
  isCurrent: t.integer({ mode: "boolean" }).notNull().default(false),
  notes: t.text(),
  ...timestamps,
});

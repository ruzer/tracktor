import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { vehicleTable } from "./vehicle.js";
import { timestamps } from "./audit.helper.js";

export const vehiclePlateTable = table("vehicle_plates", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: t
    .text()
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  plate: t.text().notNull(),
  issuedDate: t.text(),
  retiredDate: t.text(),
  reason: t.text(),
  isCurrent: t.integer({ mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

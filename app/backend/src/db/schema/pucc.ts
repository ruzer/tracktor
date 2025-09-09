import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { vehicleTable } from "./vehicle";

export const pollutionCertificateTable = table("pollution_certificates", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: t
    .text()
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  certificateNumber: t.text().notNull(),
  issueDate: t.integer({ mode: "timestamp" }).notNull(),
  expiryDate: t.integer({ mode: "timestamp" }).notNull(),
  testingCenter: t.text().notNull(),
  notes: t.text(),
});

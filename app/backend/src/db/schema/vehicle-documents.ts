import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { vehicleTable } from "./vehicle.js";
import { timestamps } from "./audit.helper.js";

export const vehicleDocumentTable = table("vehicle_documents", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: t
    .text()
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  docType: t.text().notNull(),
  issueDate: t.text(),
  expiryDate: t.text(),
  filePath: t.text().notNull(),
  fileHash: t.text(),
  notes: t.text(),
  ...timestamps,
});

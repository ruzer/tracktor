import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { timestamps } from "./audit.helper.js";
import { vehicleTable } from "./vehicle.js";

export const insurancePolicyTable = table("insurance_policies", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: t.text().notNull(), // 'group' | 'individual'
  provider: t.text().notNull(),
  policyNumber: t.text().notNull(),
  coverageType: t.text(),
  startDate: t.text().notNull(),
  endDate: t.text().notNull(),
  cost: t.real(),
  notes: t.text(),
  ...timestamps,
});

export const insurancePolicyVehicleTable = table(
  "insurance_policy_vehicles",
  {
    policyId: t
      .text()
      .notNull()
      .references(() => insurancePolicyTable.id, { onDelete: "cascade" }),
    vehicleId: t
      .text()
      .notNull()
      .references(() => vehicleTable.id, { onDelete: "cascade" }),
  }
);


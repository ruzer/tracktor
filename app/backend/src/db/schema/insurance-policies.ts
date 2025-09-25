import { sqliteTable as table, index } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { timestamps } from "./audit.helper.js";
import { vehicleTable } from "./vehicle.js";

const POLICY_TYPES = ["individual", "collective"] as const;
const POLICY_STATUSES = ["active", "expired", "cancelled"] as const;

export const insuranceRepresentativeTable = table(
  "insurance_representatives",
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: t.text().notNull(),
    phone: t.text(),
    email: t.text(),
    insurer: t.text(),
    ...timestamps,
  },
);

export const insurancePolicyTable = table("insurance_policies", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: t
    .text()
    .notNull()
    .$type<(typeof POLICY_TYPES)[number]>(),
  status: t
    .text()
    .notNull()
    .default("active")
    .$type<(typeof POLICY_STATUSES)[number]>(),
  insurer: t.text().notNull(),
  policyNumber: t.text().notNull(),
  coverageType: t.text(),
  notes: t.text(),
  startDate: t.text().notNull(),
  endDate: t.text().notNull(),
  representativeId: t
    .text()
    .references(() => insuranceRepresentativeTable.id, {
      onDelete: "set null",
    }),
  createdBy: t.text(),
  ...timestamps,
});

export const insurancePolicyRenewalTable = table("insurance_policy_renewals", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  policyId: t
    .text()
    .notNull()
    .references(() => insurancePolicyTable.id, { onDelete: "cascade" }),
  previousEndDate: t.text().notNull(),
  newStartDate: t.text().notNull(),
  newEndDate: t.text().notNull(),
  notes: t.text(),
  performedBy: t.text(),
  ...timestamps,
});

export const vehicleInsuranceTable = table("vehicle_insurance", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  policyId: t
    .text()
    .notNull()
    .references(() => insurancePolicyTable.id, { onDelete: "cascade" }),
  vehicleId: t
    .text()
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  assignedAt: t
    .text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  unassignedAt: t.text(),
  isCurrent: t.integer({ mode: "boolean" }).notNull().default(true),
  premiumAmount: t.real(),
  ...timestamps,
}, (table) => ({
  vehicleCurrentIdx: index("vehicle_insurance_vehicle_current_idx").on(
    table.vehicleId,
    table.isCurrent,
  ),
  policyCurrentIdx: index("vehicle_insurance_policy_current_idx").on(
    table.policyId,
    table.isCurrent,
  ),
}));

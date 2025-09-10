import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { timestamps } from "./audit.helper.js";

export const ownershipTypeTable = table("ownership_types", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.text().notNull().unique(),
  active: t.integer({ mode: "boolean" }).notNull().default(true),
  ...timestamps,
});


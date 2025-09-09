import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const configTable = table("config", {
  key: t.text().notNull().primaryKey(),
  value: t.text().notNull(),
  description: t.text(),
});

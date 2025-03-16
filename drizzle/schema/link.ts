import { sqliteTable } from "drizzle-orm/sqlite-core";

export const linkTable = sqliteTable('link', t => ({
  id: t.integer().primaryKey({ autoIncrement: true }),
  title: t.text().notNull(),
  url: t.text().notNull(),
}))

export type LinkInsert = typeof linkTable.$inferInsert

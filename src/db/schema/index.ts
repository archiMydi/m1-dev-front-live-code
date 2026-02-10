import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export * from "./auth-schema";
export * from "./missions-schema";

export const vehicle = sqliteTable("vehicle", {
	id: int("id").primaryKey({ autoIncrement: true }),
	vin: text("vin").notNull(),
	marque: text("marque").notNull(),
	model: text("model").notNull(),
});

import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const vehicles = sqliteTable("vehicles", {
	id: int("id").primaryKey({ autoIncrement: true }),
	plate: text("plate").notNull().unique(),
	model: text("model").notNull(),
	vin: text("vin"),
	marque: text("marque"),
});

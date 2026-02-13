import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const parts = sqliteTable("parts", {
	id: int("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	price: real("price").notNull(),
	createdAt: int("created_at", { mode: "timestamp" })
		.notNull()
		.$default(() => new Date()),
	updatedAt: int("updated_at", { mode: "timestamp" })
		.notNull()
		.$default(() => new Date())
		.$onUpdate(() => new Date()),
});

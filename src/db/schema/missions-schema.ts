import { sql } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { vehicles } from "./vehicles-schema";

export const missions = sqliteTable("missions", {
	id: int("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	customerId: int("customer_id").notNull(),
	vehicleId: int("vehicle_id")
		.notNull()
		.references(() => vehicles.id),
	userId: int("user_id").notNull(),
	startDate: int("start_date", { mode: "timestamp" }).notNull(),
	endDate: int("end_date", { mode: "timestamp" }).notNull(),
	partIds: text("part_ids")
		.notNull()
		.default("[]"),
	totalPrice: real("total_price").notNull(),
	status: text("status").notNull().default("planned"),
	createdAt: int("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: int("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

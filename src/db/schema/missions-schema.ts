import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { vehicle } from "./index";

export const mission = sqliteTable("mission", {
	id: int("id").primaryKey({ autoIncrement: true }),
	startDate: int("start_date", { mode: "timestamp" }).notNull(),
	endDate: int("end_date", { mode: "timestamp" }).notNull(),
	vehicleId: int("vehicle_id")
		.notNull()
		.references(() => vehicle.id),
	totalPrice: real("total_price").notNull(),
	createdAt: int("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: int("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const part = sqliteTable("part", {
	id: int("id").primaryKey({ autoIncrement: true }),
	missionId: int("mission_id")
		.notNull()
		.references(() => mission.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	price: real("price").notNull(),
});

export const missionRelations = relations(mission, ({ one, many }) => ({
	vehicle: one(vehicle, {
		fields: [mission.vehicleId],
		references: [vehicle.id],
	}),
	parts: many(part),
}));

export const partRelations = relations(part, ({ one }) => ({
	mission: one(mission, {
		fields: [part.missionId],
		references: [mission.id],
	}),
}));

import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export * from "./auth-schema";
export * from "./missions-schema";

export const garage = sqliteTable("garage", {
	id: int("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	address: text("address").notNull(),
	logoUrl: text("logo_url"),
	phone: text("phone").notNull(),
	email: text("email").notNull(),
	codeComptable: text("code_comptable").notNull(),
	formeJuridique: text("forme_juridique"),
	siret: text("siret").notNull(),
	ape: text("ape"),
	ownerId: int("owner_id")
		.notNull()
		.references(() => user.id),
});

export const garageMember = sqliteTable(
	"garage_member",
	{
		garageId: int("garage_id")
			.notNull()
			.references(() => garage.id),
		userId: int("user_id")
			.notNull()
			.references(() => user.id),
	},
	(t) => [primaryKey({ columns: [t.garageId, t.userId] })],
);

export const garageInvite = sqliteTable("garage_invite", {
	code: text("code").primaryKey(),
	createdAt: int("created_at", { mode: "timestamp" })
		.notNull()
		.$default(() => new Date()),
	expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
	garageId: int("garage_id")
		.notNull()
		.references(() => garage.id),
	userId: int("user_id")
		.notNull()
		.references(() => user.id),
});

export const vehicle = sqliteTable("vehicle", {
	id: int("id").primaryKey({ autoIncrement: true }),
	vin: text("vin").notNull(),
	marque: text("marque").notNull(),
	model: text("model").notNull(),
});

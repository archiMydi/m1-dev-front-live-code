import z from "zod";
import { baseProcedure, router } from "../init";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { customers } from "@/app/customers/data";
import { db, s } from "@/db";
import { takeFirst } from "@/db/utils";
import { asc, eq } from "drizzle-orm";

const missionStatusSchema = z.enum(["planned", "in-progress", "completed", "cancelled"]);

const parsePartIds = (value: string): number[] => {
	try {
		const parsed = JSON.parse(value);
		if (Array.isArray(parsed)) {
			return parsed.filter((id): id is number => typeof id === "number");
		}
		return [];
	} catch {
		return [];
	}
};

const mapMissionRecord = (record: {
	id: number;
	title: string;
	customerId: number;
	vehicleId: number;
	userId: number;
	startDate: Date;
	endDate: Date;
	partIds: string;
	totalPrice: number;
	status: string;
}) => ({
	id: record.id,
	title: record.title,
	customerId: record.customerId,
	vehicleId: record.vehicleId,
	userId: record.userId,
	start: record.startDate.toISOString(),
	end: record.endDate.toISOString(),
	parts: parsePartIds(record.partIds),
	totalPrice: record.totalPrice,
	status: record.status,
});

export const appRouter = router({
	example: baseProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.query(({ input }) => {
			return {
				greeting: `Hello, ${input.name}!`,
			};
		}),
	customers: {
		search: baseProcedure
			.input(
				z.object({
					q: z.string().nullish(),
				}),
			)
			.query(({ input }) => {
				const searchStr = input.q?.toLowerCase();

				if (!searchStr) return customers;

				return customers.filter((customer) => {
					return (
						customer.name.toLowerCase().includes(searchStr) ||
						customer.firstName.toLowerCase().includes(searchStr) ||
						customer.email.toLowerCase().includes(searchStr) ||
						customer.vehicles.some(
							(v) =>
								v.brand.toLowerCase().includes(searchStr) ||
								v.model.toLowerCase().includes(searchStr) ||
								v.plate.toLowerCase().includes(searchStr),
						)
					);
				});
			}),
	},
	missions: {
		list: baseProcedure.query(async () => {
			const records = await db
				.select()
				.from(s.missions)
				.orderBy(asc(s.missions.startDate));

			return records.map(mapMissionRecord);
		}),
		getById: baseProcedure
			.input(
				z.object({
					id: z.number(),
				}),
			)
			.query(async ({ input }) => {
				const record = await db
					.select()
					.from(s.missions)
					.where(eq(s.missions.id, input.id))
					.then(takeFirst);

				if (!record) return null;
				return mapMissionRecord(record);
			}),
		create: baseProcedure
			.input(
				z.object({
					title: z.string().min(1),
					customerId: z.number().int().positive(),
					userId: z.number().int().positive(),
					startDate: z.date(),
					endDate: z.date(),
					vehicleId: z.number().int().positive(),
					parts: z.array(z.number().int().positive()).default([]),
					totalPrice: z.number().nonnegative(),
					status: missionStatusSchema.default("planned"),
				}),
			)
			.mutation(async ({ input }) => {
				const created = await db
					.insert(s.missions)
					.values({
						title: input.title,
						customerId: input.customerId,
						userId: input.userId,
						startDate: input.startDate,
						endDate: input.endDate,
						vehicleId: input.vehicleId,
						partIds: JSON.stringify(input.parts),
						totalPrice: input.totalPrice,
						status: input.status,
					})
					.returning()
					.then(takeFirst);

				if (!created) return null;
				return mapMissionRecord(created);
			}),
	},
	vehicles: {
		list: baseProcedure.query(async () => {
			return await db.select().from(s.vehicles);
		}),
		create: baseProcedure
			.input(
				z.object({
					plate: z.string().min(1),
					model: z.string().min(1),
					vin: z.string().nullish(),
					marque: z.string().nullish(),
				}),
			)
			.mutation(async ({ input }) => {
				return await db
					.insert(s.vehicles)
					.values({
						plate: input.plate,
						model: input.model,
						vin: input.vin ?? undefined,
						marque: input.marque ?? undefined,
					})
					.returning();
			}),
	},
	parts: {
		list: baseProcedure.query(async () => {
			return await db.select().from(s.parts);
		}),
		create: baseProcedure
			.input(
				z.object({
					name: z.string().min(1),
					price: z.number().nonnegative(),
				}),
			)
			.mutation(async ({ input }) => {
				return await db
					.insert(s.parts)
					.values({
						name: input.name,
						price: input.price,
					})
					.returning();
			}),
	},
	garages: {
		create: baseProcedure
			.input(
				z.object({
					name: z.string(),
					address: z.string(),
					phone: z.string(),
					email: z.string().email(),
					codeComptable: z.string(),
					formeJuridique: z.string().nullish(),
					siret: z.string(),
					ape: z.string().nullish(),
				}),
			)
			.mutation(async ({ input }) => {
				const garage = await db
					.insert(s.garage)
					.values({
						name: input.name,
						address: input.address,
						phone: input.phone,
						email: input.email,
						codeComptable: input.codeComptable,
						formeJuridique: input.formeJuridique ?? undefined,
						siret: input.siret,
						ape: input.ape ?? undefined,
						ownerId: 1, // TODO: get from session
					})
					.returning()
					.then(takeFirst);

				return garage;
			}),
	},
});

export type AppRouter = typeof appRouter;

export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;

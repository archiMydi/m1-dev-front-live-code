import z from "zod";
import { publicProcedure, router } from "../init";
import { db, s } from "@/db";
import { takeFirst } from "@/db/utils";
import { asc, eq } from "drizzle-orm";
import type { MissionStatus } from "@/lib/types";

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

const normalizeMissionStatus = (value: string): MissionStatus => {
	if (
		value === "planned" ||
		value === "in-progress" ||
		value === "completed" ||
		value === "cancelled"
	) {
		return value;
	}
	return "planned";
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
	status: normalizeMissionStatus(record.status),
});

export const missionsRouter = router({
	list: publicProcedure.query(async () => {
		const records = await db.select().from(s.missions).orderBy(asc(s.missions.startDate));

		return records.map(mapMissionRecord);
	}),
	getById: publicProcedure
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
	create: publicProcedure
		.input(
			z.object({
				title: z.string().min(1),
				customerId: z.number().int().positive(),
				userId: z.number().int().positive(),
				start: z.string().datetime(),
				end: z.string().datetime(),
				vehicleId: z.number().int().positive(),
				parts: z.array(z.number().int().positive()).default([]),
				totalPrice: z.number().nonnegative(),
			}),
		)
		.mutation(async ({ input }) => {
			const created = await db
				.insert(s.missions)
				.values({
					title: input.title,
					customerId: input.customerId,
					userId: input.userId,
					startDate: new Date(input.start),
					endDate: new Date(input.end),
					vehicleId: input.vehicleId,
					partIds: JSON.stringify(input.parts),
					totalPrice: input.totalPrice,
				})
				.returning()
				.then(takeFirst);

			if (!created) return null;
			return mapMissionRecord(created);
		}),
	update: publicProcedure
		.input(
			z.object({
				id: z.number().int().positive(),
				title: z.string().min(1),
				customerId: z.number().int().positive(),
				userId: z.number().int().positive(),
				start: z.string().datetime(),
				end: z.string().datetime(),
				vehicleId: z.number().int().positive(),
				parts: z.array(z.number().int().positive()).default([]),
				totalPrice: z.number().nonnegative(),
				status: z
					.enum(["planned", "in-progress", "completed", "cancelled"])
					.default("planned"),
			}),
		)
		.mutation(async ({ input }) => {
			const updated = await db
				.update(s.missions)
				.set({
					title: input.title,
					customerId: input.customerId,
					userId: input.userId,
					startDate: new Date(input.start),
					endDate: new Date(input.end),
					vehicleId: input.vehicleId,
					partIds: JSON.stringify(input.parts),
					totalPrice: input.totalPrice,
					status: input.status,
				})
				.where(eq(s.missions.id, input.id))
				.returning()
				.then(takeFirst);

			if (!updated) return null;
			return mapMissionRecord(updated);
		}),
});

import z from "zod";
import { publicProcedure, router } from "../init";
import { db, s } from "@/db";

export const vehiclesRouter = router({
	list: publicProcedure.query(async () => {
		return await db.select().from(s.vehicles);
	}),
	create: publicProcedure
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
});

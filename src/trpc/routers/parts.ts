import z from "zod";
import { publicProcedure, router } from "../init";
import { db, s } from "@/db";
import { takeFirst } from "@/db/utils";
import { eq } from "drizzle-orm";

export const partsRouter = router({
	list: publicProcedure.query(async () => {
		return await db.select().from(s.parts);
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
				.from(s.parts)
				.where(eq(s.parts.id, input.id))
				.then(takeFirst);

			if (!record) return null;
			return record;
		}),
	create: publicProcedure
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
});

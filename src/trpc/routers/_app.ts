import z from "zod";
import { baseProcedure, router } from "../init";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { customers } from "@/app/customers/data";
import { start } from "repl";
import { db, s } from "@/db";
import { takeFirst } from "@/db/utils";

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
		create: baseProcedure
			.input(
				z.object({
					startDate: z.date(),
					endDate: z.date(),
					vehicleId: z.number(),
					totalPrice: z.number(),
				}),
			)
			.mutation(async ({ input }) => {
				return await db
					.insert(s.mission)
					.values({
						startDate: input.startDate,
						endDate: input.endDate,
						vehicleId: input.vehicleId,
						totalPrice: input.totalPrice,
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
					email: z.email(),
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

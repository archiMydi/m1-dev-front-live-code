import z from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { customers } from "@/app/customers/data";
import { start } from "repl";
import { db } from "@/db";
import { mission } from "@/db/schema";

export const appRouter = createTRPCRouter({
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
	searchCustomer: baseProcedure
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
					.insert(mission)
					.values({
						startDate: input.startDate,
						endDate: input.endDate,
						vehicleId: input.vehicleId,
						totalPrice: input.totalPrice,
					})
					.returning();
			}),
	},
});

export type AppRouter = typeof appRouter;

export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;

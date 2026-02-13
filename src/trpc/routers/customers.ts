import z from "zod";
import { publicProcedure, router } from "../init";
import { customers } from "@/app/customers/data";
import { get } from "http";
import { getBody } from "better-auth/react";

export const customersRouter = router({
	list: publicProcedure.query(() => {
		return customers;
	}),
	getById: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(({ input }) => {
			return customers.find((c) => c.id === input.id);
		}),
	search: publicProcedure
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
});

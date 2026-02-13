import { initTRPC } from "@trpc/server";
import { cache } from "react";
import { serverTransformer } from "./shared";

export const createTRPCContext = cache(async () => {
	/**
	 * @see: https://trpc.io/docs/server/context
	 */
	return {};
});

const t = initTRPC.create({
	/**
	 * @see https://trpc.io/docs/server/data-transformers
	 */
	transformer: serverTransformer,
});
// Base router and procedure helpers
export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

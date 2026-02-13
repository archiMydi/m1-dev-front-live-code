import { initTRPC, TRPCError } from "@trpc/server";
import { serverTransformer } from "./shared";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
	/**
	 * @see https://trpc.io/docs/server/data-transformers
	 */
	transformer: serverTransformer,
});
// Base router and procedure helpers
export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

export const authedProcedure = publicProcedure.use(
	t.middleware(({ ctx, next }) => {
		if (ctx.session == null || ctx.user == null) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				...ctx,
				user: ctx.user,
				session: ctx.session,
			},
		});
	}),
);

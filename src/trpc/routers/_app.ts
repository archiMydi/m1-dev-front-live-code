import { router } from "../init";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { garagesRouter } from "./garages";
import { customersRouter } from "./customers";
import { missionsRouter } from "./missions";
import { vehiclesRouter } from "./vehicles";
import { partsRouter } from "./parts";
import { usersRouter } from "./users";

export const appRouter = router({
	customers: customersRouter,
	missions: missionsRouter,
	vehicles: vehiclesRouter,
	parts: partsRouter,
	garages: garagesRouter,
	users: usersRouter,
});

export type AppRouter = typeof appRouter;

export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;

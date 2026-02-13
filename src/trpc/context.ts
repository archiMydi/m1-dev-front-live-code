import { auth } from "@/lib/auth";

export async function createContext({ req }: { req: Request }) {
	const result = await auth.api.getSession({
		headers: req.headers,
	});

	return {
		session: result?.session ?? null,
		user: result?.user ?? null,
		req,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

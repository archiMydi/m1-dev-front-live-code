import { publicProcedure, router } from "../init";
import { db, s } from "@/db";

export const usersRouter = router({
	list: publicProcedure.query(async () => {
		const users = await db.select().from(s.user);
		return users;
	}),
});

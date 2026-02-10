import { defineConfig } from "drizzle-kit";

const { DB_FILE_NAME: dbUrl } = process.env;
if (!dbUrl) throw new Error("DB_FILE_NAME is not set");

global.IS_DRIZZLE_KIT_TASK = true;

declare global {
	var IS_DRIZZLE_KIT_TASK: boolean;
}

export default defineConfig({
	schema: "./src/db/schema/index.ts",
	dialect: "sqlite",
	dbCredentials: { url: dbUrl },
	verbose: true,
	strict: true,
});

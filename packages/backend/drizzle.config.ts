import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/table.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },
});

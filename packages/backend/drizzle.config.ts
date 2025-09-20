import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/db/table.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:postgres_password@localhost:5432/sagra_torreglia",
  },
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },
});

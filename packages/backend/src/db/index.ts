import { drizzle } from "drizzle-orm/bun-sql";
import { table } from "./table";

// You can specify any property from the bun sql connection options
export const db = drizzle({
  connection: { url: process.env.DATABASE_URL! },
  schema: table,
});

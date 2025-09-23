import { Elysia } from "elysia";
import { db } from "../db/index";
import { DbModels, dbModels } from "../db/model";
import { table } from "../db/table";

export const events = new Elysia({
  prefix: "/events",
  detail: { tags: ["Eventi"] },
})
  .use(DbModels)
  .get(
    "",
    async () => {
      const result = await db.select().from(table.event);

      return dbModels.select.events.assert(result);
    },
    {
      detail: {
        description: "Ottiene tutti gli eventi",
      },
      response: {
        200: "select.events",
      },
    }
  );

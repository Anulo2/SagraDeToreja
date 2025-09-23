import { type } from "arktype";
import { createInsertSchema, createSelectSchema } from "drizzle-arktype";
import { Elysia } from "elysia";
import { table } from "./table";

const eventSelectSchema = createSelectSchema(table.event, {
  // Map date/timestamp columns to strings for OpenAPI compatibility
  startDate: type("string "),
  endDate: type("string "),
  createdAt: type("string.date.iso"),
  updatedAt: type("string.date.iso"),
});

export const dbModels = {
  insert: {
    user: createInsertSchema(table.user, {
      email: type("string.email"),
    }),
    event: createInsertSchema(table.event),
  },
  select: {
    user: createSelectSchema(table.user, {
      email: type("string.email"),
    }),
    event: eventSelectSchema,
    events: eventSelectSchema.array(),
    menu: createSelectSchema(table.menu),
    menuItem: createSelectSchema(table.menuItem),
    menuItemIngredient: createSelectSchema(table.menuItemIngredient),
    ingredient: createSelectSchema(table.ingredient),
    variation: createSelectSchema(table.variation),
    order: createSelectSchema(table.order),
    orderItem: createSelectSchema(table.orderItem),
    orderItemVariation: createSelectSchema(table.orderItemVariation),
    pinnedOrder: createSelectSchema(table.pinnedOrder),
    pinnedOrderItem: createSelectSchema(table.pinnedOrderItem),
    eventTable: createSelectSchema(table.eventTable),
  },
} as const;

// Use the ArkType schema directly for model injection
export const DbModels = new Elysia().model({
  "select.event": dbModels.select.event,
  "select.events": dbModels.select.events,
});

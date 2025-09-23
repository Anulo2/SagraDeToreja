import { relations } from "drizzle-orm";
import {
  account,
  invitation,
  member,
  organization,
  session,
  user,
} from "./auth-schema";
import {
  event,
  eventTable,
  ingredient,
  menu,
  menuItem,
  menuItemIngredient,
  order,
  orderItem,
  orderItemVariation,
  pinnedOrder,
  pinnedOrderItem,
  variation,
} from "./schema";
export const eventRelations = relations(event, ({ many, one }) => ({
  organization: one(organization, {
    fields: [event.organizationId],
    references: [organization.id],
  }),
  author: one(user, {
    fields: [event.authorId],
    references: [user.id],
  }),
  menus: many(menu),
  tables: many(eventTable),
}));

export const menuRelations = relations(menu, ({ many, one }) => ({
  event: one(event, {
    fields: [menu.eventId],
    references: [event.id],
  }),
  orders: many(order),
}));

export const orderRelations = relations(order, ({ one }) => ({
  menu: one(menu, {
    fields: [order.menuId],
    references: [menu.id],
  }),
}));

// Auth schema relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  members: many(member),
  invitations: many(invitation),
  events: many(event),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
  events: many(event),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

// Main schema relations
export const menuItemRelations = relations(menuItem, ({ one, many }) => ({
  menu: one(menu, {
    fields: [menuItem.menuId],
    references: [menu.id],
  }),
  ingredients: many(menuItemIngredient),
  variations: many(variation),
  orderItems: many(orderItem),
}));

export const eventTableRelations = relations(eventTable, ({ one, many }) => ({
  event: one(event, {
    fields: [eventTable.eventId],
    references: [event.id],
  }),
  orders: many(order),
  pinnedOrders: many(pinnedOrder),
}));

export const ingredientRelations = relations(ingredient, ({ many }) => ({
  menuItemIngredients: many(menuItemIngredient),
  variations: many(variation),
}));

export const menuItemIngredientRelations = relations(
  menuItemIngredient,
  ({ one }) => ({
    menuItem: one(menuItem, {
      fields: [menuItemIngredient.menuItemId],
      references: [menuItem.id],
    }),
    ingredient: one(ingredient, {
      fields: [menuItemIngredient.ingredientId],
      references: [ingredient.id],
    }),
  })
);

export const variationRelations = relations(variation, ({ one, many }) => ({
  menuItem: one(menuItem, {
    fields: [variation.menuItemId],
    references: [menuItem.id],
  }),
  ingredient: one(ingredient, {
    fields: [variation.ingredientId],
    references: [ingredient.id],
  }),
  orderItemVariations: many(orderItemVariation),
}));

export const orderItemRelations = relations(orderItem, ({ one, many }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  menuItem: one(menuItem, {
    fields: [orderItem.menuItemId],
    references: [menuItem.id],
  }),
  variations: many(orderItemVariation),
}));

export const orderItemVariationRelations = relations(
  orderItemVariation,
  ({ one }) => ({
    orderItem: one(orderItem, {
      fields: [orderItemVariation.orderItemId],
      references: [orderItem.id],
    }),
    variation: one(variation, {
      fields: [orderItemVariation.variationId],
      references: [variation.id],
    }),
  })
);

export const pinnedOrderRelations = relations(pinnedOrder, ({ one, many }) => ({
  table: one(eventTable, {
    fields: [pinnedOrder.tableId],
    references: [eventTable.id],
  }),
  staff: one(user, {
    fields: [pinnedOrder.staffUserId],
    references: [user.id],
  }),
  items: many(pinnedOrderItem),
}));

export const pinnedOrderItemRelations = relations(
  pinnedOrderItem,
  ({ one }) => ({
    pinnedOrder: one(pinnedOrder, {
      fields: [pinnedOrderItem.pinnedOrderId],
      references: [pinnedOrder.id],
    }),
    order: one(order, {
      fields: [pinnedOrderItem.orderId],
      references: [order.id],
    }),
  })
);

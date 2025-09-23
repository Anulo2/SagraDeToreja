import {
  account,
  invitation,
  member,
  organization,
  session,
  user,
  verification,
} from "./auth-schema";
import {
  eventRelations,
  menuRelations,
  orderRelations,
  sessionRelations,
  userRelations,
} from "./relations";
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

export const table = {
  user,
  session,
  account,
  verification,
  organization,
  member,
  invitation,
  event,
  menu,
  menuItem,
  eventTable,
  ingredient,
  menuItemIngredient,
  variation,
  order,
  orderItem,
  orderItemVariation,
  pinnedOrder,
  pinnedOrderItem,
  eventRelations,
  menuRelations,
  orderRelations,
  userRelations,
  sessionRelations,
} as const;

export type Table = typeof table;

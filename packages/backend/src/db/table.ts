import { verification, user, session, account, organization, member, invitation } from "./auth-schema";
import { event, menu, menuItem, eventTable, ingredient, menuItemIngredient, variation, order, orderItem, orderItemVariation, pinnedOrder, pinnedOrderItem } from "./schema";


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
  pinnedOrderItem
} as const

export * from "./auth-schema"
export * from "./schema"

export type Table = typeof table

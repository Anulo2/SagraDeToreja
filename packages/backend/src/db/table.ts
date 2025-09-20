import { verification, user, session, account, organization, member, invitation } from "./auth-schema";
import { event, menu } from "./schema";

export const table = {
  user,
  session,
  account,
  verification,
  organization,
  member,
  invitation,
  event, menu
} as const

export type Table = typeof table

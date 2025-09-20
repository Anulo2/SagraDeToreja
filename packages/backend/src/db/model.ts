import { table } from './table'
import { spreads } from './utils'
import { createSelectSchema, createInsertSchema } from 'drizzle-arktype'
import { type } from 'arktype'


export const db = {
	insert: spreads({
		user: createInsertSchema(table.user, {
			email: type("string.email")
		}),
	}, 'insert'),
	select: spreads({
		user: createSelectSchema(table.user, {
			email: type("string.email")
		}),
	}, 'select')
} as const

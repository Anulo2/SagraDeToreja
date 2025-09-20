/**
 * @lastModified 2025-02-04
 * @see https://elysiajs.com/recipe/drizzle.html#utility
 */

import type { Type } from 'arktype'
import {
    createInsertSchema,
    createSelectSchema,
} from 'drizzle-arktype'

import { table } from './table'
import type { Table } from 'drizzle-orm'

type ArkTypeSchema = Type<any>

type Spread<
    T extends ArkTypeSchema | Table,
    Mode extends 'select' | 'insert' | undefined,
> = T extends ArkTypeSchema
    ? T['infer']
    : T extends Table
      ? Mode extends 'select'
          ? any // Type inference from drizzle-arktype createSelectSchema
          : Mode extends 'insert'
            ? any // Type inference from drizzle-arktype createInsertSchema
            : Record<string, unknown>
      : Record<string, unknown>

/**
 * Spread a Drizzle schema into a plain object
 */
export const spread = <
    T extends ArkTypeSchema | Table,
    Mode extends 'select' | 'insert' | undefined,
>(
    schema: T,
    mode?: Mode,
): Spread<T, Mode> => {
    let arkSchema: ArkTypeSchema

    switch (mode) {
        case 'insert':
        case 'select':
            // If it's already an ArkType schema
            if (typeof schema === 'function') {
                arkSchema = schema as ArkTypeSchema
                break
            }

            // Generate schema from Drizzle table
            arkSchema =
                mode === 'insert'
                    ? (createInsertSchema as any)(schema)
                    : (createSelectSchema as any)(schema)

            break

        default:
            if (typeof schema !== 'function') {
                throw new Error('Expected an ArkType schema when no mode is provided')
            }
            arkSchema = schema as ArkTypeSchema
    }

    // Return the schema's inferred type
    return arkSchema.infer as Spread<T, Mode>
}

/**
 * Spread a Drizzle Table into a plain object
 *
 * If `mode` is 'insert', the schema will be refined for insert
 * If `mode` is 'select', the schema will be refined for select
 * If `mode` is undefined, the schema will be spread as is, models will need to be refined manually
 */
export const spreads = <
    T extends Record<string, ArkTypeSchema | Table>,
    Mode extends 'select' | 'insert' | undefined,
>(
    models: T,
    mode?: Mode,
): {
    [K in keyof T]: Spread<T[K], Mode>
} => {
    const newSchema: Record<string, unknown> = {}
    const keys = Object.keys(models)

    for (const key of keys) {
        const schema = models[key]

        if (mode === 'insert' || mode === 'select') {
            // Generate appropriate schema for tables
            if (typeof schema === 'object' && schema !== null && '_' in schema) {
                newSchema[key] = mode === 'insert'
                    ? (createInsertSchema as any)(schema)
                    : (createSelectSchema as any)(schema)
            } else {
                newSchema[key] = schema
            }
        } else {
            newSchema[key] = schema
        }
    }

    return newSchema as {
        [K in keyof T]: Spread<T[K], Mode>
    }
}

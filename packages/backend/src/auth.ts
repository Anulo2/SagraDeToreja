import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "./db";
import { username } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { organization } from "better-auth/plugins"
import { multiSession } from "better-auth/plugins"

export const auth = betterAuth({
   basePath: '/api',
  database: drizzleAdapter(db, {
    provider: "pg", // Using PostgreSQL based on the schema
  }),
  plugins: [openAPI(),   username(), admin() ,         organization(),         multiSession() ],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // Add social providers here if needed
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
  },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

export const OpenAPI = {
    getPaths: (prefix = '/auth/api') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)

            for (const path of Object.keys(paths)) {
                const key = prefix + path
                reference[key] = paths[path]

                for (const method of Object.keys(paths[path])) {
                    const operation = (reference[key] as any)[method]

                    operation.tags = ['Better Auth']
                }
            }

            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const

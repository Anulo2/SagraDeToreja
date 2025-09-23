import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin,
  multiSession,
  openAPI,
  organization,
  username,
} from "better-auth/plugins";
import { db } from "./db";

type PluginBase = NonNullable<BetterAuthOptions["plugins"]>[number];
type OpenApiPlugin = ReturnType<typeof openAPI>;
type CustomBetterAuthOptions = Omit<BetterAuthOptions, "plugins"> & {
  plugins: Array<PluginBase | OpenApiPlugin>;
};

const authConfig: CustomBetterAuthOptions = {
  appName: "Sagra Torreglia",
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "pg", // Using PostgreSQL based on the schema
  }),
  plugins: [openAPI(), username(), admin(), organization(), multiSession()],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key",
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3001"],
  socialProviders: {
    // Add social providers here if needed
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authConfig) as ReturnType<
  typeof betterAuth<typeof authConfig>
>;

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
// biome-ignore lint/suspicious/noAssignInExpressions: <In the docs it's done like this>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          // biome-ignore lint/suspicious/noExplicitAny: <In the docs it's done like this>
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
      // biome-ignore lint/suspicious/noExplicitAny: <In the docs it's done like this>
    }) as Promise<any>,
  // biome-ignore lint/suspicious/noExplicitAny: <In the docs it's done like this>
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;

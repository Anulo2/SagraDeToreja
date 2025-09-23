import {
  type AccountViewPath,
  type AuthViewPath,
  accountViewPaths,
  authViewPaths,
  type OrganizationViewPath,
  organizationViewPaths,
} from "@daveyplate/better-auth-ui";

type ViewKey = string;

type ViewRecord<K extends ViewKey> = Record<K, string>;

const hasOwnProperty = <T extends Record<string, unknown>>(
  object: T,
  key: PropertyKey
): key is keyof T => Object.hasOwn(object, key);

const createResolver = <const K extends ViewKey, const T extends ViewRecord<K>>(
  paths: T,
  fallback: K
) => {
  const entries = Object.entries(paths) as Array<[K, string]>;

  return (maybe?: string) => {
    if (maybe && hasOwnProperty(paths, maybe)) {
      const key = maybe as K;
      return { key, path: paths[key] } as const;
    }

    const match = maybe
      ? entries.find(([, value]) => value === maybe)
      : undefined;

    const key = match?.[0] ?? fallback;

    return { key, path: paths[key] } as const;
  };
};

export const resolveAuthView = createResolver<
  AuthViewPath,
  typeof authViewPaths
>(authViewPaths, "SIGN_IN");

export const resolveAccountView = createResolver<
  AccountViewPath,
  typeof accountViewPaths
>(accountViewPaths, "SETTINGS");

export const resolveOrganizationView = createResolver<
  OrganizationViewPath,
  typeof organizationViewPaths
>(organizationViewPaths, "SETTINGS");

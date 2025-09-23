import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { authClient } from "@/api/auth";
import { RootLayout } from "@/layouts/RootLayout";
import {
  resolveAccountView,
  resolveAuthView,
  resolveOrganizationView,
} from "@/lib/viewPaths";

const HomePage = lazyRouteComponent(
  () => import("@/pages/HomePage"),
  "HomePage"
);
const LoginPage = lazyRouteComponent(
  () => import("@/pages/LoginPage"),
  "LoginPage"
);
const SignupPage = lazyRouteComponent(
  () => import("@/pages/SignupPage"),
  "SignupPage"
);
const AuthViewPage = lazyRouteComponent(
  () => import("@/pages/AuthViewPage"),
  "AuthViewPage"
);
const AccountViewPage = lazyRouteComponent(
  () => import("@/pages/AccountViewPage"),
  "AccountViewPage"
);
const OrganizationViewPage = lazyRouteComponent(
  () => import("@/pages/OrganizationViewPage"),
  "OrganizationViewPage"
);

export type RouterContext = {
  auth: typeof authClient;
};

const isDev = import.meta.env.DEV ?? false;

const RootRouteComponent = () => (
  <RootLayout>
    <Outlet />
    {isDev ? <TanStackRouterDevtools position="bottom-right" /> : null}
  </RootLayout>
);

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootRouteComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/$view",
  component: AuthViewPage,
  loader: ({ params }) => {
    const { key, path } = resolveAuthView(params.view);

    return { viewKey: key, viewPath: path } as const;
  },
  pendingComponent: () => null,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account/$view",
  component: AccountViewPage,
  loader: ({ params }) => {
    const { key, path } = resolveAccountView(params.view);

    return { viewKey: key, viewPath: path } as const;
  },
  pendingComponent: () => null,
});

const organizationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/organization/$slug/$view",
  component: OrganizationViewPage,
  loader: ({ params }) => {
    const { key, path } = resolveOrganizationView(params.view);

    return { viewKey: key, viewPath: path } as const;
  },
  pendingComponent: () => null,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  authRoute,
  accountRoute,
  organizationRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    auth: authClient,
  },
});

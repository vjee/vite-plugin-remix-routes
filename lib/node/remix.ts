import { defineConventionalRoutes } from "@remix-run/dev/config/routesConvention";
import type { ConfigRoute, RouteManifest } from "@remix-run/dev/config/routes";

interface Options {
  appDir: string;
  is404Route?: (route: Route) => boolean;
}

/**
 * See `readConfig` in @remix-run/dev/config.ts
 */
export function getRoutes(options: Options) {
  const { appDir, is404Route = (route) => route.id.endsWith("/404") } = options;

  const routeManifest: RouteManifest = {
    root: { path: "", id: "root", file: "routes/index" },
  };

  const conventionalRoutes = defineConventionalRoutes(appDir);

  for (const key of Object.keys(conventionalRoutes)) {
    const route = conventionalRoutes[key];
    routeManifest[route.id] = {
      ...route,
      parentId: route.parentId || "root",
    };
  }

  const routes = createRoutes(routeManifest)[0].children;

  // This is not part of remix.
  const modifyRoute = (route: Route): Route => ({
    ...route,
    path: is404Route(route) ? "*" : route.path,
    children: route.children.map(modifyRoute),
  });

  return routes.map(modifyRoute);
}

/**
 * See `createClientRoutes` in @remix-run/react/routes.tsx
 */
export function createRoutes(
  routeManifest: RouteManifest,
  parentId?: string
): Route[] {
  return Object.keys(routeManifest)
    .filter((key) => routeManifest[key].parentId === parentId)
    .map((key) => {
      const route = createRoute(routeManifest[key]);
      route.children = createRoutes(routeManifest, route.id);
      return route;
    });
}

/**
 * See `createClientRoute` in @remix-run/react/routes.tsx
 */
export function createRoute(route: ConfigRoute): Route {
  return {
    id: route.id,
    file: route.file,

    path: route.path || "",
    index: !!route.index,
    children: [],
  };
}

export interface Route {
  // custom properties
  id: string;
  file: string;

  // react-router route properties
  path: string;
  index: boolean;
  children: Route[];
}

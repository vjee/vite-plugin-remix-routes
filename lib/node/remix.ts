import { defineConventionalRoutes } from "@remix-run/dev/config/routesConvention";
import type { ConfigRoute, RouteManifest } from "@remix-run/dev/config/routes";

interface Options {
  appDir: string;
  is404Route: (route: Route) => boolean;
}

/**
 * See `readConfig` in @remix-run/dev/config.ts
 */
export function getRoutes({ appDir, is404Route }: Options) {
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

  return routes.map((route) => {
    if (is404Route(route)) {
      return { ...route, path: "*" };
    }

    return route;
  });
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
      const children = createRoutes(routeManifest, route.id);
      if (children.length > 0) route.children = children;
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

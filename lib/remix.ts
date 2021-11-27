import { defineConventionalRoutes } from "@remix-run/dev/config/routesConvention";
import type { ConfigRoute, RouteManifest } from "@remix-run/dev/config/routes";
import type { Route } from "./types";

/**
 * See `readConfig` in @remix-run/dev/config.ts
 */
export function getRoutes(appDir: string) {
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

  return createRoutes(routeManifest)[0].children;
}

/**
 * See `createClientRoutes` in @remix-run/react/routes.tsx
 */
function createRoutes(
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
function createRoute(route: ConfigRoute): Route {
  return {
    id: route.id,
    file: route.file,

    path: route.path || "",
    index: !!route.index,
    caseSensitive: !!route.caseSensitive,
    children: [],
  };
}

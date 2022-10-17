import { defineConventionalRoutes } from "@remix-run/dev/dist/config/routesConvention";
import {
  ConfigRoute,
  RouteManifest,
  defineRoutes,
} from "@remix-run/dev/dist/config/routes";
import type { PluginOptions } from "./index";
import type { AppConfig } from "@remix-run/dev/dist/config";
import type { RequireOnly } from "./utils";

export type RemixOptions = Pick<
  AppConfig,
  "appDirectory" | "routes" | "ignoredRouteFiles"
>;

type GetRouteOptions = Omit<PluginOptions, "importModule"> &
  RequireOnly<RemixOptions, "appDirectory">;

/**
 * See `readConfig` in @remix-run/dev/config.ts
 */
export async function getRoutes(options: GetRouteOptions) {
  const {
    appDirectory,
    is404Route = (route) => route.id.endsWith("/404"),
    ignoredRouteFiles,
    routes,
  } = options;

  const routeManifest: RouteManifest = {
    root: { path: "", id: "root", file: "routes/index" },
  };

  const conventionalRoutes = defineConventionalRoutes(
    appDirectory,
    ignoredRouteFiles
  );

  for (const key of Object.keys(conventionalRoutes)) {
    const route = conventionalRoutes[key];
    routeManifest[route.id] = {
      ...route,
      parentId: route.parentId || "root",
    };
  }

  if (routes) {
    let manualRoutes = await routes(defineRoutes);
    for (const key of Object.keys(manualRoutes)) {
      const route = manualRoutes[key];
      routeManifest[route.id] = {
        ...route,
        parentId: route.parentId || "root",
      };
    }
  }

  const routeConfig = createRoutes(routeManifest)[0].children;

  // This is not part of remix.
  const modifyRoute = (route: Route): Route => ({
    ...route,
    path: is404Route(route) ? "*" : route.path,
    children: route.children.map(modifyRoute),
  });

  return routeConfig.map(modifyRoute);
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

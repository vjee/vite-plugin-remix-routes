import path from "node:path";
import type { Plugin } from "vite";

import { getRoutes } from "./remix";
import type { Route } from "./remix";
import { stringifyRoutes } from "./utils";

interface Options {
  /**
   * An absolute path to the folder containing the `routes` folder.
   * This will most likely be your `/src` folder.
   *
   * @default path.join(process.cwd(), "src")
   */
  appDir?: string;

  /**
   * A function that receives a `Route` to determine if the route's component
   * should be imported synchronously or asynchronously.
   *
   * @default () => "sync"
   */
  importMode?: (route: Route) => "async" | "sync";

  /**
   * A function that receives a `Route` to determine if it should be a 404 route. (`path="*"`)
   * By default this matches the same 404 file as Remix does.
   * Keep in mind this only receives top level routes, so you can't mark nested routes
   * as 404 routes.
   *
   * @default (route) => route.id === "routes/404"
   */
  is404Route?: (route: Route) => boolean;
}

function plugin(options?: Options): Plugin {
  const virtualModuleId = "virtual:remix-routes";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const appDir = options?.appDir || path.join(process.cwd(), "src");
  const importMode = options?.importMode || (() => "sync");
  const is404Route =
    options?.is404Route || ((route) => route.id === "routes/404");

  const prefix = appDir.replace(process.cwd(), "");

  return {
    name: "vite-plugin-remix-routes",

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        const routes = getRoutes({ appDir, is404Route });

        const { routesString, componentsString } = stringifyRoutes(routes, {
          prefix,
          importMode,
        });

        return (
          `import { createElement, lazy, useEffect } from 'react';\n` +
          `${componentsString}\n` +
          `export default ${routesString};\n`
        );
      }
    },
  };
}

export default plugin;
export { getRoutes, stringifyRoutes };

export type { Route };

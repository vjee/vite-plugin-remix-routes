import path from "node:path";
import fs from "node:fs";

import type { Plugin } from "vite";

import { getRoutes, RemixOptions } from "./remix";
import type { Route } from "./remix";
import { stringifyRoutes } from "./utils";

export interface Options extends PluginOptions, RemixOptions {}
export interface PluginOptions {
  /**
   * Set this to `false` if you're not using a router compatible with the data APIs
   * released in react-router 6.4.
   * https://reactrouter.com/en/main/routers/picking-a-router#using-v64-data-apis
   *
   * @default true
   */
  dataRouterCompatible?: boolean;

  /**
   * NOTE: This option only works if `dataRouterCompatible` is set to `false`.
   *
   * A function that receives a `Route` to determine if the route's component
   * should be imported synchronously or asynchronously.
   *
   * @default () => "sync"
   */
  importMode?: (route: Route) => "async" | "sync";

  /**
   * NOTE: This option only works if `dataRouterCompatible` is set to `false`.
   *
   * A function that receives a `Route` to determine if it should be a 404 route. (`path="*"`)
   * By default this matches the same 404 file as Remix does.
   * Keep in mind this only receives top level routes, so you can't mark nested routes
   * as 404 routes.
   *
   * @default (route) => route.id === "routes/404"
   */
  is404Route?: (route: Route) => boolean;
}

function plugin(options: Options = {}): Plugin {
  const virtualModuleId = "virtual:remix-routes";

  const {
    appDirectory = "app",
    dataRouterCompatible,
    importMode,
    is404Route,
    routes,
    ignoredRouteFiles,
  } = options;

  const dir = path.resolve(process.cwd(), appDirectory);

  if (
    !fs.existsSync(path.join(dir, "routes")) ||
    !fs.statSync(path.join(dir, "routes")).isDirectory()
  ) {
    throw new Error(
      `[vite-plugin-remix-routes] routes directory not found in appDirectory: ${path.relative(
        process.cwd(),
        appDirectory
      )}`
    );
  }

  const prefix = `.${path.sep}${path.relative(process.cwd(), dir)}`;

  return {
    name: "vite-plugin-remix-routes",

    resolveId(id) {
      if (id === virtualModuleId) {
        return id;
      }
    },

    async load(id) {
      if (id === virtualModuleId) {
        const generatedRoutes = await getRoutes({
          appDirectory: dir,
          dataRouterCompatible,
          is404Route,
          routes,
          ignoredRouteFiles,
        });

        const { routesString, componentsString } = stringifyRoutes(
          generatedRoutes,
          { prefix, dataRouterCompatible, importMode }
        );

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

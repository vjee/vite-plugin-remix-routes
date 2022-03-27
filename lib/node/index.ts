import path from "node:path";
import fs from "node:fs";

import type { Plugin } from "vite";

import { getRoutes, RemixOptions } from "./remix";
import type { Route } from "./remix";
import { stringifyRoutes } from "./utils";

export interface Options extends PluginOptions, RemixOptions {}
export interface PluginOptions {
  /**
   * An absolute path to the folder containing the `routes` folder.
   * This will most likely be your `/src` folder.
   *
   * @deprecated Use `appDirectory` instead
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

function plugin(options: Options = {}): Plugin {
  const virtualModuleId = "virtual:remix-routes";

  const { appDirectory = "app", importMode, ...otherOptions } = options;

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
        const routes = await getRoutes({ appDirectory: dir, ...otherOptions });

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

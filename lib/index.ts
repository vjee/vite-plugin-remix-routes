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
   * A function that receives `Route` to determine if the route's component
   * should be imported synchronously or asynchronously.
   *
   * @default () => "sync"
   */
  importMode?: (route: Route) => "async" | "sync";
}

function reactRemixRoutes(options?: Options): Plugin {
  const virtualModuleId = "virtual:react-remix-routes";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const appDir = options?.appDir || path.join(process.cwd(), "src");
  const importMode = options?.importMode || (() => "sync");

  const prefix = appDir.replace(process.cwd(), "");

  return {
    name: "react-remix-routes",

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        const routes = getRoutes(appDir);
        const context = { prefix, importMode };

        const { routesString, componentsString } = stringifyRoutes(
          routes,
          context
        );

        return sourceCode(routesString, componentsString);
      }
    },
  };
}

function sourceCode(routesString: string, componentsString: string) {
  return `
import { createElement, lazy, useEffect } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';

${componentsString}

export default ${routesString};

export function EagerLoader({ routes }) {
  const location = useLocation();

  useEffect(() => {
    const matches = matchRoutes(routes, location) || [];

    for (const match of matches) {
      match.route.loader?.();
    }
  }, [location]);

  return null;
}
`;
}

export default reactRemixRoutes;
export { getRoutes, stringifyRoutes };

export type { Route };

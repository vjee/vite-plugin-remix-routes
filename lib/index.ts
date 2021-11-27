import path from "node:path";
import type { Plugin } from "vite";
import { getRoutes } from "./remix";
import { stringifyRoutes } from "./stringify";

export * from "./remix";
export * from "./stringify";

interface Options {
  /**
   * An absolute path to the folder containing the `routes` folder.
   * This will most likely be your `/src` folder.
   *
   * @default path.join(process.cwd(), "src")
   */
  appDir: string;
}

export default function reactRemixRoutes(options?: Options): Plugin {
  const virtualModuleId = "virtual:react-remix-routes";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const appDir = options?.appDir || path.join(process.cwd(), "src");
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
        const routesArray = getRoutes(appDir);
        const routesString = stringifyRoutes(routesArray, prefix);

        return (
          `import {createElement,lazy} from 'react';\n` +
          `export default ${routesString}`
        );
      }
    },
  };
}

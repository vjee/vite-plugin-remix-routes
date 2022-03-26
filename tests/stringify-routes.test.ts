import path from "node:path";
import url from "node:url";

import routesStringFixture from "./fixtures/routes-string.js";
import componentsStringFixture from "./fixtures/components-string.js";

import { getRoutes, stringifyRoutes } from "../lib/node";
import type { Context } from "../lib/node/utils";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const appDir = path.join(dirname, "../examples/basic/src");

test("stringifyRoutes", async () => {
  const routes = getRoutes({ appDir });
  const prefix = "/src";
  const importMode: Context["importMode"] = (route) =>
    route.id.startsWith("routes/demos/about") ? "async" : "sync";

  const { routesString, componentsString } = stringifyRoutes(routes, {
    prefix,
    importMode,
  });

  expect(routesString).toEqual(routesStringFixture);
  expect(componentsString).toEqual(componentsStringFixture);
});

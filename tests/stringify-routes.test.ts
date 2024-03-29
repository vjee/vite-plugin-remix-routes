import path from "node:path";
import url from "node:url";

import { getRoutes, stringifyRoutes } from "../lib/node";
import type { Context } from "../lib/node/utils";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const appDirectory = path.join(dirname, "../examples/basic/app");

test("stringifyRoutes", async () => {
  const routes = await getRoutes({ appDirectory });
  const prefix = "/app";
  const importMode: Context["importMode"] = (route) =>
    route.id.startsWith("routes/demos/about") ? "async" : "sync";

  const { routesString, componentsString } = stringifyRoutes(routes, {
    prefix,
    importMode,
    dataRouterCompatible: false,
  });

  expect(routesString).toMatchSnapshot();
  expect(componentsString).toMatchSnapshot();
});

test("stringifyRoutes for data router", async () => {
  const routes = await getRoutes({ appDirectory });
  const prefix = "/app";

  const { routesString, componentsString } = stringifyRoutes(routes, {
    prefix,
    dataRouterCompatible: true,
  });

  expect(routesString).toMatchSnapshot();
  expect(componentsString).toMatchSnapshot();
});

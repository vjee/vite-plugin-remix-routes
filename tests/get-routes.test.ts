import path from "node:path";
import url from "node:url";

import { getRoutes } from "../lib/node";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const appDirectory = path.join(dirname, "./__testproject__");

test("getRoutes", async () => {
  const routes = await getRoutes({ appDirectory, dataRouterCompatible: false });

  expect(routes).toMatchSnapshot();
});

test("getRoutes with manual routes specified by options", async () => {
  const file = "routes/demos/about/whoa.js";
  const path = "/foo/bar";
  const routes = await getRoutes({
    appDirectory,
    dataRouterCompatible: false,
    routes: async (defineRoutes) => {
      return defineRoutes((route) => {
        route(path, file);
      });
    },
  });

  expect(routes).toMatchSnapshot();
  expect(routes.find((r) => r.path === path)).toContain({ file });
});

test("getRoutes ignores files from ignoredRouteFiles", async () => {
  // Verify the positive case first
  let routes = await getRoutes({
    appDirectory,
    dataRouterCompatible: true,
  });
  const testRoute = routes.find((r) => r.file === "routes/one.two.three.js");
  expect(routes).toContain(testRoute);

  // Then ensure that it actually is removed
  routes = await getRoutes({
    appDirectory,
    dataRouterCompatible: true,
    ignoredRouteFiles: ["one.two.three.js"],
  });
  expect(routes).not.toContain(testRoute);
});

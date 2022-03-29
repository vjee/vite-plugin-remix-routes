import path from "node:path";
import url from "node:url";

import { getRoutes } from "../lib/node";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const appDirectory = path.join(dirname, "../examples/basic/app");

test("getRoutes", async () => {
  const routes = await getRoutes({ appDirectory });

  expect(routes).toMatchSnapshot();
});

test("getRoutes with manual routes specified by options", async () => {
  const file = "routes/demos/about/whoa.tsx";
  const path = "/foo/bar";
  const routes = await getRoutes({
    appDirectory,
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
  });
  const testRoute = routes.find((r) => r.file === "routes/one.two.three.tsx");
  expect(routes).toContain(testRoute);

  // Then ensure that it actually is removed
  routes = await getRoutes({
    appDirectory,
    ignoredRouteFiles: ["one.two.three.tsx"],
  });
  expect(routes).not.toContain(testRoute);
});

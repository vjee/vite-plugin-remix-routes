import path from "node:path";
import url from "node:url";

import routesArrayFixture from "./fixtures/routes-array.js";

import { getRoutes } from "../lib/node";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const appDir = path.join(dirname, "../examples/basic/src");

test("getRoutes", async () => {
  const routes = getRoutes({ appDir });
  const actual = JSON.stringify(routes, null, 4);

  expect(actual).toEqual(routesArrayFixture);
});

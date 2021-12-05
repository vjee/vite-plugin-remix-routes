import path from "node:path";
import url from "node:url";
import { test } from "uvu";
import * as assert from "uvu/assert";

import routesArrayFixture from "./fixtures/routesArray.fixture.js";

import { getRoutes } from "../dist";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const appDir = path.join(dirname, "../examples/basic/src");

test("getRoutes", async () => {
  const routes = getRoutes({
    appDir,
    is404Route: (route) => route.id === "routes/404",
  });
  const actual = JSON.stringify(routes, null, 4);

  assert.fixture(actual, routesArrayFixture);
});

test.run();
